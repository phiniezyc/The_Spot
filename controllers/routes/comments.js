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
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();

          //  spot here refers to the spot returned after finding Spot by id in this post route
          spot.comments.push(comment);
          spot.save();
          res.redirect(`/spots/${spot._id}`);
        }
      });
    }
  });
});

// COMMENT EDIT ROUTE
router.get('/:comment_id/edit', (req, res) => { // has to be comment_id because already have :id in the route
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect('back');
    } else {
      // we have access to req.params.id because of the long route defined in server.js
      res.render('comments/edit', { spot_id: req.params.id, comment: foundComment });
    }
  });
});

// COMMENT UPDATE ROUTE
router.put('/:comment_id', (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/spots/${req.params.id}`);
    }
  });
});


// COMMENT DESTROY ROUTE
router.delete('/:comment_id', (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/spots/${req.params.id}`);
    }
  });
});

// MIDDLEWARE
function isLoggedIn(req, res, next) { // Can use this on ANY page we want to restrict
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
