import * as joi from '@hapi/joi';
import pick from 'object.pick';
import uuid from 'uuid';
import { VOTE_OPTIONS } from '../../../shared';
import { Client } from '../Client';
import { database } from '../database';
import { Meeting } from '../Meeting';


export default class {

     private meeting: Meeting;

     private enabled = false;

     private motion: any = {
          id: uuid(),
          number: '1',
          name: '-',
          secret: false
     }

     private summary: any = false;

     private count = 0;
     private total = 0;

     private votes: any = {};

     constructor(meeting: Meeting) {
          this.meeting = meeting;

          for (const delegate of this.meeting.delegates) {
               if (!delegate.weight) continue;

               this.votes[delegate.id] = {
                    user: pick(delegate, [
                         'name',
                         'initials',
                         'cc',
                         'weight'
                    ]),
                    vote: VOTE_OPTIONS.DID_NOT_VOTE
               }
          }

          this.total = this.meeting.delegates.filter((delegate) => delegate.weight).length;
     }

     public state() {
          return {
               enabled: this.enabled,
               motion: this.motion,
               votes: Object.values(this.votes).map((delegate: any) => ({
                    ...delegate,
                    vote: delegate.vote === VOTE_OPTIONS.DID_NOT_VOTE ? VOTE_OPTIONS.DID_NOT_VOTE : this.motion.secret ? delegate.vote !== VOTE_OPTIONS.DID_NOT_VOTE : delegate.vote
               })),
               summary: this.summary,
               count: this.count,
               total: this.total
          }
     }

     public bind(client: Client) {
          if (client.roles & Client.CHAIRMAN) {
               client.on('chairman/mode/vote/enable', async ({ data, id }) => {
                    const schema = joi.object().keys({
                         number: joi.number().min(0).required(),
                         name: joi.string().required(),
                         secret: joi.boolean().required()
                    })

                    const { error, value } = schema.validate(data);

                    if (error) {
                         return client.send(id, {
                              error: true,
                              message: error.message
                         })
                    }

                    this.motion.number = value.number;
                    this.motion.name = value.name;
                    this.motion.secret = value.secret;

                    this.motion.id = await new Promise((resolve) => {
                         database.prepare('INSERT INTO vote_motions (meeting, number, name) VALUES (?, ?, ?)').run([
                              this.meeting.id,
                              this.motion.number,
                              this.motion.name
                         ], function (err) {
                              resolve(this.lastID);
                         })
                    })

                    this.enabled = true;

                    this.count = 0;
                    this.summary = false;

                    for (const delegate of this.meeting.delegates) {
                         if (!delegate.weight) continue;

                         this.votes[delegate.id].vote = VOTE_OPTIONS.DID_NOT_VOTE;

                         const state = this.meeting.getSession(delegate.id);

                         if (state) {
                              state.vote = VOTE_OPTIONS.DID_NOT_VOTE;
                         }
                    }

                    client.send(id, {
                         error: false
                    })

                    this.meeting.broadcastState();
               })

               client.on('chairman/mode/vote/disable', async ({ id }) => {
                    this.enabled = false;

                    this.summary = {
                         [VOTE_OPTIONS.YES]: 0,
                         [VOTE_OPTIONS.NO]: 0,
                         [VOTE_OPTIONS.ABSTAIN]: 0,
                         [VOTE_OPTIONS.DID_NOT_VOTE]: 0
                    }

                    const query = database.prepare('INSERT INTO votes (meeting, motion, delegate, vote) VALUES (?, ?, ?, ?)');

                    for (const delegate of this.meeting.delegates) {
                         const state = this.meeting.sessions.get(delegate.id);
                         let vote = state ? state.vote : VOTE_OPTIONS.DID_NOT_VOTE;
                         vote = vote || VOTE_OPTIONS.DID_NOT_VOTE;

                         this.summary[vote] += delegate.weight;

                         query.run([
                              this.meeting.id,
                              this.motion.id,
                              delegate.id,
                              this.motion.secret ? VOTE_OPTIONS.SECRET : vote
                         ])
                    }

                    query.finalize();

                    client.send(id, {
                         error: false
                    })

                    this.meeting.broadcastState();
               })
          }

          if (client.roles & Client.DELEGATE) {
               client.on('delegate/mode/vote', ({ data, id }) => {
                    if (
                         !this.enabled ||
                         !client.state.user.weight ||
                         ![
                              VOTE_OPTIONS.YES,
                              VOTE_OPTIONS.NO,
                              VOTE_OPTIONS.ABSTAIN,
                              VOTE_OPTIONS.DID_NOT_VOTE,
                         ].includes(data.vote)
                    ) {
                         return client.send(id, {
                              error: true
                         })
                    }

                    client.state.vote = data.vote;
                    this.votes[client.state.user.id].vote = data.vote;

                    this.count = Object.values(this.votes)
                         .map((delegate: any) => delegate.vote)
                         .filter((vote) => vote !== VOTE_OPTIONS.DID_NOT_VOTE).length

                    client.send(id, {
                         error: false
                    })

                    this.meeting.broadcastState();
               })
          }
     }

}