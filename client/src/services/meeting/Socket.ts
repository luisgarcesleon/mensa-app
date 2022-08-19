import { EventEmitter } from 'events';
import uuid from 'uuid';

export class Socket extends EventEmitter {

     public raw: WebSocket | any = {};

     public ping: any = {
          timeout: null,
          timestamp: null
     }

     constructor(address: string) {
          super();

          this.connect(address);
     }

     public connect(address: string) {
          if (this.raw) {
               if (this.raw.readyState === WebSocket.OPEN) {
                    this.disconnect();
               }
          }

          this.raw = new WebSocket(address);

          this.raw.onopen = () => {
               console.log('Connected to server.');
               this.emit('open');
          }

          this.raw.onclose = () => {
               console.info('Disconnected from server.');
               clearTimeout(this.ping.timeout);
               this.emit('close');
          }

          this.raw.onerror = () => {
               console.error('Error in connection to server.');
               this.emit('error');
          }

          this.raw.onmessage = ({ data }: any) => {
               if (data.length === 0) {
                    console.error('Server closed connection.');
                    this.removeAllListeners('close');
                    this.emit('serverclose');
                    return;
               }

               const parts = data.split(':');

               const name = parts.shift();
               const id = parts.shift();
               const json = parts.join(':');

               try {
                    this.emit(name, {
                         id,
                         data: JSON.parse(json),
                    })
               } catch (e) {
                    console.error('Error parsing packet.');
                    console.log(e);
               }
          }

          this.once('ready', () => {
               this.setupPing();
          })
     }

     public reconnect() {
          if (!this.raw) return;
          this.connect(this.raw.url);
     }

     public disconnect() {
          if (this.raw.readyState !== WebSocket.OPEN) return;
          this.raw.close();
     }

     private setupPing() {
          const ping = () => {
               this.ping.timestamp = +new Date();

               this.send('server/ping', {}, ({ data }) => {
                    this.ping.c2s = data.timestamp - this.ping.timestamp;
                    this.ping.s2c = +new Date() - data.timestamp;
                    this.ping.rtt = +new Date() - this.ping.timestamp;

                    this.emit('pong');

                    this.ping.timeout = setTimeout(() => {
                         ping();
                    }, 1000)
               })
          }

          ping();
     }

     public send(name: string, data: any = null, callback?: (data: any) => any) {
          if (this.raw.readyState !== WebSocket.OPEN) {
               console.warn('Socket not in OPEN state.');
               return;
          }

          const json = JSON.stringify(data);

          if (callback) {
               const id = uuid();
               this.raw.send(`${name}:${id}:${json}`);
               this.once(id, callback);
          } else {
               this.raw.send(`${name}:false:${json}`);
          }
     }

}