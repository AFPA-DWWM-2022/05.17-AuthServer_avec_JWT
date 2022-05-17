/*
 * router/auth.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

module.exports = require('express')
  .Router()
  .get('/register', (_, res) => { res.render('register'); })
  .post('/register', require('../controller/auth').signUp);
