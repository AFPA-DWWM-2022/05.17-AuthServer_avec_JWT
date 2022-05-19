/*
 * router/auth.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

const AuthCtl = require('../controller/auth');
const authRouter = require('express').Router();

authRouter
    .get('/register', (_, res) => res.render('register'))
    .post('/register', AuthCtl.register);

authRouter
    .get('/login', (_, res) => res.render('login'))
    .post('/login', AuthCtl.login);

module.exports = authRouter;
