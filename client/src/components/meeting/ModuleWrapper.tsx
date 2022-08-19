import { ClientContext } from 'context/Client';
import * as React from 'react';
import { Speak } from './modules/Speak';
import { Start } from './modules/Start';
import { Vote } from './modules/Vote';

export const ModuleWrapper: React.FC = () => {
     const client = React.useContext(ClientContext);

     switch (client.state.meeting.mode) {
          case 'start':
               return <Start />;
          case 'speak':
               return <Speak />;
          case 'vote':
               return <Vote />;
          default:
               return <p>Something is wrong :/</p>;
     }
}