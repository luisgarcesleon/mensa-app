import * as jwt from 'jsonwebtoken';
import uuid from 'uuid';

export const secret = uuid();

export const requireValidToken = (req: any, res: any, next: any) => {
     const token: string = req.header('token') || req.query.token;

     jwt.verify(token, secret, (err, decoded) => {
          if (err) {
               return res.status(400).send({
                    error: true,
                    message: 'Invalid token.'
               })
          }

          next();
     })
}