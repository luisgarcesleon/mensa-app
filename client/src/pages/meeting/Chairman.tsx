import classnames from 'classnames';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { Authorize } from 'components/meeting/chairman/Authorize';
import { SocketInfo } from 'components/SocketInfo';
import { ClientContext } from 'context/Client';
import { Speak } from 'pages/meeting/chairman/Speak';
import { Start } from 'pages/meeting/chairman/Start';
import { Vote } from 'pages/meeting/chairman/Vote';
import * as React from 'react';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { Chairman } from 'services/meeting/Chairman';
import { Broadcast } from './chairman/Broadcast';
import { Delegates } from './chairman/Delegates';
import { Loader } from 'components/Loader';

declare const window: any;

const NavModuleLink = withRouter((props: any) => {
     const client = React.useContext(ClientContext);

     return (
          <Link className={classnames({ active: client.state.meeting.mode === props.module })} to={`${props.match.url}/${props.module}`}>{props.children}</Link>
     )
})

export default class extends React.Component<any> {

     private client: Chairman | any;

     public componentDidMount() {
          this.connect();
     }

     public componentWillUnmount() {
          this.client.destroy();
     }

     private connect() {
          this.client = new Chairman(`${window.location.protocol.includes('s') ? 'wss' : 'ws'}://${process.env.NODE_ENV === 'development' ? window.location.hostname : window.location.host}${process.env.NODE_ENV === 'development' ? ':5000' : ''}/${this.props.match.params.token}/chairman`);

          this.client.once('ready', () => {
               this.forceUpdate();
          })

          this.client.on('error', () => { });

          this.client.on('update', () => {
               this.forceUpdate();
          })

          this.client.on('reconnect', () => {
               if (!this.client.cache.code) return;
               this.client.authorize(this.client.cache.code);
          })

          window.client = this.client;
     }

     public render() {
          const url = this.props.match.url;

          return (!this.client || !this.client.meeting) ? <Loader /> : this.client.reconnecting ? <Loader>Reconnecting...</Loader> : (
               <ClientContext.Provider value={this.client}>
                    <Header
                         client={this.client}
                    />

                    <main className="meeting chairman">
                         {this.client.connected ? (
                              <>
                                   <nav>
                                        <div className="modules">
                                             <NavModuleLink module="start">Start</NavModuleLink>
                                             <NavModuleLink module="speak">Speak</NavModuleLink>
                                             <NavModuleLink module="vote">Vote</NavModuleLink>
                                        </div>

                                        <Link to={`${url}/delegates`} >Delegates</Link>
                                        <Link to={`${url}/broadcast`} >Broadcast</Link>
                                   </nav>

                                   <div className="wrapper">
                                        <Switch>
                                             <Route path={`${url}/start`} component={Start} />
                                             <Route path={`${url}/speak`} component={Speak} />
                                             <Route path={`${url}/vote`} component={Vote} />
                                             <Route path={`${url}/delegates`} component={Delegates} />
                                             <Route path={`${url}/broadcast`} component={Broadcast} />

                                             <Route>
                                                  <Redirect to={`${url}/start`} />
                                             </Route>
                                        </Switch>
                                   </div>
                              </>
                         ) : (
                                   <Authorize />
                              )}
                    </main>

                    <SocketInfo />

                    <Footer />
               </ClientContext.Provider>
          )
     }

}