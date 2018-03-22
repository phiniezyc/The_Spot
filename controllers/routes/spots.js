
const express = require('express');

const router = express.Router();
const Spot = require('../../models/Spots');


router.get('/', (req, res) => {
  console.log(req.user);

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

router.post('/', (req, res) => {
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

router.get('/new', (req, res) => {
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

module.exports = router;
