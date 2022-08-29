import Axios from 'axios';

export class Auth {

     static api = Axios.create({
          baseURL: '/api'
     })

     static token: string;

     static async login(username: string, password: string) {
          try {
               const response = await this.api.post('/session', {
                    username,
                    password
               })

               const token = response.data.token;

               this.token = token;
               this.api.defaults.headers.token = token;

               console.log('Authenticated.');

               return true;
          } catch (e) {
               // console.error(e.response.data.message);
          }

          return false;
     }

}