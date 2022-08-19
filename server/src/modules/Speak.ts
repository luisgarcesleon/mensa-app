import * as Joi from '@hapi/joi';
import { Client } from '../Client';
import { History } from '../History';
import { Meeting } from '../Meeting';

export default class {

     private meeting: Meeting;

     private enabled = false;
     private list: any[] = [];

     private history: History = new History(1);

     constructor(meeting: Meeting) {
          this.meeting = meeting;
     }

     public state() {
          return {
               enabled: this.enabled,
               list: this.list
          }
     }

     public bind(client: Client) {
          if (client.roles & Client.CHAIRMAN) {
               client.on('chairman/mode/speak/next', ({ id }) => {
                    if (!this.list.length) {
                         return client.send(id, {
                              error: true
                         })
                    }

                    this.history.save(this.list);

                    const item = this.list.shift();

                    if (!item) {
                         return client.send(id, {
                              error: true
                         })
                    }

                    {
                         const client = this.meeting.clients
                              .filter((_client) => _client.roles & Client.DELEGATE)
                              .find((_client) => _client.state.user.id === item.user.id)

                         if (client) {
                              client.state[item.type] = false;
                         }
                    }

                    client.send(id, {
                         error: false
                    })

                    this.setClientPositions();

                    this.meeting.broadcastState();
               })

               client.on('chairman/mode/speak/clear', ({ id }) => {
                    if (!this.list.length) {
                         return client.send(id, {
                              error: true
                         })
                    }

                    this.history.save(this.list);
                    this.list.length = 0;

                    for (const client of this.meeting.clients) {
                         client.state.request = false;
                         client.state.pm = false;
                    }

                    client.send(id, {
                         error: false
                    })

                    this.setClientPositions();

                    this.meeting.broadcastState();
               })

               client.on('chairman/mode/speak/revert', ({ id }) => {
                    const state = this.history.back(0);

                    if (!state) {
                         return client.send(id, {
                              error: true
                         })
                    }

                    this.history.save(this.list);
                    this.list = state;

                    for (const client of this.meeting.clients.filter((_client) => _client.roles & Client.DELEGATE)) {
                         client.state.request = this.list.find((item: any) => item.user.id === client.state.user.id && item.type === 'request') ? true : false;
                         client.state.pm = this.list.find((item: any) => item.user.id === client.state.user.id && item.type === 'pm') ? true : false;
                    }

                    client.send(id, {
                         error: false
                    })

                    this.setClientPositions();

                    this.meeting.broadcastState();
               })

               client.on('chairman/mode/speak/add', ({ data, id }) => {
                    if (!this.enabled) {
                         return client.send(id, {
                              error: true
                         })
                    }

                    const schema = Joi.object().keys({
                         name: Joi.string().min(3).required(),
                         cc: Joi.string().length(2).uppercase().required()
                    })

                    const { error, value } = schema.validate(data);

                    if (error) {
                         return client.send(id, {
                              error: true,
                              message: error.message
                         })
                    }

                    this.list.push({
                         type: 'request',
                         user: value
                    })

                    client.send(id, {
                         error: false
                    })

                    this.setClientPositions();

                    this.meeting.broadcastState();
               })

               client.on('chairman/mode/speak/enable', ({ id }) => {
                    this.enabled = true;

                    client.send(id, {
                         error: false
                    })

                    this.meeting.broadcastState();
               })

               client.on('chairman/mode/speak/disable', ({ id }) => {
                    this.enabled = false;

                    client.send(id, {
                         error: false
                    })

                    this.meeting.broadcastState();
               })
          }

          if (client.roles & Client.DELEGATE) {
               client.on('delegate/mode/speak', ({ data, id }) => {
                    if (!this.enabled ||
                         ![
                              'request',
                              'pm'
                         ].includes(data.type)
                    ) {
                         return client.send(id, {
                              error: true
                         })
                    }

                    switch (data.state) {
                         case true:
                              if (client.state[data.type]) {
                                   return client.send(id, {
                                        error: true
                                   })
                              }

                              switch (data.type) {
                                   case 'request':
                                        this.list.push({
                                             type: data.type,
                                             user: client.state.user
                                        })
                                        break;
                                   case 'pm':
                                        let index = this.list.length ? 1 : 0;

                                        for (let i = this.list.length - 1; i >= 0; i--) {
                                             if (this.list[i].type === 'pm') index = i + 1;
                                        }

                                        this.list.splice(index, 0, {
                                             type: data.type,
                                             user: client.state.user
                                        })
                                        break;
                              }

                              client.state[data.type] = true;
                              break;
                         case false:
                              if (!client.state[data.type]) {
                                   return client.send(id, {
                                        error: true
                                   })
                              }

                              const index = this.list
                                   .findIndex((item: any) => item.user.id === client.state.user.id && item.type === data.type);

                              this.list.splice(index, 1);

                              client.state[data.type] = false;
                              break;
                         default:
                              return client.send(id, {
                                   error: true
                              })
                    }

                    client.send(id, {
                         error: false
                    })

                    this.setClientPositions();

                    this.meeting.broadcastState();
               })
          }
     }

     private setClientPositions() {
          const clients: { [key: string]: Client } = {};

          for (const client of this.meeting.clients) {
               if (client.roles & Client.CHAIRMAN) continue;

               client.state.speakPosition = 0;
               clients[client.state.user.id] = client;
          }

          for (let i = this.list.length - 1; i >= 0; i--) {
               const delegate = this.list[i];
               const client = clients[delegate.user.id];

               if (!client) continue;

               client.state.speakPosition = i + 1;
          }
     }

}