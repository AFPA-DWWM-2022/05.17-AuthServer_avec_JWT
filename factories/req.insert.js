/*
 * req.insert.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

const { asArray, makeIterable } = require('../helpers');

module.exports = {
  /**
   * @typedef {[string]} SqlRequestArray
   * @typedef {{[name: string]: string}} SqlField
   * @type {(table: string, fields: SqlField | SqlField[]) => SqlRequestArray}
   */
  insert: (table, fields) => {
    for (const /** @type {SqlField} */ f of asArray(fields)) {
      const destructFields = [...makeIterable(f)];
      const assignmentList = destructFields
        .map(([k, v]) => `${k} = ${v}`)
        .join('\n');
      reqs.push(`INSERT INTO ${table} SET ${assignmentList}`);
    }
    return reqs;
  },
};
