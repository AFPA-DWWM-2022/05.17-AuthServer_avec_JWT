/*
 * req.constraint.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

module.exports = {
  constraint: (fields, separator = 'AND') => {
    const k = Object.keys(fields).reverse();
    var i = k.length - 1;
    var c = '';

    while (true) {
      c += `${k[i]} LIKE '${fields[k[i]]}'`;
      if (--i >= 0) c += ` ${separator} `;
      else break;
    }

    return c;
  },
};
