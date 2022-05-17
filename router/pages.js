/*
 * pages.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

module.exports = require('express')
  .Router()
  .get('/', (_, res) => res.redirect('/auth/register'));
