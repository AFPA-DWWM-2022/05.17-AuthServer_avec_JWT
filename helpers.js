/*
 * index.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

const bcrypt = require('bcrypt');
const { type } = require('express/lib/response');

/**
 * Transform `object` into an Array if it isn't one already
 *
 * @template {*} T
 * @type {(object: T) => (T extends [] ? T : T[])}
 */
exports.asArray = (object) => (object instanceof Array ? object : [object]);

/**
 * Enable iterating over the keys of an object
 * @type {(object) => IterableIterator<any>}
 */
exports.makeIterable = (object, sortKeys = false) => {
  object[Symbol.iterator] = function* () {
    const keys = Object.keys(object);
    if (sortKeys) keys.sort();
    for (const k of keys) yield [k, object[k]];
  };

  return object;
};

/**
 * Find the key for a value in given object
 * @type {(value: any, object: Object) => (K extends keyof object ? K : undefined)}
 */
exports.getKeyIn = (value, object) => {
  for (const [k, v] of this.makeIterable(object)) if (v === value) return k;
};

/**
 * Create a subset of an object's properties
 * @template {Object} T
 * @type {(object: T, ...keys: string[]) => {[K in keyof T]: any}}
 */
exports.pick = (object, ...keys) => {
  let sub = {};
  for (const k of keys) if (object[k]) sub[k] = object[k];
  return sub;
};

globalThis.Object.pick = this.pick;

/**
 * TODO: Implement some more complex salt
 * @param {string} pass
 */
exports.encrypt = async (pass) => {
  const crypt = {};
  crypt.hash = await bcrypt.hash(pass, process.env.SALT || 12);
  crypt.buff = Buffer.from(crypt.hash, 'base64');
  crypt.hexa = crypt.buff.toString('hex');
  require('./Logger')
    .getInstanceFor('Helpers/Auth')
    .info('Password encryption successful')
    .debug('↳ ' + JSON.stringify(crypt, null, 4));
  return crypt;
};
