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
        res.redirect('/');
      }
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const foundUser = await User.findOne({username: req.body.username});
    console.log(foundUser, '<--- foundUser on login route');

    if (foundUser) {

      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.userId = foundUser._id;
        req.session.username = foundUser.username;
        req.session.logged = true;
        req.session.message = '';
        res.redirect('/');

      } else {
        req.session.message = 'Incorrect username and/or password';
        res.redirect('/');
      }
    } else {
      req.session.message = 'Incorrect username and/or password';
      res.redirect('/');
    }

  } catch (err) {
    res.send(err);
  }
});

router.post('/register', async (req, res) => {
  const password = req.body.password;

  //encrypt
  const hashedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  console.log(hashedPass, '<--- hashed password after hashSync');

  req.body.password = hashedPass;

  try {
    const newUser = await User.create(req.body);
    console.log(newUser, '<--- new user from users post route to register');

    req.session.userId = newUser._id;
    req.session.username = newUser.username;
    req.session.logged = true;
    res.redirect('/', {
      username: req.session.username
    });

  } catch (err) {
    res.send(err);
  }
})

module.exports = router;