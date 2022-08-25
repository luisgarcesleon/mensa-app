import classnames from 'classnames';
import { ClientContext } from 'context/Client';
import * as React from 'react';
import { FaThumbsDown, FaThumbsUp, FaTimesCircle } from 'react-icons/fa';
import { Delegate } from 'services/meeting/Delegate';
import { VOTE_OPTIONS } from '../../../utils/consts';
import { Summary } from './vote/Summary';
import { Visualization } from './vote/Visualization';


const getVote = (current: VOTE_OPTIONS, vote: VOTE_OPTIONS) => {
     return current === vote ? VOTE_OPTIONS.DID_NOT_VOTE : vote;
}

export const Vote = () => {
     const client: Delegate = React.useContext(ClientContext);

     const vote = client.state.meeting.vote;
     const motion = client.state.meeting.vote.motion;

     const clientState = client.state.client;

     return (
          <div className={classnames('module', 'vote', { 'enabled': vote.enabled })}>
               <div className="container">
                    <section className="visualization">
                         <div className="heading">
                              <h1>Vote #{motion.number} - "{motion.name}"</h1>
                              <p>{vote.summary ? 'Ended' : `${vote.count} of ${vote.total} voted`}</p>
                         </div>

                         <Visualization />

                         {(vote.enabled && clientState.user.weight !== 0) && (
                              <div className="buttons">
                                   <button className={classnames('icon', { active: clientState.vote === VOTE_OPTIONS.YES })} onClick={() => {
                                        client.send('delegate/mode/vote', {
                                             vote: getVote(clientState.vote, VOTE_OPTIONS.YES)
                                        }, ({ data }: any) => {
                                             if (data.error) {
                                                  console.error('Register vote failed.');
                                             }
                                        })
                                   }}>
                                        <FaThumbsUp />
                                        <span>YES</span>
                                   </button>

                                   <button className={classnames('icon', { active: clientState.vote === VOTE_OPTIONS.NO })} onClick={() => {
                                        client.send('delegate/mode/vote', {
                                             vote: getVote(clientState.vote, VOTE_OPTIONS.NO)
                                        }, ({ data }: any) => {
                                             if (data.error) {
                                                  console.error('Register vote failed.');
                                             }
                                        })
                                   }}>
                                        <FaThumbsDown />
                                        <span>NO</span>
                                   </button>

                                   <button className={classnames('icon', { active: clientState.vote === VOTE_OPTIONS.ABSTAIN })} onClick={() => {
                                        client.send('delegate/mode/vote', {
                                             vote: getVote(clientState.vote, VOTE_OPTIONS.ABSTAIN)
                                        }, ({ data }: any) => {
                                             if (data.error) {
                                                  console.error('Register vote failed.');
                                             }
                                        })
                                   }}>
                                        <FaTimesCircle />
                                        <span>ABSTAIN</span>
                                   </button>
                              </div>
                         )}
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