
const express = require('express');

const router = express.Router();
const Spot = require('../models/spots');
const Comment = require('../models/comments');


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
  res.render('comments/new');
})


module.exports = router;
