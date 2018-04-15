
const express = require('express');

const router = express.Router();
const Spot = require('../../models/Spots');
const middleware = require('../../middleware'); // index.js is a special name. Don't need to specify the specific file name if named index.js. Just require the parent file.


router.get('/', (req, res) => {
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

router.post('/', middleware.isLoggedIn, (req, res) => {
  const { name, image, description, cost } = req.body;
  const author = {
    id: req.user.id, // changed .id to ._id
    username: req.user.username,
  };
  const newSpot = {
    name, image, description, author, cost,
  };

  Spot.create(newSpot, (err, newCreatedSpot) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/spots');
    }
  });
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('spots/new');
});

router.get('/:id', (req, res) => {
  // finding the spot, populating the comments on that spot, THEN executing the query
  Spot.findById(req.params.id).populate('comments').exec((err, foundSpot) => {
    if (err || !foundSpot) {
      req.flash('error', 'Spot not found');
      res.redirect('back');
    } else {
      res.render('spots/show', { spot: foundSpot });
    }
  });
});


// EDIT SPOT ROUTE this gets the update form page and data from that spot
router.get('/:id/edit', middleware.checkSpotOwnership, (req, res) => {
  // Is user logged in?
  Spot.findById(req.params.id, (err, foundSpot) => {
    res.render('spots/edit', { spot: foundSpot });
  });
});

// UPDATE SPOT ROUTE this is the route that actually makes the spot update
router.put('/:id', middleware.checkSpotOwnership, (req, res) => {
  Spot.findByIdAndUpdate(req.params.id, req.body.spot, (err, updatedSpot) => {
    if (err) {
      res.redirect('/spots');
    } else {
      res.redirect(`/spots/${req.params.id}`);
    }
  });
});

// DELETE (Destroy) SPOT
router.delete('/:id', middleware.checkSpotOwnership, (req, res) => {
  Spot.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/spots');
    } else {
      res.redirect('/spots');
    }
  });
});


module.exports = router;
