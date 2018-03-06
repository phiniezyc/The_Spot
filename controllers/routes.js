
const express = require('express');

const router = express.Router();

const spots = [
  { name: 'The Meridian', image: 'https://images.unsplash.com/photo-1502819126416-d387f86d47a1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=09f8419d4dfe16155bb399f0e7ea2069&auto=format&fit=crop&w=2378&q=80' },
  { name: "Billy's", image: 'https://images.unsplash.com/photo-1482112048165-dd23f81c367d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c9cbc5a720ca1ea261afc1e417dce83a&auto=format&fit=crop&w=1950&q=80' },
  { name: 'Coastal', image: 'https://images.unsplash.com/photo-1504823349073-5a888013012e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9b2831ce5bdce91f83899ee065ba80e3&auto=format&fit=crop&w=934&q=80' }];


router.get('/', (req, res) => {
  res.render('index');
});

router.get('/spots', (req, res) => {
  res.render('spots', {
    spots,

  });
});

router.post('/spots', (req, res) => {
  const { name } = req.body;
  const { image } = req.body;
  const newSpot = { name, image };
  spots.push(newSpot);
  res.redirect('/spots');
});

router.get('/spots/new', (req, res) => {
  res.render('new');
});

module.exports = router;
