import { ClientContext } from 'context/Client';
import * as React from 'react';
import { debug } from '../../debug';

export const Join = ()=> {
     const[pin, setPin] = React.useState(debug ? { pin: '1234' } : {})

     const [context, setContext] = React.useContext(ClientContext);

     React.useEffect(()=> {
          if (debug) {
               handleJoin(new Event(''));
          }
     }, [])

     const handleInputChange = (event: any) => {
          event.persist();

          setPin(event.target.value)
     }

     const handleJoin = (event: any) => {
          event.preventDefault();

          setContext(pin);
     }

     return (
          <div className="join">
               <h2>Join</h2>

               <form className="inline" onSubmit={handleJoin}>
                    <input type="text" name="pin" placeholder="PIN" onChange={handleInputChange} required autoFocus />
                    <input type="submit" value="Join" />
               </form>
          </div>
     )
}
