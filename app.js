const path = require('path');
require('dotenv').config({ path: './.env.dev' });

require('colors');

const express = require('express');
const cookieParser = require('cookie-parser');

const DBConnection = require('./db');
const logger = require('./Logger').getInstanceFor('Server');

const port = process.env.PORT || 8008;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

app.use('/', require('./router/pages'));
app.use('/auth', require('./router/auth'));

if (DBConnection.check())
  app.listen(port, () => {
    logger.info(
      `Authentication server is now listening on port ${port}`,
      'bgGreen',
      'white'
    );
  });
