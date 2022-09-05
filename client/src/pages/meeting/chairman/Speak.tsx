import { Timer } from 'components/meeting/chairman/speak/Timer';
import { List } from 'components/meeting/modules/speak/List';
import { ClientContext } from 'context/Client';
import { TimerContext, TimerContextProvider } from 'context/Timer';
import * as React from 'react';
import { FaArrowAltCircleRight, FaLock, FaLockOpen, FaPlus, FaUndo } from 'react-icons/fa';

export const Speak = () => {
     const client = React.useContext(ClientContext);
     
     return (
          <div className="module speak">
                    <div className="container">
                         <TimerContextProvider>
                              <section>
                                   <div className="heading">
                                        <h1>Speak Control</h1>

                                        <div className="buttons">
                                             <button className="light" onClick={() => {
                                                  client.send('chairman/mode/speak/clear', null, ({ data }: any) => {
                                                       if (data.error) {
                                                            console.error('Clear failed.');
                                                            return;
                                                       }

                                                       console.log('Clear.');
                                                  })
                                             }}>
                                                  <span>Clear</span>
                                             </button>

                                             {client.state.meeting.speak.enabled ? (
                                                  <button className="light" onClick={() => {
                                                       client.send('chairman/mode/speak/disable', null, ({ data }: any) => {
                                                            if (data.error) {
                                                                 console.error('Disable speak failed.');
                                                                 return;
                                                            }

                                                            console.log('Disable speak.');
                                                       })
                                                  }}>
                                                       <FaLock />
                                                       <span>Disable</span>
                                                  </button>
                                             ) : (
                                                       <button className="light" onClick={() => {
                                                            client.send('chairman/mode/speak/enable', null, ({ data }: any) => {
                                                                 if (data.error) {
                                                                      console.error('Enable speak failed.');
                                                                      return;
                                                                 }

                                                                 console.log('Enable speak.');
                                                            })
                                                       }}>
                                                            <FaLockOpen />
                                                            <span>Enable</span>
                                                       </button>
                                                  )}
                                        </div>
                                   </div>

                                   <List />

                                   <div className="buttons">
                                        <TimerContext.Consumer>
                                             {([, setCount]) => (
                                                  <button className="icon" onClick={() => {
                                                       client.send('chairman/mode/speak/next', null, ({ data }: any) => {
                                                            if (data.error) {
                                                                 console.error('Next failed.');
                                                                 return;
                                                            }

                                                            setCount(0);

                                                            console.log('Next.');
                                                       })
                                                  }}>
                                                       <FaArrowAltCircleRight />
                                                       <span>Next</span>
                                                  </button>
                                             )}
                                        </TimerContext.Consumer>

                                        <button className="icon" onClick={() => {
                                             client.send('chairman/mode/speak/revert', null, ({ data }: any) => {
                                                  if (data.error) {
                                                       console.error('Revert failed.');
                                                       return;
                                                  }

                                                  console.log('Revert.');
                                             })
                                        }}>
                                             <FaUndo />
                                             <span>Revert</span>
                                        </button>

                                        <button className="icon" onClick={() => {
                                             client.send('chairman/mode/speak/add', {
                                                  name: prompt('Name:'),
                                                  cc: prompt('CC:')
                                             }, ({ data }: any) => {
                                                  if (data.error) {
                                                       console.error('Add failed.');
                                                       return;
                                                  }

                                                  console.log('Add.');
                                             })
                                        }}>
                                             <FaPlus />
                                             <span>Add</span>
                                        </button>
                                   </div>
                              </section>
                              <section className="timer">
                                   <div className="heading">
                                        <h1>Timer</h1>

                                        <div className="buttons">
                                             <TimerContext.Consumer>
                                                  {([, setCount]) => (
                                                       <button className="light" onClick={() => setCount(0)}>
                                                            <span>Reset</span>
                                                       </button>

                                                  )}
                                             </TimerContext.Consumer>
                                        </div>
                                   </div>

                                   <Timer />
                              </section>
                         </TimerContextProvider>
                    </div>
               </div>
     )
}
