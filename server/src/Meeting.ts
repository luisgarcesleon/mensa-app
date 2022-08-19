import { EventEmitter } from 'events';
import { Client } from './Client';
import Broadcast from './modules/Broadcast';
import Speak from './modules/Speak';
import Vote from './modules/Vote';

export class Meeting extends EventEmitter {

     public id: string;
     private token: string;
     public delegates: any[];

     public modules: any[];

     private module = 'start';

     public clients: Client[] = [];

     public sessions: Map<string, any> = new Map();

     constructor(meeting: any, delegates: any[]) {
          super();

          this.id = meeting.id;
          this.token = meeting.token;

          this.delegates = delegates;

          this.modules = [
               new Speak(this),
               new Vote(this),
               new Broadcast(this)
          ]
     }

     public state() {
          return {
               mode: this.module,
               speak: this.modules[0].state(),
               vote: this.modules[1].state(),
               broadcast: this.modules[2].state()
          }
     }

     public bind(client: Client) {
          if (client.roles & Client.CHAIRMAN) {
               client.on('chairman/meeting/mode', ({ data, id }) => {
                    this.module = data.mode;

                    client.send(id, {
                         error: false
                    })

                    this.broadcastState();
               })

               client.on('chairman/meeting/delegates', ({ id }) => {
                    client.send(id, {
                         delegates: this.delegates
                    })
               })
          }

          client.on('meeting/state', () => {
               client.send('meeting/state', {
                    timestamp: +new Date,
                    meeting: this.state(),
                    client: client.state
               })
          })

          for (const mode of this.modules) {
               mode.bind(client);
          }
     }

     public getSession(id: string) {
          if (!this.sessions.has(id)) {
               this.sessions.set(id, {});
          }

          return this.sessions.get(id);
     }

     public addClient(client: Client) {
          this.bind(client);
          this.clients.push(client);

          this.emit('connect', client);
     }

     public removeClient(client: Client) {
          if (!this.clients.includes(client)) return;
          this.clients.splice(this.clients.indexOf(client), 1);

          this.emit('disconnect', client);
     }

     public sendState(client: Client) {
          client.send('meeting/state', {
               timestamp: +new Date,
               meeting: this.state(),
               client: client.state
          })
     }

     public broadcast(name: string, data: any) {
          for (const client of this.clients) {
               client.send(name, data);
          }
     }

     public broadcastState() {
          const meetingState = this.state();

          const timestamp = +new Date;

          for (const client of this.clients) {
               client.send('meeting/state', {
                    timestamp,
                    meeting: meetingState,
                    client: client.state
               })
          }
     }

}