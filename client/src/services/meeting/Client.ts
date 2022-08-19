import hash from 'object-hash';
import { Socket } from './Socket';

export class Client extends Socket {

     public id: any;

     public connected: boolean = false;
     public reconnecting: boolean = false;

     public meeting: any;
     public state: any;

     public cache: any = {};

     constructor(address: string) {
          super(address);

          this.on('connected', async ({ data }) => {
               this.id = data.id;

               await this.retrieveState();
               this.connected = true;
               this.emit('update');
          })

          this.once('meeting/info', ({ data }: any) => {
               this.meeting = data;
               this.emit('update');
          })

          this.on('meeting/state', ({ data }) => {
               this.state = data;

               if (!this.connected) return;

               this.emit('update');
          })

          this.on('meeting/state/hash', async ({ data }) => {
               if (!this.state) {
                    console.log('Got state hash but no state is present, skipping.');
                    return;
               }

               if (
                    (hash(this.state.meeting) !== data.meeting ||
                         (data.client ? hash(this.state.client) !== data.client : false)) &&
                    data.timestamp > this.state.timestamp
               ) {
                    console.warn('Local state hash mismatch, retrieving server state...');
                    await this.retrieveState();
               }
          })

          this.on('close', () => {
               this.connected = false;
               this.reconnecting = true;

               this.emit('update');

               const retry = () => {
                    setTimeout(() => {
                         fetch('/', {
                              method: 'HEAD'
                         }).then((response) => {
                              if (response.ok) {
                                   this.reconnect();
                              } else {
                                   retry();
                              }
                         }).catch(retry)
                    }, 1000)
               }

               this.removeAllListeners('ready');
               // this.removeAllListeners('connected');

               this.once('ready', () => {
                    this.emit('reconnect');
               })

               this.prependOnceListener('connected', () => {
                    this.reconnecting = false;
               })

               retry();
          })
     }

     public destroy() {
          this.removeAllListeners();
          this.disconnect();
     }

     public retrieveState() {
          return new Promise((resolve) => {
               this.send('meeting/state');

               this.once('meeting/state', ({ data }) => {
                    resolve(data);
               })
          })
     }

}