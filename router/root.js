/*
 * router/root.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

const root = require('express').Router();

root.get('/', (_, res) => res.render('index')).get('/', require('./auth'));

module.exports = root;
