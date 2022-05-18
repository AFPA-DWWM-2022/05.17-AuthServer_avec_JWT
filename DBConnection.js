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

  /** @type mysql.ConnectionOptions */
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
      logger
        .info(`Connecting to DB ${this.#database}`)
        .debug(`↳ with options: ${this.options}`);
      await conn;
      logger.info('Success !');
    } catch (e) {
      logger.error('Something went wrong. See details below.').error(e);
      return undefined;
    }
    return conn;
  }

  /** @type {boolean} */
  static #checked = false;
  static async check() {
    if (!this.#checked)
      this.#checked = !!(await mysql.createConnection(options));
    return this.#checked;
  }
}

logger.debug(`Connection options:\n${DBConnection.options}`);
