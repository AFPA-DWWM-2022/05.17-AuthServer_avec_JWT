/*
 * controller/auth.js
 * Copyright (C) 2022 Ludovic Fernandez <http://github.com/SirWrexes>
 *
 * Distributed under terms of the MIT license.
 */
'use strict';

const { req, res } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const DBConnection = require('../DBConnection');
const logger = require('../Logger').getInstanceFor('Ctl/Auth');

const validate = require('../validate');
const { pick, makeIterable } = require('../helpers');

const RegFail = {
  default: 'Something went wrong, please try again shortly.',

  passMismatch: 'Password and confirmation mismatch !',
  passFormat: String(
    'Invalid password ! Make sure it contains at least :\n' +
      '  - 8 characters\n' +
      '  - 1 Uppercase character\n' +
      '  - 1 Lowercase character\n' +
      '  - 1 number'
  ),

  mailFormat: 'Invalid mail address !',
  maileDupe:
    'A user has already registered with this address. Try logging in ?',

  nameTooShort: 'Name is too short: it must be at least 2 characters long.',
  nameTooLong: 'Name is too long: it must be at most 24 characters long.',
};

/**
 * @typedef {"name" | "mail" | "pass" | "pass"} FormField
 * @typedef {{ [k in FormField]: string }} FormData
 * @param {req & {body: FormData}} req
 * @param {res} res
 */
exports.register = async (req, res) => {
  const db = await DBConnection.spawn();
  const formData = pick(req.body, 'name', 'mail', 'pass', 'check');
  const { name, mail, pass, check } = formData;

  const retry = (error) =>
    logger.err(error).debug('Reload registration page') &&
    res.render('register', {
      error: error instanceof Error ? RegFail.default : error,
    });

  // TODO: Fragment this shit oh my god please
  try {
    logger
      .info('Validate form data')
      .debug('↳ ' + JSON.stringify(formData, null, 4));

    if (pass !== check) throw RegFail.passMismatch;
    logger.debug('[✓] Pass and confirmation match');
    if (!validate.pass(pass)) throw RegFail.passFormat;
    logger.debug('[✓] Pass format');
    if (!validate.mail(mail)) throw RegFail.mailFormat;
    logger.debug('[✓] E-Mail format');

    const nameLen = name.length;
    if (nameLen < 2) throw RegFail.nameTooShort;
    if (nameLen > 24) throw RegFail.nameTooLong;
    logger.debug('[✓] Name length');

    // TODO: Implement some more complex salt
    logger.info('Encrypt the password');
    const hash = await bcrypt.hash(pass, process.env.SALT || 12);
    const hexa = Buffer.from(hash).toString('hex');
    logger.debug('↳ ' + JSON.stringify({ hash, hexa }, null, 4));

    // TODO: Add an interface to DBConnection to ease this process
    //     : Something like db.user.insert({name, mail, pass})
    //  XXX: A cool idea would be to dinamically generate the interface based on the DB model
    logger.info('Insert the new user in the Database');
    await db.execute(
      `
        INSERT INTO users (
            mail, name, pass
        ) VALUES (
            ?   , ?   , UNHEX(?)
        )
      `,
      [mail, name, hexa]
    );
  } catch (e) {
    if (e.message.includes(mail)) e = RegFail.maileDupe;
    retry(e);
  }
  res.status(200).render('register', { message: 'Success ! You can try logging in, now.' });
};

exports.login = async (req, res) => {
  const { mail, password } = req.body;

  if (!mail || !password) {
    return res.status(400).render('login', {
      message: '-: OOps! provide an mail and password :-',
    });
  }
  const sql = 'select id, name, mail, password from user where `mail` = ?';
  db.query(sql, [mail], async (error, resultQuery) => {
    if (!resultQuery.length) {
      return res.status(400).render('login', {
        message: '-: OOps! mail or password is incorrect :-',
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      resultQuery[0].password
    );
    if (!isValidPassword) {
      return res.status(400).render('login', {
        message: '-: OOps! mail or password is incorrect :-',
      });
    }

    const id = resultQuery[0].id;
    const token = jwt.sign({ id }, process.env.JWT_SANFLE, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOpt = {
      expiresIn: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie('node-mysql', token, cookieOpt);
    return res.status(200).redirect('/');
  });
};
