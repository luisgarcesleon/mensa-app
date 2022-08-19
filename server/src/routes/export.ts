import * as express from 'express';
import { parse } from 'json2csv';
import { database } from '../database';
import { requireValidToken } from './requireValidToken';
import { VOTE_OPTIONS } from '../../../shared/build';

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

     try {
          const delegates: any = await new Promise((resolve) => {
               database.prepare('SELECT * FROM delegates WHERE meeting = ?').all(meeting.id, (err, rows) => {
                    resolve(rows);
               }).finalize()
          })

          const motions: any = await new Promise((resolve) => {
               database.prepare('SELECT * FROM vote_motions WHERE meeting = ?').all(meeting.id, (err, rows) => {
                    resolve(rows);
               }).finalize()
          })

          const votes: any = await new Promise((resolve) => {
               database.prepare('SELECT votes.*, delegates.weight FROM votes INNER JOIN delegates on votes.delegate = delegates.id WHERE votes.meeting = ?').all(meeting.id, (err, rows) => {
                    resolve(rows);
               }).finalize()
          })

          let csv = [
               'sep=,'
          ]

          const insertEmptyLine = () => {
               csv.push(',,' + ','.repeat(motions.length));
          }

          csv.push(`${meeting.name},,${','.repeat(motions.length)}`);
          csv.push(`${meeting.description},,${','.repeat(motions.length)}`);

          insertEmptyLine();

          {
               const numbers = [];
               const names = [];

               for (const motion of motions) {
                    numbers.push(`#${motion.number}`);
                    names.push(motion.name);
               }

               csv.push(',,,' + numbers.join(','));
               csv.push(',,,' + names.join(','));
          }

          for (const delegate of delegates) {
               const array = [
                    delegate.country,
                    delegate.name,
                    delegate.weight
               ]

               for (const motion of motions) {
                    const vote = votes.find((vote: any) => vote.delegate === delegate.id && vote.motion === motion.id);
                    array.push(vote ? VOTE_OPTIONS[vote.vote] : 'NONE');
               }

               csv.push(array.join(','));
          }

          insertEmptyLine();

          for (const option of [
               VOTE_OPTIONS.YES,
               VOTE_OPTIONS.NO,
               VOTE_OPTIONS.ABSTAIN,
               VOTE_OPTIONS.DID_NOT_VOTE
          ]) {
               const array = [];

               for (const motion of motions) {
                    const total = votes
                         .filter((vote: any) => vote.motion === motion.id && vote.vote === option)
                         .map((vote: any) => vote.weight)
                         .reduce((acc: number, curr: number) => acc + curr, 0)

                    array.push(total);
               }

               csv.push(`,,${VOTE_OPTIONS[option]},` + array.join(','));
          }

          res.header('Content-Type', 'text/csv');
          res.header('Content-Disposition', `attachment; filename="${meeting.name}-${+new Date}.csv"`);
          res.send(csv.join('\n'));
     } catch (err) {
          console.error(err);

          return res.send({
               error: true
          })
     }
})