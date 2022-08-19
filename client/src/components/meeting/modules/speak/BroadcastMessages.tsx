import { ClientContext } from 'context/Client';
import dateFormat from 'dateformat';
import * as React from 'react';

export const BroadcastMessages = () => {
     const client = React.useContext(ClientContext);

     return (
          <div className="messages">
               {client.state.meeting.broadcast.length ? Array.from(client.state.meeting.broadcast).reverse().map((message: any, index: number) => (
                    <div key={index} className="message">
                         <div className="date">
                              <p>{dateFormat(new Date(message.timestamp), 'HH:MM:ss')}</p>
                         </div>
                         <div className="content" dangerouslySetInnerHTML={{ __html: message.html }} />
                    </div>
               )) : <p>No messages.</p>}
          </div>
     )
}