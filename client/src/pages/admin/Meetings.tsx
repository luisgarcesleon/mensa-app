import { Loader } from 'components/Loader';
import { withAuth } from 'hoc/withAuth';
import * as React from 'react';
import { Auth } from 'services/admin/Auth';

class UploadForm extends React.Component<any> {

     public render() {
          return (
               <>
                    <input type="file" name="file" ref="file" />

                    <button onClick={async () => {
                         const ref: any = this.refs.file;
                         const file = ref.files[0];

                         if (!file) return;

                         const list = await file.text();

                         const delegates = list.split('\n')
                              .filter((line: string) => line.length > 10) // 10 = commas+\n+fields
                              .map((line: string) => {
                                   const parts = line.split(',');

                                   return {
                                        country: parts[0],
                                        cc: parts[1],
                                        name: parts[2],
                                        initials: parts[3],
                                        weight: parts[4]
                                   }
                              })

                         const { data } = await Auth.api.put(`/meetings/${this.props.meeting.id}/delegates`, delegates);

                         if (data.error) {
                              console.error('Error!');
                              return;
                         }

                         console.log('File was uploaded.');
                    }} >Upload</button>
               </>
          )
     }

}

export const Meetings = withAuth(class extends React.Component<any, any>  {

     public state = {
          meetings: null
     }

     public async componentDidMount() {
          this.fetchMeetings();
     }

     private fetchMeetings() {
          if (this.state.meetings) {
               this.setState({
                    meetings: null
               })
          }

          Auth.api.get('/meetings').then((response) => {
               this.setState({
                    meetings: response.data.meetings
               })
          })
     }

     public render() {
          const meetings: any = this.state.meetings;

          return (
               <>
                    <div className="heading">
                         <h3>Meetings</h3>

                         <div className="buttons">
                              <button onClick={() => {
                                   Auth.api.post('/meetings', {
                                        name: prompt('Name:'),
                                        description: prompt('Description:')
                                   }).then(() => {
                                        this.fetchMeetings();
                                   })
                              }} >Create</button>
                         </div>
                    </div>

                    {meetings ? (
                         meetings.length ? (
                              <table className="meetings">
                                   <thead>
                                        <tr>
                                             <th>Name</th>
                                             <th>Description</th>
                                             <th>Token</th>
                                             <th>Code</th>
                                             <th>Active</th>
                                             <th>Delegates</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {meetings.map((meeting: any, index: number) => (
                                             <tr key={index} className="meeting">
                                                  <td>{meeting.name}</td>
                                                  <td>{meeting.description}</td>
                                                  <td>{meeting.token}</td>
                                                  <td>{meeting.code}</td>
                                                  <td>{meeting.active}</td>
                                                  <td>
                                                       <UploadForm meeting={meeting} />
                                                  </td>
                                                  <td>
                                                       <button onClick={() => {
                                                            if (!window.confirm('Confirm action.')) return;

                                                            Auth.api.delete(`/meetings/${meeting.id}`).then(() => {
                                                                 this.fetchMeetings();
                                                            })
                                                       }}>Delete</button>
                                                  </td>
                                                  <td>
                                                       <button onClick={() => {
                                                            window.open((process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '') + `/pins/${meeting.id}?token=${Auth.token}`);
                                                       }}>Codes</button>
                                                  </td>
                                                  <td>
                                                       <button onClick={() => {
                                                            window.open((process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '') + `/export/${meeting.id}?token=${Auth.token}`);
                                                       }}>Export</button>
                                                  </td>
                                                  <td>
                                                       <button onClick={() => {
                                                            window.open(`/meeting/${meeting.token}`);
                                                       }}>Delegate</button>
                                                  </td>
                                                  <td>
                                                       <button onClick={() => {
                                                            window.open(`/meeting/${meeting.token}/chairman`);
                                                       }}>Chairman</button>
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </table>
                         ) : <p>No meetings.</p>
                    ) : <Loader />}
               </>
          )
     }
})