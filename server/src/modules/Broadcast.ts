import { Client } from '../Client';
import { Meeting } from '../Meeting';

export default class {

     private meeting: Meeting;

     private list: any[] = [];

     constructor(meeting: Meeting) {
          this.meeting = meeting;
     }

     public state() {
          return this.list;
     }

     public bind(client: Client) {
          if (client.roles & Client.CHAIRMAN) {
               client.on('chairman/module/broadcast', ({ data, id }) => {
                    this.list.push({
                         timestamp: +new Date,
                         html: data.html
                    })

                    client.send(id, {
                         error: false
                    })

                    this.meeting.broadcastState();
               })
          }
     }

}