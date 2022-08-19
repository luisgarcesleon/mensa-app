import { ClientContext } from 'context/Client';
import * as React from 'react';

export class SocketInfo extends React.Component {

     static contextType = ClientContext;

     public componentDidMount() {
          for (const event of ['open', 'error', 'pong']) {
               this.context.on(event, this._onSocketEvent);
          }
     }

     public componentWillUnmount() {
          for (const event of ['open', 'error', 'pong']) {
               this.context.off(event, this._onSocketEvent);
          }
     }

     private onSocketEvent() {
          this.forceUpdate();
     }
     private _onSocketEvent = this.onSocketEvent.bind(this);

     public render() {
          const connected = this.context.raw.readyState === WebSocket.OPEN;

          return (
               <div className="socket-info">
                    {connected && (
                         <p>Ping: {this.context.ping.rtt}ms</p>
                    )}
               </div>
          )
     }

}