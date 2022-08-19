import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Auth } from 'services/admin/Auth';
import { Meetings } from './admin/Meetings';

export default class Admin extends React.Component<any, any> {

     public state = {
          username: '',
          password: ''
     }

     public componentDidMount() {
          if (Auth.token) {
               this.props.history.push('/admin/meetings');
          }
     }

     private handleInputChange(event: any) {
          event.persist();

          this.setState({
               [event.target.name]: event.target.value
          })
     }
     private _handleInputChange = this.handleInputChange.bind(this);

     private async onFormSubmit(event: any) {
          event.preventDefault();

          if (await Auth.login(this.state.username, this.state.password)) {
               this.props.history.push('/admin/meetings');
          }
     }
     private _onFormSubmit = this.onFormSubmit.bind(this);

     public render() {
          return (
               <>
                    <Header />

                    <main className="admin">
                         <h1>Admin</h1>

                         <Switch>
                              <Route path={`${this.props.match.url}/meetings`} component={Meetings} />
                              <Route>
                                   <form className="block" onSubmit={this._onFormSubmit}>
                                        <input type="text" name="username" onChange={this._handleInputChange} placeholder="Username" autoFocus required />
                                        <input type="password" name="password" onChange={this._handleInputChange} placeholder="Password" required />
                                        <input type="submit" value="Login" />
                                   </form>
                              </Route>
                         </Switch>
                    </main>

                    <Footer />
               </>
          )
     }

}