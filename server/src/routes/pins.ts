import * as express from 'express';
import { parse } from 'json2csv';
import { database } from '../database';
import { requireValidToken } from './requireValidToken';

export const router = express.Router();

router.get('/:meeting', requireValidToken, async (req, res) => {
     const meeting: any = await new Promise((resolve) => {
          database.prepare('SELECT * FROM meetings WHERE id = ?').get(req.params.meeting, (err, row) => {
               resolve(row);
          }).finalize()
     })

     if (!meeting) {
          return res.send({
               error: true
          })
     }

     const fields = ['name', 'pin'];
     const opts = { fields };

     try {
          const entries: any = await new Promise((resolve) => {
               database.prepare('SELECT * FROM delegates WHERE meeting = ?').all(meeting.id, (err, rows) => {
                    resolve(rows);
               }).finalize()
          })

          const csv = parse(entries, opts);

          // res.header('Content-Type', 'text/csv');
          // res.header('Content-Disposition', `attachment; filename="${meeting.name}-codes-${+new Date}.csv"`);'

          res.header('Content-Type', 'text/plain');
          res.send(csv);
     } catch (err) {
          console.error(err);
     }
})