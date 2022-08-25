# mensa-ibd-tools

$ nvm use  # currently node v18
There's a nvmrc with the node current version

$ cd client; npm i; cd ..
$ cd server; npm i; cd ..
$ npm i

$ npm run build  # build all, might take some time, be patient

$ npm start  # start what was built, or
$ npm run dev
$ npm run dev:server  # and attach a debugger to the backend process
$ npm run dev:client  # webpack devserver with hmr

Clone repository:
- `git clone git@github.com:GustavGenberg/mensa-ibd-tools.git`

Run install and build inside both `client` and `server`:
- `npm install`
- `npm run build`

Start the application inside `server`:
- `npm start`