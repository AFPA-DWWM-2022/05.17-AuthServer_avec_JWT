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
      namedPlaceholders: true,
    };
  }

  static toString = () => JSON.stringify(this.options, null, 4);

  static async spawn() {
    const conn = mysql.createConnection(this.options);

    try {
      await conn;
      logger
        .info(`Connecting to DB ${this.#database} successful`)
        .debug(`↳ with options: ${this}`);
    } catch (e) {
      logger.error('Something went wrong. See details below.').error(e);
      return undefined;
    }
    return conn;
  }

  /**
   * @param {'die' | 'throw'} onFailure
   */
  static async check(onFailure = undefined) {
    logger.info('Perform connection test').debug(`↳ with options: ${DBConnection}`);
    try {
      await mysql.createConnection(this.options);
      logger.info('Connection successful !');
    } catch (e) {
      logger[onFailure](e) || logger.err(e);
    }
  }
}

module.exports = DBConnection;
