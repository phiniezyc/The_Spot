
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


// EDIT SPOT ROUTE this gets the update form page and data from that spot
router.get('/:id/edit', checkSpotOwnership, (req, res) => {
  // is user logged in?
  Spot.findById(req.params.id, (err, foundSpot) => {
    res.render('spots/edit', { spot: foundSpot });
  });
});

// UPDATE SPOT ROUTE this is the route that actually makes the spot update
router.put('/:id', (req, res) => {
  Spot.findByIdAndUpdate(req.params.id, req.body.spot, (err, updatedSpot) => {
    if (err) {
      res.redirect('/spots');
    } else {
      res.redirect(`/spots/${req.params.id}`);
    }
  });
});

// DELETE (Destroy) SPOT
router.delete('/:id', (req, res) => {
  Spot.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/spots');
    } else {
      res.redirect('/spots');
    }
  });
});


// Middleware

function isLoggedIn(req, res, next) { // Can use this on ANY page we want to restrict
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkSpotOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Spot.findById(req.params.id, (err, foundSpot) => {
      if (err) {
        res.redirect('back');
      } else if (foundSpot.author.id.equals(req.user._id)) { // has to use this mongoose method because they look the same but one is actually an object and the other a string!
        next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
}
module.exports = router;
