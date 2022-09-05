import { ClientContext } from 'context/Client';
import * as React from 'react';
import { Loader } from 'components/Loader';

export const Delegates = () => {
     const client = React.useContext(ClientContext);

     let interval: any = null;

     const [delegates, setDelegates] = React.useState<any>(null);


     React.useEffect(() => {
          interval = setInterval(() => {
               client.send('chairman/meeting/delegates', null, ({ data }: any) => {
                    setDelegates(data.delegates)
               })
     }, 1000)

          return () => {
               clearInterval(interval);
           }
     }, [])

     return (
          <div className="delegates">
               {delegates ? (
                    <div className="container">
                         <section>
                              <div className="heading">
                                   <h1>Delegates ({delegates.length})</h1>
                              </div>

                              {delegates.length ? (
                                   <table>
                                        <thead>
                                             <tr>
                                                  <th>Name</th>
                                                  <th>CC</th>
                                                  <th>Weight</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {delegates.sort((a: any, b: any) => a.cc > b.cc ? 1 : -1).map((delegate: any, index: number) => (
                                                  <tr key={index}>
                                                       <td>{delegate.name}</td>
                                                       <td>{delegate.cc}</td>
                                                       <td>{delegate.weight}</td>
                                                  </tr>
                                             ))}
                                        </tbody>
                                   </table>
                              ) : <p>No delegates.</p>}
                         </section>
                    </div>
               ) : <Loader />}
          </div>
     )
}
