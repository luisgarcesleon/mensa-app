import 'react';

declare const window: any;

export const debug = process.env.NODE_ENV === 'development';

if (debug) {
     window.DEBUG = debug;

     console.log('Running in debug mode.');
}