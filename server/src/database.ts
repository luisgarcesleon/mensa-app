import * as path from 'path';
import sqlite from 'sqlite3';
import { config } from './config';
import { logger } from './logger';

const file = path.join(__dirname, config.sqlite);

export const database = new (sqlite.verbose()).Database(file);

database.once('open', () => {
	logger.info(`Connected to ${file}.`);

	logger.info(`Initializing database...`);

	database.serialize(() => {
		database.run(`CREATE TABLE IF NOT EXISTS "meetings" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name"	VARCHAR NOT NULL,
	"description"	TEXT NOT NULL,
	"date"	VARCHAR NOT NULL,
	"token"	VARCHAR NOT NULL UNIQUE,
	"code"	VARCHAR NOT NULL,
	"active"	BOOLEAN NOT NULL
)`)

		database.run(`CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
     "username"	VARCHAR NOT NULL UNIQUE,
     "password"	VARCHAR NOT NULL
)`)

		database.run(`INSERT OR IGNORE INTO "users" (username,password)
		VALUES ("admin","admin")`);

		database.run(`CREATE TABLE IF NOT EXISTS "vote_motions" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"meeting"	INTEGER NOT NULL,
	"number"	INTEGER NOT NULL,
	"name"	VARCHAR NOT NULL
)`)

		database.run(`CREATE TABLE IF NOT EXISTS "votes" (
			"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"meeting"	INTEGER NOT NULL,
			"motion"	INTEGER NOT NULL,
			"delegate"	INTEGER NOT NULL,
			"vote"	INTEGER NOT NULL
		)`)

		database.run(`CREATE TABLE IF NOT EXISTS "delegates" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"meeting"	INTEGER NOT NULL,
	"country"	VARCHAR NOT NULL,
	"cc"	VARCHAR NOT NULL,
	"name"	VARCHAR NOT NULL,
	"initials"	VARCHAR NOT NULL,
	"weight"	INTEGER NOT NULL,
	"pin"	VARCHAR NOT NULL
)`)
	})
})

database.on('error', () => {
	logger.fatal(`Could not connect to ${file}.`);
})