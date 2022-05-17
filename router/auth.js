module.exports = require('express')
  .Router()
  .get('/register', (_, res) => { res.render('register'); })
  .post('/register', require('../controller/auth').signUp);
