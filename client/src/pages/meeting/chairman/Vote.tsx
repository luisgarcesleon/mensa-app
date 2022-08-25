import { Summary } from 'components/meeting/modules/vote/Summary';
import { Visualization } from 'components/meeting/modules/vote/Visualization';
import { ClientContext } from 'context/Client';
import * as React from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { debug } from '../../../debug';

export class Vote extends React.Component {

     static contextType = ClientContext;

     public state = {
          ctrlIsDown: false
     }

     selectKeyDown (event: any) {
          if(event.keyCode === 17) {
               this.setState({
                    ctrlIsDown: true
               })
          } 
     }

     selectKeyUp (event: any) {
          if(event.keyCode === 17) {
               this.setState({
                    ctrlIsDown: false
               })
          } 
     }


     public componentDidMount() {
          this.context.send('chairman/meeting/mode', {
               mode: 'vote'
          }, ({ data }: any) => {
               if (data.error) {
                    console.error('Could not set mode.');
               }
          })

          document.addEventListener("keydown", this.selectKeyDown, false);
          document.addEventListener("keyup", this.selectKeyUp, false);
     }

     public componentWillUnmount() {
          document.removeEventListener("keydown", this.selectKeyDown);
          document.removeEventListener("keyup", this.selectKeyUp);
     }

     public render() {
          const vote = this.context.state.meeting.vote;
          const motion = vote.motion;

          return (
               <div className="module vote">
                    <div className="container">
                         <section className="visualization">
                              <div className="heading">
                                   <h1>Vote #{motion.number} - "{motion.name}"</h1>
                                   <p>{vote.summary ? 'Ended' : `${vote.count} of ${vote.total} voted`}</p>

                                   <div className="buttons">
                                        {vote.enabled ? (
                                             <button className="light" onClick={() => {
                                                  this.context.send('chairman/mode/vote/disable', null, ({ data }: any) => {
                                                       if (data.error) {
                                                            console.error(data.message ? data.message : 'Disable vote failed.');
                                                            return;
                                                       }

                                                       console.log('Disable vote.');
                                                  })
                                             }}>
                                                  <FaLock />
                                                  <span>End vote</span>
                                             </button>
                                        ) : (
                                             <button className="light" onClick={() => {
                                                  const secret = this.state.ctrlIsDown;

                                                  if (secret) {
                                                       alert('Secret ballot enabled.');

                                                       this.setState({
                                                            ctrlIsDown: false
                                                       })
                                                  }

                                                  const number = prompt('Motion Number:', vote.motion.number);
                                                  const name = prompt('Motion Name:', debug ? 'Dev motion' : '');

                                                  if (!number || !name) return;

                                                  this.context.send('chairman/mode/vote/enable', {
                                                       number,
                                                       name,
                                                       secret
                                                  }, ({ data }: any) => {
                                                       if (data.error) {
                                                            console.error(data.message ? data.message : 'Disable vote failed.');
                                                            return;
                                                       }

                                                       console.log('Enable vote.');
                                                  })

                                                  this.setState({
                                                       ctrlIsDown: false
                                                  })
                                             }}>
                                                  <FaLockOpen />
                                                  <span>Start vote{this.state.ctrlIsDown ? ' (secret)' : ''}</span>
                                             </button>
                                        )}
                                   </div>
                              </div>

                              <Visualization />
                         </section>

                         {vote.summary && (
                              <section className="summary">
                                   <div className="heading">
                                        <h1>Summary</h1>
                                   </div>

                                   <Summary />
                              </section>
                         )}
                    </div>
               </div>
          )
     }

}