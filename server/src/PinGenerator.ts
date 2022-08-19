export class PinGenerator {

     private len: number;

     private pins: string[] = [];

     constructor(len: number) {
          this.len = len;
     }

     public generate(): string {
          const pin = Math.floor(Math.random() * 10 ** this.len).toString().padStart(this.len, '0');

          if (this.pins.includes(pin)) return this.generate();

          this.pins.push(pin);

          return pin;
     }

}