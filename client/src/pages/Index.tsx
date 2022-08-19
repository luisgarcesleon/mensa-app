import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { debug } from '../debug';

export default withRouter(class Index extends React.Component<any> {

     public state = {
          token: debug ? '123' : ''
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

          this.props.history.push(`/meeting/${this.state.token}`);
     }
     private _onFormSubmit = this.onFormSubmit.bind(this);

     public render() {
          return (
               <>
                    <Header />

                    <main className="index">
                         <h1>mensa-ibd-tools</h1>

                         <form className="inline" onSubmit={this._onFormSubmit}>
                              <input type="text" name="token" placeholder="Token" onChange={this._handleInputChange} required autoFocus />
                              <input type="submit" value="Connect" />
                         </form>
                    </main>

                    <Footer />
               </>
          )
     }

})