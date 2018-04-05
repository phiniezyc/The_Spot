const express = require('express');

const router = express.Router({ mergeParams: true });
// this is needed to merge the :id into one url otherwise reads: /spots //comment
// this merges the params from the spot and comment together
const Spot = require('../../models/Spots');
const Comment = require('../../models/Comments');
const middleware = require('../../middleware'); // index.js is a special name! Don't need to specify the specific file name if it's named index.js. Just require the parent file!


// ========Comment Routes ======================

router.get('/new', middleware.isLoggedIn, (req, res) => {
  Spot.findById(req.params.id, (err, spot) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { spot });
    }
  });
});

router.post('/', middleware.isLoggedIn, (req, res) => { // protects from someone using postman to submit comment
  Spot.findById(req.params.id, (err, spot) => {
    if (err) {
      console.log(err);
      res.redirect('/spots');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Whoops, it looks like something went wrong');
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();

          //  spot here refers to the spot returned after finding Spot by id in this post route
          spot.comments.push(comment);
          spot.save();
          req.flash('sucess', 'Successfully added comment');
          res.redirect(`/spots/${spot._id}`);
        }
      });
    }
  });
});

// COMMENT EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => { // has to be comment_id because already have :id in the route
  Spot.findById(req.params.id, (err, foundSpot) => {
    if (err || !foundSpot) {
      req.flash('error', 'No spot found');
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        // we have access to req.params.id because of the long route defined in server.js
        res.render('comments/edit', { spot_id: req.params.id, comment: foundComment });
      }
    });
  });
});

// COMMENT UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/spots/${req.params.id}`);
    }
  });
});


// COMMENT DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect(`/spots/${req.params.id}`);
    }
  });
});

// MIDDLEWARE
// function isLoggedIn(req, res, next) { // Can use this on ANY page we want to restrict
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// }

// function checkCommentOwnership(req, res, next) {
//   if (req.isAuthenticated()) {
//     Comment.findById(req.params.comment_id, (err, foundComment) => {
//       if (err) {
//         res.redirect('back');
//       } else if (foundComment.author.id.equals(req.user._id)) {
//         /* must use .equals mongoose method because look the same but one actually object
//         other a string! foundComment... is a mongoose object and
//         req.user... a string.  _.id is stored in req.user thanks to passport */
//         next();
//       } else {
//         res.redirect('back');
//       }
//     });
//   } else {
//     res.redirect('back');
//   }
// }

module.exports = router;
