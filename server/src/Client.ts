import uuid from 'uuid';
import { Socket } from './Socket';

export class Client extends Socket {

     static DELEGATE: number = 1;
     static CHAIRMAN: number = 2;

     public id: string = uuid();

     public roles: number = 0;

     public state: any = {};

}