import { Client } from './Client';

export class Chairman extends Client {

     public async authorize(code: string): Promise<any> {
          return new Promise((resolve) => {
               this.send('chairman/authorize', {
                    code
               }, ({ data }) => {
                    if (data.error) {
                         console.error(data.message ? data.message : 'Authorization failed.');
                         return;
                    }

                    console.log('Authorization successfull.');

                    this.cache.code = code;
                    resolve(data);
               })
          })
     }

}