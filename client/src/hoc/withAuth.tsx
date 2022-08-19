import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Auth } from 'services/admin/Auth';

export const withAuth = (AuthComponent: any) => withRouter(class withAuth extends React.Component<any> {

     public componentDidMount() {
          if (!Auth.token) {
               this.props.history.push('/admin');
          }
     }

     public render() {
          return (
               <AuthComponent {...this.props} />
          )
     }

})