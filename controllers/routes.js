
const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
  res.render('index');
});

router.get('/spots', (req, res) => {
  const test = [{ name: 'chance' }, { name: 'Bill' }, { name: 'Chipper' }];
  const blue = 'yo!!!!';
  res.render('spots', {
    test,
    blue,
  });
});

module.exports = router;
