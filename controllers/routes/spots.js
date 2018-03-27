
const express = require('express');

const router = express.Router();
const Spot = require('../../models/Spots');


router.get('/', (req, res) => {
  // console.log(req.user);

  Spot.find({}, (err, allSpots) => {
    if (err) {
      console.log(err);
    } else {
      res.render('spots/spots', {
        spots: allSpots,
        currentUser: req.user,
      });
    }
  });
});

router.post('/', isLoggedIn, (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const { description } = req.body;
  const author = {
    id: req.user.id,
    username: req.user.username,
  };
  const newSpot = {
    name, image, description, author,
  };

  Spot.create(newSpot, (err, newCreatedSpot) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/spots');
    }
  });
});

router.get('/new', isLoggedIn, (req, res) => {
  res.render('spots/new');
});

router.get('/:id', (req, res) => {
  // finding the spot, populating the comments on that spot, THEN executiring the query we made
  Spot.findById(req.params.id).populate('comments').exec((err, foundSpot) => {
    if (err) {
      console.log(err);
    } else {
      res.render('spots/show', { spot: foundSpot });
    }
  });
});


// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', (req, res) => {
  Spot.findById(req.params.id, (err, foundSpot) => {
    if (err) {
      res.redirect('/spots');
    } else {
      res.render('spots/edit', { spot: foundSpot });
    }
  });
});

// UPDATE CAMPGROUND ROUTE
router.put('/:id', (req, res) => {
  Spot.findByIdAndUpdate(req.params.id, req.body.spot, (err, updatedSpot) => {
    if (err) {
      res.redirect('/spots');
    } else {
      res.redirect(`/spots/${req.params.id}`);
    }
  });
});

function isLoggedIn(req, res, next) { // Can use this on ANY page we want to restrict
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
