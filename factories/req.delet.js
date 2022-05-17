/*
 * req.delet.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

const { asArray } = require('../helpers');
const { constraint } = require('./req.constraint')

module.exports = {
  /** Intentional typo because `delete` is a reserved keyword */
  delet: (table, fields) => {
    fields = asArray(fields).reverse();

    var req = `DELETE FROM ${table}`;
    var i = fields.reverse().length;

    if (i--) req += ' WHERE ';
    while (i >= 0) {
      req += constraint(fields[i]);
      if (--i < 0) break;
      req += ' OR ';
    }

    return req;
  },
};
