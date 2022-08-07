# mensa-ibd-tools

## Getting Started
```bash
$ nvm use 12  # enable node v12
              # because of deprecated node-sass

# preparations
$ cd client; rm package-lock.json  # move registry from enterspace.se to npmjs.org
# manually remove dependency keyboard.js from client/package.json
$ npm install
# now disable code, depending on module keyboard.js in:
#   client/src/services/meeting/Keyboard.ts
#   client/src/pages/meeting/chairman/Vote.ts

$ cd ../server; rm package-lock.json; npm i; cd ..

# finish preparations
$ mkdir server/sqlite  # empty directories can't be tracked in git
$ npm i -D typescript
$ npm run build  # build all, might take some time, be patient
# if you get an error about client/src/services/admin/Auth.ts:27:30, fix it and retry

# start app
$ npm start

# navigate to localhost:{port}/admin and create a meeting
# if you have no credentials to login, add them manually in the database, i've used
# a gui tool:
$ sqlitebrowser server/sqlite/mensa-ibd-tools.sqlite

# now you should really be good to go
```
## old readme
Clone repository:
- `git clone git@github.com:GustavGenberg/mensa-ibd-tools.git`

Run install and build inside both `client` and `server`:
- `npm install`
- `npm run build`

Start the application inside `server`:
- `npm start`