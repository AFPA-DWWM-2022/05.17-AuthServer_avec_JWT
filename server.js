/*
 * app.js (Entry point)
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

const path = require('path');
require('dotenv').config({ path: './.env.dev' });

require('colors');

const express = require('express');
const cookieParser = require('cookie-parser');

const DBConnection = require('./DBConnection');
const logger = require('./Logger').getInstanceFor('Server');

const port = process.env.PORT || 8008;
const server = express();

server.use(express.static(path.join(__dirname, 'public')));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cookieParser());

server.set('view engine', 'hbs');

server.use('/', require('./router/root'));
server.use('/auth', require('./router/auth'));

async function main() {
  DBConnection.check('die');
  server.listen(port, () => {
    logger.info(
      `Authentication server is now listening on port ${port}`,
      'bgGreen',
      'white'
    ).info('↳ http://localhost:1337/');
  });
}

main();
