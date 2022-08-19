import Admin from 'pages/Admin';
import Index from 'pages/Index';
import Meeting from 'pages/Meeting';
import Chairman from 'pages/meeting/Chairman';

export const routes = [
     {
          path: '/',
          component: Index,
          exact: true
     },
     {
          path: '/meeting/:token',
          component: Meeting,
          exact: true
     },
     {
          path: '/meeting/:token/chairman',
          component: Chairman
     },
     {
          path: '/admin',
          component: Admin
     }
]