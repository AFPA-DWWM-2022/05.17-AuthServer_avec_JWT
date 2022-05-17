/*
 * req.insert.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

const { asArray, makeIterable } = require('../helpers');

module.exports = {
  insert: (table, fields) => {
    const reqs = [];

    for (const f of asArray(fields)) {
      const names = [];
      const values = [];

      for (const [n, v] of makeIterable(f)) {
        names.push(n);
        values.push(v);
      }

    console.log(toto);
      reqs.push(
        `INSERT INTO ${table} (${names.join(', ')})\n` +
          `VALUES (${values.map((v) => `'${v}'`).join(', ')})`
      );
    }

    return reqs;
  },
};
