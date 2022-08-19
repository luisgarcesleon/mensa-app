import clone from 'clone';

export class History {

     public size: number;

     public states: any[] = [];

     constructor(size: number) {
          this.size = size;
     }

     public save(state: any) {
          this.states.push(clone(state));

          if (this.states.length > this.size) {
               this.states.shift();
          }
     }

     public back(steps: number) {
          return this.states[this.states.length - 1 - steps];
     }

}