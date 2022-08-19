import * as fs from 'fs';
import * as path from 'path';

export const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')).toString());