import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Join } from 'components/meeting/Join';
import { ModuleWrapper } from 'components/meeting/ModuleWrapper';
import { SocketInfo } from 'components/SocketInfo';
import { ClientContext } from 'context/Client';
import * as React from 'react';
import { Client } from 'services/meeting/Client';
import { Delegate } from 'services/meeting/Delegate';
import { debug } from '../debug';

declare const window: any;

export default class extends React.Component<any> {

     private client: Client | any;

     public state = {
          serverclosed: false
     }

     public componentDidMount() {
          this.connect();
     }

     public componentWillUnmount() {
          this.client.destroy();
     }

     private connect() {
          this.client = new Delegate(`${window.location.protocol.includes('s') ? 'wss' : 'ws'}://${debug ? window.location.hostname : window.location.host}${process.env.NODE_ENV === 'development' ? ':5000' : ''}/${this.props.match.params.token}/delegate`);

          this.client.on('ready', () => {
               this.forceUpdate();
          })

          this.client.on('error', () => { });

          this.client.on('update', () => {
               this.forceUpdate();
          })

          this.client.on('reconnect', () => {
               if (!this.client.cache.pin) return;
               this.client.join(this.client.cache.pin);
          })

          this.client.on('serverclose', () => {
               this.setState({
                    serverclosed: true
               })
          })

          window.client = this.client;
     }

     public render() {
          return this.state.serverclosed ? (
               <div className="xycenter">
                    <h2>Token not found.</h2>
               </div>
          ) : (!this.client || !this.client.meeting) ? <Loader /> : this.client.reconnecting ? <Loader>Reconnecting...</Loader> : (
               <ClientContext.Provider value={this.client}>
                    <Header
                         client={this.client}
                    />

                    <main className="meeting delegate">
                         {this.client.connected ? (
                              <ModuleWrapper />
                         ) : (
                                   <Join />
                              )}
                    </main>

                    <SocketInfo />

                    <Footer />
               </ClientContext.Provider >
          )
     }

}