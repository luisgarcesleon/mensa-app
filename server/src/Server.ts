import express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import hash from 'object-hash';
import pick from 'object.pick';
import * as path from 'path';
import * as ws from 'ws';
import { Client } from './Client';
import { database } from './database';
import { logger } from './logger';
import { Meeting } from './Meeting';
import { router as apiRouter } from './routes/api';
import { router as exportRouter } from './routes/export';
import { router as pinsRouter } from './routes/pins';

export class Server {

     private config: any;

     public app: express.Express;
     private server: http.Server;
     private wsserver: ws.Server;

     public meetings: Map<string, Meeting> = new Map();

     constructor(config: any) {
          this.config = config;

          this.app = express();

          this.app.disable('x-powered-by');
          this.app.set('json spaces', '\t');
          this.app.use(express.json());

          this.app.use('/api', apiRouter);
          this.app.use('/export', exportRouter);
          this.app.use('/pins', pinsRouter);

          this.app.get('/info', (req, res) => {
               res.send({
                    name: 'mibdt-server',
                    server: {
                         meetings: this.meetings.size,
                         clients: Array.from(this.meetings.values())
                              .map((meeting) => meeting.clients.length)
                              .reduce((acc, curr) => acc + curr, 0)
                    }
               })
          })

          const root = path.join(__dirname, '../../client/build');

          this.app.use(express.static(root))

          this.app.get('*', (req, res) => {
               res.sendFile(path.join(root, '/index.html'));
          })

          this.server = http.createServer(this.app);
          this.listen(this.config.listen);

          this.wsserver = new ws.Server({ server: this.server });

          this.wsserver.on('connection', async (socket, request) => {
               if (!request.url) {
                    socket.close();
                    return;
               }

               const parts = request.url.slice(1).split('/');

               const token = parts[0];
               const role = parts[1];

               const meetingData: any = await new Promise((resolve) => {
                    database.serialize(() => {
                         database.prepare('SELECT * FROM meetings WHERE token = ? AND active = 1').get(token, (err, row) => {
                              resolve(row);
                         })
                    })
               })

               if (
                    !meetingData ||
                    ![
                         'delegate',
                         'chairman'
                    ].includes(role)
               ) {
                    socket.send('');
                    socket.close();
                    return;
               }

               const meeting = await this.getMeeting(meetingData) as Meeting;

               const client = new Client(socket);

               client.send('meeting/info', pick(meetingData as any, [
                    'name',
                    'description'
               ]))

               switch (role) {
                    case 'delegate':
                         client.on('delegate/join', async ({ data, id }) => {
                              if (client.roles & Client.DELEGATE) {
                                   return client.send(id, {
                                        error: true
                                   })
                              }

                              const delegate: any = await new Promise((resolve) => {
                                   database.prepare('SELECT * FROM delegates WHERE meeting = ? AND pin = ?').get([
                                        meeting.id,
                                        data.pin
                                   ], (err, row) => {
                                        resolve(row);
                                   })
                              })

                              if (!delegate) {
                                   return client.send(id, {
                                        error: true,
                                        message: 'Invalid pin.'
                                   })
                              }

                              const session = meeting.getSession(delegate.id);

                              session.user = pick(delegate, [
                                   'id',
                                   'country',
                                   'cc',
                                   'name',
                                   'initials',
                                   'weight'
                              ])

                              client.state = session;
                              client.roles |= Client.DELEGATE;

                              meeting.addClient(client);

                              client.prependListener('close', () => {
                                   meeting.removeClient(client);
                              })

                              logger.info(`[${token}] Delegate joined.`);

                              client.send(id, {
                                   error: false
                              })

                              client.send('connected', { id: client.id });
                         })

                         break;
                    case 'chairman':
                         client.on('chairman/authorize', async ({ data, id }) => {
                              if (
                                   client.roles & Client.CHAIRMAN ||
                                   data.code !== meetingData.code
                              ) {
                                   return client.send(id, {
                                        error: true
                                   })
                              }

                              client.roles |= Client.CHAIRMAN;

                              meeting.addClient(client);

                              client.prependListener('close', () => {
                                   meeting.removeClient(client);
                              })

                              logger.info(`[${token}] Chairman joined.`);

                              client.send(id, {
                                   error: false
                              })

                              client.send('connected', { id: client.id });
                         })

                         break;
               }

               client.on('server/ping', ({ id }) => {
                    client.send(id, {
                         timestamp: +new Date
                    })
               })

               client.on('close', () => {
                    if (!meeting.clients.length) {
                         this.meetings.delete(meeting.id);
                    }
               })

               client.send('ready');
          })

          setInterval(() => {
               for (const meeting of this.meetings.values()) {
                    // JSON.parse because of hash not matching somehow without it
                    const meetingHash = hash(JSON.parse(JSON.stringify(meeting.state())));
                    const timestamp = +new Date;

                    for (const client of meeting.clients) {
                         client.send('meeting/state/hash', {
                              timestamp,
                              ...client.roles & Client.CHAIRMAN ? {
                                   meeting: meetingHash
                              } : {
                                        meeting: meetingHash,
                                        client: hash(client.state)
                                   }
                         })
                    }
               }
          }, 1000)
     }

     private listen(listen: any) {
          if (isNaN(parseInt(listen))) {
               const socket = path.join(__dirname, listen);

               fs.unlink(socket, () => {
                    logger.info('Unlinked socket.');

                    this.server.listen(socket, () => {
                         fs.chmod(socket, 0o777, (err) => {
                              if (err) throw err;
                              logger.info(`Listening on ${socket}.`);
                         })
                    })
               })
          } else {
               this.server.listen(listen, () => {
                    logger.info(`Listening on port ${listen}.`)
               })
          }
     }

     private async getMeeting(meeting: any) {
          if (!this.meetings.has(meeting.id)) {
               const delegates: any = await new Promise((resolve) => {
                    database.prepare('SELECT * FROM delegates WHERE meeting = ?').all(meeting.id, (err, rows) => {
                         resolve(rows);
                    })
               })

               this.meetings.set(meeting.id, new Meeting(meeting, delegates));
          }

          return this.meetings.get(meeting.id);
     }

}