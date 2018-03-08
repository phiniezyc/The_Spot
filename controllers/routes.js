
const express = require('express');

const router = express.Router();
const Spot = require('../models/spots');


router.get('/', (req, res) => {
  res.render('index');
});

router.get('/spots', (req, res) => {
  Spot.find({}, (err, allSpots) => {
    if (err) {
      console.log(err);
    } else {
      res.render('spots', {
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
  res.render('new');
});

router.get('/spots/:id', (req, res) => {
  // const spotId = req.params.id;
  // console.log(spotId);
  Spot.findById(req.params.id, (err, foundSpot) => {
    if (err) {
      console.log(err);
    } else {
      res.render('show', { spot: foundSpot });
    }
  });
});


module.exports = router;
