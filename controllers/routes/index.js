
const express = require('express');

const router = express.Router();

const passport = require('passport');
// const LocalStrategy = require('passport-local');
const User = require('../../models/Users');


// const app = express();
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//   // Custom middleware function so we don't have to add route restriction to every indivual route
//   res.locals.currentUser = req.user;
//   // this is an easy way to pass a variable to all our views. currentUser is available everywhere
//   next();
//   // without next, will just stop everything, next tells it to continue on, important for middleware
// });


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
      console.log(err);
      return res.render('register'); // return is a good way to just exit the callback if we get an error
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('spots');
    });
  });
});


router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/spots',
  failureRedirect: '/login',
}), (req, res) => {});
// this callback doesn't do anything, but left it so can see how the middleware works


router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/spots');
});

// function isLoggedIn(req, res, next) { // Can use this on ANY page we want to restrict
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// }

module.exports = router;
