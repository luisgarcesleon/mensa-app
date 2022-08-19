import { BroadcastMessages } from 'components/meeting/modules/speak/BroadcastMessages';
import { ClientContext } from 'context/Client';
import * as React from 'react';
import RichTextEditor, { EditorValue } from 'react-rte';

export class Broadcast extends React.Component<any> {

     static contextType = ClientContext;

     public state = {
          value: RichTextEditor.createEmptyValue()
     }

     constructor(props: any) {
          super(props);

          this.onChange = this.onChange.bind(this);
          this.broadcast = this.broadcast.bind(this);
     }

     private onChange(value: EditorValue) {
          this.setState({ value });
     }

     private broadcast() {
          const html = this.state.value.toString('html');

          this.context.send('chairman/module/broadcast', { html }, ({ data }: any) => {
               if (data.error) {
                    console.error(data.message ? data.message : 'Broadcast failed.');
                    return;
               }

               console.log('Broadcast.');

               this.setState({ value: RichTextEditor.createEmptyValue() })
          })
     }

     public render() {
          return (
               <div className="broadcast">
                    <div className="container">
                         <section>
                              <div className="heading">
                                   <h1>Broadcast</h1>
                              </div>

                              <RichTextEditor
                                   value={this.state.value}
                                   onChange={this.onChange}
                                   autoFocus={true}
                              />

                              <button onClick={this.broadcast}>Broadcast</button>
                         </section>
                         <section className="broadcast">
                              <div className="heading">
                                   <h1>Messages</h1>
                              </div>

                              <BroadcastMessages />
                         </section>
                    </div>
               </div>
          )
     }

}