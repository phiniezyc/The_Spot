
const express = require('express');

const router = express.Router();
const Spot = require('../models/Spots');
const Comment = require('../models/Comments');
const User = require('../models/Users');

const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local');

// const app = express();
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.deserializeUser(User.deserializeUser());


router.get('/', (req, res) => {
  res.render('index');
});

router.get('/spots', (req, res) => {
  Spot.find({}, (err, allSpots) => {
    if (err) {
      console.log(err);
    } else {
      res.render('spots/spots', {
        spots: allSpots,
      });
    }
  });
});

router.post('/spots', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const { description } = req.body;
  const newSpot = { name, image, description };
  Spot.create(newSpot, (err, newCreatedSpot) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/spots');
    }
  });
});

router.get('/spots/new', (req, res) => {
  res.render('spots/new');
});

router.get('/spots/:id', (req, res) => {
  // finding the spot, populating the comments on that spot, THEN executiring the query we made
  Spot.findById(req.params.id).populate('comments').exec((err, foundSpot) => {
    if (err) {
      console.log(err);
    } else {
      res.render('spots/show', { spot: foundSpot });
    }
  });
});

// ========Comment Routes ======================

router.get('/spots/:id/comments/new', (req, res) => {
  Spot.findById(req.params.id, (err, spot) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { spot });
    }
  });
});

router.post('/spots/:id/comments', (req, res) => {
  Spot.findById(req.params.id, (err, spot) => {
    if (err) {
      console.log(err);
      res.redirect('/spots');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          //  spot here refers to the spot returned after finding Spot by id in this post route
          spot.comments.push(comment);
          spot.save();
          res.redirect(`/spots/${spot._id}`);
        }
      });
    }
  });
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
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/spots',
  failureRedirect: '/login',
}), (req, res) => {});
// this callback doesn't do anything, but just left it so can see how the middleware works


module.exports = router;
