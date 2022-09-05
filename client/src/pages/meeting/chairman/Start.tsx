import { ClientContext } from 'context/Client';
import * as React from 'react';

export const Start = () => {
     const client = React.useContext(ClientContext);

     React.useEffect(() => {
          client.send('chairman/meeting/mode', {
               mode: 'start'
          }, ({ data }: any) => {
               if (data.error) {
                    console.error('Could not set mode.');
               }
          })
     }, [])

     return (
          <div className="module start">
          <h1>mensa-ibd-tools</h1>
     </div>
     )
}
