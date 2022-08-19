import { ClientContext } from 'context/Client';
import * as React from 'react';
import { debug } from '../../debug';

export class Join extends React.Component {

     static contextType = ClientContext;

     public state = debug ? {
          pin: '1234'
     } : {}

     public componentDidMount() {
          if (debug) {
               this.handleJoin(new Event(''));
          }
     }

     private handleInputChange(event: any) {
          event.persist();

          this.setState({
               [event.target.name]: event.target.value
          })
     }
     private _handleInputChange = this.handleInputChange.bind(this);

     private handleJoin(event: any) {
          event.preventDefault();

          this.context.join(this.state.pin);
     }
     private _handleJoin = this.handleJoin.bind(this);

     public render() {
          return (
               <div className="join">
                    <h2>Join</h2>

                    <form className="inline" onSubmit={this._handleJoin}>
                         <input type="text" name="pin" placeholder="PIN" onChange={this._handleInputChange} required autoFocus />
                         <input type="submit" value="Join" />
                    </form>
               </div>
          )
     }

}