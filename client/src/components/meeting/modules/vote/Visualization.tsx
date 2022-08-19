import { ClientContext } from 'context/Client';
import * as React from 'react';

import { VOTE_OPTIONS } from '../../../../../../shared';

export const Visualization = () => {
     const client = React.useContext(ClientContext);

     const vote = client.state.meeting.vote;
     const motion = client.state.meeting.vote.motion;

     const votes = Object.values(vote.votes);

     return (
          <div className="visualization">
               {
                    votes.length ? votes.sort((a: any, b: any) => (
                         `${a.user.cc}-${a.user.initials}` >
                         `${b.user.cc}-${b.user.initials}`
                    ) ? 1 : -1)
                         .map((delegate: any, index) => (
                              <div key={index} className="vote">
                                   <div className="weight">
                                        {new Array(delegate.user.weight).fill(1337).map((_, index) => (
                                             <div key={index} style={{
                                                  background: delegate.vote === VOTE_OPTIONS.YES ? 'green' :
                                                       delegate.vote === VOTE_OPTIONS.NO ? 'red' :
                                                            delegate.vote === VOTE_OPTIONS.ABSTAIN ? 'grey' :
                                                                 delegate.vote === VOTE_OPTIONS.DID_NOT_VOTE ? 'transparent' : 'yellow'
                                             }} />
                                        ))}
                                   </div>
                                   <div className="identifier">
                                        <p>{delegate.user.cc}-{delegate.user.initials}{!motion.secret && ('-' + (delegate.vote !== VOTE_OPTIONS.DID_NOT_VOTE ? VOTE_OPTIONS[delegate.vote][0].toUpperCase() : '-'))}</p>
                                   </div>
                              </div>
                         )) : <p>No delegates.</p>}
          </div>
     )
}