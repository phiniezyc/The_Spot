
const express = require('express');

const router = express.Router();
const passport = require('passport');
// const LocalStrategy = require('passport-local');
const User = require('../../models/Users');


router.get('/', (req, res) => {
  res.render('index');
});


// AUTH ROUTES
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message); // Could write custom errors but we just use mongoose instead.
      return res.redirect('register'); // Return is a good way to just exit the callback if we get an error
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Welcome to YelpCamp ${user.username}`);
      res.redirect('spots');
    });
  });
});


router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/spots',
  failureRedirect: '/login',
}), (req, res) => {});
// req, res doesn't do anything, but left so can see how the middleware works

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'You are now logged out');
  res.redirect('/spots');
});


module.exports = router;
