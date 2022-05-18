/*
 * index.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

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
