const express = require('express');

const router = express.Router({ mergeParams: true });
// this is needed to merge the :id into one url otherwise reads: /spots //comment
// this merges the params from the spot and comment together
const Spot = require('../../models/Spots');
const Comment = require('../../models/Comments');


// ========Comment Routes ======================

router.get('/new', isLoggedIn, (req, res) => {
  Spot.findById(req.params.id, (err, spot) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { spot });
    }
  });
});

router.post('/', isLoggedIn, (req, res) => { // protects from someone using postman to submit comment
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

function isLoggedIn(req, res, next) { // Can use this on ANY page we want to restrict
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
