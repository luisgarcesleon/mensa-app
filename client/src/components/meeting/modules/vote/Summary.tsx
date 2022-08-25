import classnames from 'classnames';
import { ClientContext } from 'context/Client';
import * as React from 'react';
import { VOTE_OPTIONS } from '../../../../utils/consts';

export const Summary = () => {
     const client = React.useContext(ClientContext);

     const vote = client.state.meeting.vote;

     return (
          <div className="summary">
               <table>
                    <tbody>
                         {[
                              {
                                   vote: VOTE_OPTIONS.YES,
                                   display: 'Yes',
                                   color: 'green'
                              },
                              {
                                   vote: VOTE_OPTIONS.NO,
                                   display: 'No',
                                   color: 'red'
                              },
                              {
                                   vote: VOTE_OPTIONS.ABSTAIN,
                                   display: 'Abstain',
                                   color: 'grey'
                              },
                              {
                                   vote: VOTE_OPTIONS.DID_NOT_VOTE,
                                   display: 'Did not vote',
                                   color: 'transparent'
                              }
                         ].map((item, index) => (
                              <tr key={index}>
                                   <td>
                                        {vote.summary[item.vote]}
                                   </td>
                                   <td>
                                        <div className="weight">
                                             <div style={{ background: item.color }}></div>
                                        </div>
                                        <div className="identifier">
                                             <span className={classnames({ highlighted: [VOTE_OPTIONS.YES, VOTE_OPTIONS.NO].includes(item.vote) && Math.max(vote.summary[VOTE_OPTIONS.YES], vote.summary[VOTE_OPTIONS.NO]) === vote.summary[item.vote] })}>{item.display}</span>
                                        </div>
                                   </td>
                              </tr>
                         ))}
                    </tbody>
               </table>
          </div>
     )
}