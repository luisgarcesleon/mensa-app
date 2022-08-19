import { ClientContext } from 'context/Client';
import * as React from 'react';
import { withRouter } from 'react-router';
import { debug } from '../../../debug';

export const Authorize = withRouter(class Authorize extends React.Component<any> {

     static contextType = ClientContext;

     public state = {
          code: debug ? '123' : ''
     }

     public componentDidMount() {
          if (debug) {
               this.handleAuthorize(new Event(''));
          }
     }

     private handleInputChange(event: any) {
          event.persist();

          this.setState({
               [event.target.name]: event.target.value
          })
     }
     private _handleInputChange = this.handleInputChange.bind(this);

     private handleAuthorize(event: any) {
          event.preventDefault();

          this.context.authorize(this.state.code);
     }
     private _handleAuthorize = this.handleAuthorize.bind(this);

     public render() {
          return (
               <div className="authorize">
                    <h2>Authorize</h2>

                    <form className="inline" onSubmit={this._handleAuthorize}>
                         <input type="text" name="code" placeholder="Code" onChange={this._handleInputChange} required autoFocus />
                         <input type="submit" value="Authorize" />
                    </form>
               </div>
          )
     }

})