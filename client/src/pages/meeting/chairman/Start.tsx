import { ClientContext } from 'context/Client';
import * as React from 'react';

export class Start extends React.Component {

     static contextType = ClientContext;

     public componentDidMount() {
          this.context.send('chairman/meeting/mode', {
               mode: 'start'
          }, ({ data }: any) => {
               if (data.error) {
                    console.error('Could not set mode.');
               }
          })
     }

     public render() {
          return (
               <div className="module start">
                    <h1>mensa-ibd-tools</h1>
               </div>
          )
     }

}