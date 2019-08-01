const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/#link-land');
      }
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const foundUser = await User.findOne({username: req.body.username});

    if (foundUser) {

      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.userId = foundUser._id;
        req.session.username = foundUser.username;
        req.session.logged = true;
        req.session.message = undefined;
        res.redirect('/#link-land');

      } else {
        console.log('incorrect password')
        req.session.message = 'Incorrect username and/or password';
        res.redirect('/#link-land');
      }
    } else {
      console.log('incorrect user')
      req.session.message = 'Incorrect username and/or password';
      res.redirect('/#link-land');
    }
  } catch (err) {
    res.send(err);
  }
});

router.post('/register', async (req, res) => {
  const password = req.body.password;

  //encrypt
  const hashedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  req.body.password = hashedPass;

  try {
    const newUser = await User.create(req.body);

    req.session.userId = newUser._id;
    req.session.username = newUser.username;
    req.session.logged = true;
    res.redirect('/#link-land');

  } catch (err) {
    res.send(err);
  }
})

module.exports = router;