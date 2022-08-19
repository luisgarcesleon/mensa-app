import classnames from 'classnames';
import { ClientContext } from 'context/Client';
import * as React from 'react';
import { FaExclamationCircle, FaRegCommentDots, FaTimes } from 'react-icons/fa';
import { BroadcastMessages } from './speak/BroadcastMessages';
import { List } from './speak/List';

export class Speak extends React.Component {

     static contextType = ClientContext;

     public render() {
          const speak = this.context.state.meeting.speak;
          const clientState = this.context.state.client;

          return (
               <div className={classnames('module', 'speak', { 'enabled': speak.enabled })}>
                    <div className="container">
                         <section>
                              <div className="heading">
                                   <h1>Speaker List</h1>
                                   {clientState.speakPosition ? (
                                        <p>Position {clientState.speakPosition} out of {speak.list.length}</p>
                                   ) : (
                                             <p>{speak.list.length} in queue</p>
                                        )}
                              </div>

                              <List />

                              {speak.enabled && (
                                   <div className="buttons">
                                        <button className="icon" onClick={() => {
                                             this.context.send('delegate/mode/speak', {
                                                  type: 'request',
                                                  state: !clientState.request
                                             }, ({ data }: any) => {
                                                  if (data.error) {
                                                       console.error('Request state update failed.');
                                                  }
                                             })
                                        }}>
                                             {clientState.request ? (
                                                  <>
                                                       <FaTimes />
                                                       <span>Cancel request</span>
                                                  </>
                                             ) : (
                                                       <>
                                                            <FaRegCommentDots />
                                                            <span>Request</span>
                                                       </>
                                                  )}
                                        </button>

                                        <button className="icon" onClick={() => {
                                             this.context.send('delegate/mode/speak', {
                                                  type: 'pm',
                                                  state: !clientState.pm
                                             }, ({ data }: any) => {
                                                  if (data.error) {
                                                       console.error('PM state update failed.');
                                                  }
                                             })
                                        }}>
                                             {clientState.pm ? (
                                                  <>
                                                       <FaTimes />
                                                       <span>Cancel PM</span>
                                                  </>
                                             ) : (
                                                       <>
                                                            <FaExclamationCircle />
                                                            <span>Request PM</span>
                                                       </>
                                                  )}
                                        </button>
                                   </div>
                              )}
                         </section>
                         <section className="broadcast">
                              <div className="heading">
                                   <h1>Broadcast</h1>
                              </div>

                              <BroadcastMessages />
                         </section>
                    </div>
               </div>
          )
     }

}