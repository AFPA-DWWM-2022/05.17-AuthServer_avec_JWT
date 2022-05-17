/*
 * db.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

const mysql = require('mysql2/promise');

const logger = require('./Logger').getInstanceFor('MySQL');

class DBConnection {
  static #host = process.env.DATABASE_HOST;
  static #user = process.env.DATABASE_USER;
  static #password = process.env.DATABASE_PASS;
  static #database = process.env.DATABASE_NAME;

  static get options() {
    return {
      host: this.#host,
      user: this.#user,
      password: this.#password,
      database: this.#database,
    };
  }

  static toString = () => JSON.stringify(this.options);

  static async spawn() {
    const conn = mysql.createConnection(this.options);

    try {
      logger.info(`Connecting to DB ${this.#database}...`);
      await conn;
      logger.info('Success !');
    } catch (e) {
      logger.err('Something went wrong. See details below.').err(e);
      return undefined;
    }
    return conn;
  }

  constructor() {
    return this.create();
  }

  /** @type {boolean} */
  static #checked = false;

  /** Check that connection is possible */
  static async check() {
    if (this.#checked) return true;

    const dummy = mysql.createConnection(options);
    logger.info(`Checking connection to ${this.#database}`);
    try {
      await dummy;
      logger.info('Success !');
    } catch (e) {
      logger.err('Something went wrong. See details below.').err(e);
    } finally {
      this.#checked = !!dummy;
    }

    return this.#checked;
  }
}

logger.debug(`Connection options:\n${DBConnection.options}`);
