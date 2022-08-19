import { EventEmitter } from 'events';
import uuid from 'uuid';
import { logger } from './logger';

export class Socket extends EventEmitter {

     public raw: any;

     constructor(raw: any) {
          super();

          this.raw = raw;

          this.raw.on('close', () => {
               logger.info('Socket closed.');
               this.emit('close');
          })

          this.raw.on('error', () => {
               logger.error('Socket error.');
               this.emit('error');
          })

          this.raw.on('message', (data: any) => {
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
          })
     }

     public send(name: string, data: any = null, callback?: (data: any) => any) {
          if (this.raw.readyState !== this.raw.OPEN) {
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