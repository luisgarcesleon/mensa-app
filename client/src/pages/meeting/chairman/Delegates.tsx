import { ClientContext } from 'context/Client';
import * as React from 'react';
import { Loader } from 'components/Loader';

export class Delegates extends React.Component<any> {

     static contextType = ClientContext;

     public state = {
          delegates: null
     }

     private interval: any;

     public componentDidMount() {
          this.interval = setInterval(() => {
               this.retrieveDelegates();
          }, 1000)

          this.retrieveDelegates();
     }

     public componentWillUnmount() {
          clearInterval(this.interval);
     }

     private retrieveDelegates() {
          this.context.send('chairman/meeting/delegates', null, ({ data }: any) => {
               this.setState({
                    delegates: data.delegates
               })
          })
     }

     public render() {
          const delegates: any = this.state.delegates;

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

}