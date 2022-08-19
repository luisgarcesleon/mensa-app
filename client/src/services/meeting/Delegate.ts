import { Client } from './Client';

export class Delegate extends Client {

     public async join(pin: string): Promise<any> {
          return new Promise((resolve) => {
               this.send('delegate/join', {
                    pin
               }, ({ data }) => {
                    if (data.error) {
                         console.error(data.message ? data.message : 'Could not join.');
                         return;
                    }

                    console.log('Successfully joined meeting.');

                    this.cache.pin = pin;
                    resolve(data);
               })
          })
     }

}