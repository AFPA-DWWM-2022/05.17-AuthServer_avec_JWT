const { ifError } = require('assert');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const validate = require('../validate');
const { makeIterable, getKeyIn } = require('../helpers');

const RegFail = {
  passMismatch: 'Password and confirmation mismatch !',
  passFormat: String(
    'Invalid password ! Make sure it contains at least :\n',
    '  - 8 characters\n',
    '  - 1 Uppercase character\n',
    '  - 1 Lowercase character\n',
    '  - 1 number'
  ),
  mailFormat: 'Invalid mail address !',
  nameTooShort: 'Name is too short: it must be at least 2 characters long.',
  nameTooLong: 'Name is too long: it must be at most 24 characters long.',
};

exports.register = (req, res) => {
  const { name, mail, password, passcheck } = req.body;

  try {
    if (password !== passcheck) throw RegFail.passMismatch;
    if (!validate.pass(password)) throw RegFail.passFormat;

    if (!validate.mail(mail)) throw RegFail.mailFormat;

    const nameLen = name.length;
    if (nameLen < 2) throw RegFail.nameTooShort;
    if (nameLen > 24) throw RegFail.nameTooLong;
  } catch (e) {}
  return res.render('register', {
    message: '-: OOps! The password(s) do not match :-',
  });

  db.connect((error) => {
    if (error) {
      return res.status(200).redirect('/');
    }
    let hashedPassowrd = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO user set ?',
      { name, mail, password: hashedPassowrd },
      (err, res) => {
        ifError(err);
        res.status(200).redirect('/');
      }
    );
  });
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
