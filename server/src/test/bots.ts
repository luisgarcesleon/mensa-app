import ws from 'ws';

const names = [
     'John Smith',
     'John Doe',
     'Oliver Twitch',
     'Google Bot',
     'Paper Plane'
]

const sockets: any[] = [];

const COUNT = 20;

(function connect() {
     if (sockets.length >= COUNT) return;

     const socket = new ws('wss://mensa-ibd-tools.dev.quantumsupremacy.se/123/delegate');
     // const socket = new ws('ws://localhost:5000/123/delegate');

     console.log(`[${sockets.length}] Connecting...`);

     socket.on('message', (data) => {
          const name = data.toString().split(':')[0];

          switch (name) {
               case 'ready':
                    socket.send(`delegate/join:join:${JSON.stringify({
                         // pin: 1234
                         pin: 3831
                    })}`)

                    break;
               case 'join':
                    // socket.send(`delegate/mode/speak:res:${JSON.stringify({
                    //      type: 'request',
                    //      state: true
                    // })}`)

                    // socket.send(`delegate/mode/vote:res:${JSON.stringify({
                    //      vote: ['yes', 'no', 'abstain', false][Math.floor(Math.random() * 4)]
                    // })}`)

                    console.log(`[${sockets.length}] Actions completed.`);

                    sockets.push(socket);
                    connect();

                    break;
               case 'res':
                    console.log(`[${sockets.length}] Actions completed.`);

                    sockets.push(socket);
                    connect();

                    break;
          }
     })
})()

setInterval(() => {
     for (const socket of sockets) {
          socket.send(`server/ping:ping:null`);
     }
}, 1000)