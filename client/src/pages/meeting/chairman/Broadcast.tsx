import { BroadcastMessages } from 'components/meeting/modules/speak/BroadcastMessages';
import { ClientContext } from 'context/Client';
import * as React from 'react';
import RichTextEditor, { EditorValue } from 'react-rte';

export const Broadcast = () => {
     const client = React.useContext(ClientContext);

     const [value, setValue] = React.useState<any>(RichTextEditor.createEmptyValue());

     const onChange = (value: EditorValue) => {
          setValue(value)
     }

     const broadcast = () => {
          const html = value.toString('html');

          client.send('chairman/module/broadcast', { html }, ({ data }: any) => {
               if (data.error) {
                    console.error(data.message ? data.message : 'Broadcast failed.');
                    return;
               }

               console.log('Broadcast.');
               setValue(RichTextEditor.createEmptyValue())
          })
     }

     return (
          <div className="broadcast">
               <div className="container">
                    <section>
                         <div className="heading">
                              <h1>Broadcast</h1>
                         </div>

                         <RichTextEditor
                              value={value}
                              onChange={onChange}
                              autoFocus={true}
                         />

                         <button onClick={broadcast}>Broadcast</button>
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
