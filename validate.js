/*
 * validate.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

/**
 * A validator that returns true if the string passed as its argument matches a given RegEx
 * @typedef {(str: string) => boolean} RegExValidator
 */

module.exports = {
  /**
   * Only one @, at least one character on each side, and a . at the end.
   * @type RegExValidator
   */
  mail: (str) => /^[^@]+@[^@]+\./.test(str),

  /**
   * At least 8 characters, with at least one occurence of {alpha, num, special}
   * @type RegExValidator
   */
  pass: (str) => /^(?=.*\w)(?=.*\d)(?=.*\W).{8,70}$/.test(str),
};
