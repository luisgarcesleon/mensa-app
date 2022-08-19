import * as joi from '@hapi/joi';
import * as express from 'express';
import generator from 'generate-password';
import * as jwt from 'jsonwebtoken';
import uuid from 'uuid';
import { database } from '../database';
import { PinGenerator } from '../PinGenerator';
import { requireValidToken, secret } from './requireValidToken';

export const router = express.Router();

router.route('/session')
     .get(requireValidToken, (req, res) => {
          res.send({
               error: false,
               message: 'Valid token.'
          })
     })
     .post(async (req, res) => {
          const schema = joi.object().keys({
               username: joi.string().required(),
               password: joi.string().required()
          })

          const { error, value } = schema.validate(req.body);

          if (error) {
               return res.status(400).send({
                    error: true,
                    message: error.message
               })
          }

          const user: any = await new Promise((resolve) => {
               database.prepare('SELECT * FROM users WHERE username = ?').get(value.username, (err, row) => {
                    resolve(row);
               }).finalize()
          })

          if (
               !user ||
               user.password !== value.password
          ) {
               return res.status(400).send({
                    error: true,
                    message: 'Username and password do not match.'
               })
          }

          jwt.sign(user, secret, { expiresIn: '1h' }, (err, encoded) => {
               return res.send({
                    error: false,
                    token: encoded
               })
          })
     })

router.route('/meetings')
     .get(requireValidToken, async (req, res) => {
          const meetings: any[] = await new Promise((resolve) => {
               database.all('SELECT * FROM meetings', (err, rows) => {
                    resolve(rows);
               })
          })

          res.send({
               error: false,
               meetings
          })
     })
     .post(requireValidToken, async (req, res) => {
          const schema = joi.object().keys({
               name: joi.string().required(),
               description: joi.string().required()
          })

          const { error, value } = schema.validate(req.body);

          if (error) {
               return res.status(400).send({
                    error: true,
                    message: error.message
               })
          }

          await new Promise((resolve) => {
               database.prepare('INSERT INTO meetings (name, description, date, token, code, active) VALUES (?, ?, ?, ?, ?, ?)').run([
                    value.name,
                    value.description,
                    '',
                    uuid(),
                    generator.generate({
                         length: 8,
                         numbers: true
                    }),
                    1
               ], resolve).finalize()
          })

          res.send({
               error: false
          })
     })

router.route('/meetings/:id')
     .delete(requireValidToken, async (req, res) => {
          await new Promise((resolve) => {
               database.prepare('DELETE FROM meetings WHERE id = ?').run(req.params.id, resolve).finalize();
          })

          res.send({
               error: false
          })
     })

router.put('/meetings/:id/delegates', requireValidToken, async (req, res) => {
     const delegates = req.body;

     await new Promise((resolve) => {
          database.prepare('DELETE FROM delegates WHERE meeting = ?').run(req.params.id, resolve).finalize();
     })

     await new Promise((resolve) => {
          const query = database.prepare('INSERT INTO delegates (meeting, country, cc, name, initials, weight, pin) VALUES (?, ?, ?, ?, ?, ?, ?)');

          let size = 3;

          while (10 ** size < delegates.length) size++;

          const generator = new PinGenerator(size + 1);

          for (const delegate of delegates) {
               query.run([
                    req.params.id,
                    delegate.country,
                    delegate.cc,
                    delegate.name,
                    delegate.initials,
                    delegate.weight,
                    generator.generate()
               ])
          }

          query.finalize(resolve);
     })

     res.send({
          error: false
     })
})