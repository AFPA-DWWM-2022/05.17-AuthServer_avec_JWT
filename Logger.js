/*
 * log.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

require('colors');

const fs = require('fs');
const path = require('path');
const { ifError } = require('assert');

const { asArray } = require('./helpers');

class Logger {
  static #logfile = path.join(__dirname, 'app.log');
  static get logfile() {
    return Logger.#logfile;
  }

  /**
   * Date instance to generate timestamps
   * This static member prevents creating a new {@link Date} for every {@link #record} call
   */
  static #DATETIME = new Date();
  static get timestamp() {
    this.#DATETIME.setTime(Date.now());
    return this.#DATETIME.toISOString();
  }

  /**
   * Part of the app the Logger instance is for
   * This is what you see between '[' ']' after the timestamps in the actual log.
   *
   * @type string
   */
  #source = undefined;

  constructor(source) {
    this.#source = source;
    this.debug('Spawn logger instance');
  }

  #record(message, ...formats) {
    message = `${Logger.timestamp} [${this.#source}]: ${message}`;
    if (message instanceof Error) message += `\n${message.stack}`;

    let formatted = message;
    for (const f of asArray(formats)) formatted = formatted[f];

    console.log(formatted);
    fs.appendFile(Logger.logfile, message + '\n', ifError);

    return this;
  }

  /** @param {string | Error} message */
  throw(message) {
    this.#record(message);
    throw message;
  }

  err = (message) => this.#record(message, 'red');
  warn = (message) => this.#record(message, 'yellow');
  info = (message) => process.env.DEBUG && this.#record(message);
  debug = (message) => process.env.DEBUG == 2 && this.#record(message, 'gray');

  /**
   * ! Dangerous !
   * You probably want to use {@link Logger.throw} instead.
   * This kills the process instantly, before any garbage collection.
   * Should never be used unless absolutely necessary.
   *
   * @param {string} message
   */
  die(source, message) {
    record(source, message, 'red', 'underline');
    process.exit(1);
  }
}

const loggerMap = new Map();

module.exports = {
  /**
   * @param {string} source Part of the codebase this logger is for
   *
   * @returns {Logger}
   */
  getInstanceFor: (source) => {
    if (!loggerMap.has(source)) loggerMap.set(source, new Logger(source));
    return loggerMap.get(source);
  },
};
