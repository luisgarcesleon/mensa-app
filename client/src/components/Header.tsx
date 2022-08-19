import * as React from 'react';
import { Link } from 'react-router-dom';
import { Client } from 'services/meeting/Client';
import { debug } from '../debug';
import { Delegate } from 'services/meeting/Delegate';

interface IProps {
     client?: Client
}

export const Header: React.FC<IProps> = (props: IProps) => {
     const client = props.client;

     return (
          <>
               {debug && (
                    <nav style={{ position: 'absolute', left: '50%' }}>
                         <ul>
                              <li>
                                   <Link to="/meeting/123/chairman">Chairman</Link>
                              </li>
                              <li>
                                   <Link to="/admin">Admin</Link>
                              </li>
                         </ul>
                    </nav>
               )}

               <header>
                    <div className="logo">
                         <img src={require('assets/mensa_international_logo.jpg')} alt="" />
                    </div>

                    {client && (
                         <>
                              <div className="details">
                                   <div className="name">
                                        <h1>{client.meeting.name}</h1>
                                   </div>
                                   <div className="description">
                                        <p>{client.meeting.description}</p>
                                   </div>
                              </div>

                              {client.connected && (
                                   <div className="session">
                                        <div className="user">
                                             {client instanceof Delegate && (
                                                  <p>{client.state.client.user.cc} | {client.state.client.user.name} | Vote Weight: {client.state.client.user.weight}</p>
                                             )}
                                        </div>

                                        <button onClick={() => {
                                             if (document.fullscreen) {
                                                  document.exitFullscreen();
                                             } else {
                                                  document.documentElement.requestFullscreen();
                                             }
                                        }}>Toggle Fullscreen</button>

                                        <Link to="/">
                                             <button>Leave</button>
                                        </Link>
                                   </div>
                              )}
                         </>
                    )}
               </header>
          </>
     )
}