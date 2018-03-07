
const express = require('express');

const router = express.Router();
const Spots = require('../models/spots'); 


router.get('/', (req, res) => {
  res.render('index');
});

router.get('/spots', (req, res) => {
  Spots.find({}, (err, allSpots) => {
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
  const newSpot = { name, image };
  Spots.create(newSpot, (err, newCreatedSpot) => {
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


module.exports = router;
