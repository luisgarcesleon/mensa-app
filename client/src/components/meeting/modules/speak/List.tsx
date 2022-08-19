import classnames from 'classnames';
import { ClientContext } from 'context/Client';
import * as React from 'react';
import { FaExclamationCircle, FaRegCommentDots } from 'react-icons/fa';
import { Delegate } from 'services/meeting/Delegate';

export const List = () => {
     const client = React.useContext(ClientContext);

     return (
          <div className="list">
               {!client.state.meeting.speak.list.length ? (
                    <p>Empty list.</p>
               ) : client.state.meeting.speak.list.map((item: any, index: number) => (
                    <div key={index} className={classnames('item', { highlighted: client instanceof Delegate && item.id === client.state.client.user.id })}>
                         <div>
                              {item.type === 'pm' ? <FaExclamationCircle /> : <FaRegCommentDots />}
                         </div>
                         <div>
                              <p>{item.type.toUpperCase()}</p>
                         </div>
                         <div>
                              <p>{item.user.cc}</p>
                         </div>
                         <div>
                              <p>{item.user.name}</p>
                         </div>
                    </div>
               ))}
          </div>
     )
}