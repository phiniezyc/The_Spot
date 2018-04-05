const Spot = require('../models/Spots');
const Comment = require('../models/Comments');

/* this is our middleware file.
We could have put these all inside the middleware object as key: value pairs
but this is to demonstrate another way of doing this after the object has been declared. */

const middlewareObj = {};

middlewareObj.checkSpotOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Spot.findById(req.params.id, (err, foundSpot) => {
      if (err || !foundSpot) {
        // or handles all other errors besides what mongoose shows "null, etc..." otherwise breaks app for everyone in prouction!
        req.flash('error', 'Spot not found');
        res.redirect('back');
      } else if (foundSpot.author.id.equals(req.user._id)) {
        /* has to use this mongoose method because they look the same but one is actually an object
              and the other a string! foundSpot... is a mongoose object and req.user... a string */
        next();
      } else {
        req.flash('error', 'You don\'t have permission to do that'); // user probably never sees this but to be sure
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else if (foundComment.author.id.equals(req.user._id)) {
        /* must use .equals mongoose method because look the same but one actually object
            other a string! foundComment... is a mongoose object and
            req.user... a string.  _.id is stored in req.user thanks to passport */
        next();
      } else {
        req.flash('error', 'Whoops, you don\'t have permission to do that');
        res.redirect('back');
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  // Can use this on ANY page we want to restrict
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that'); // Must be placed BEFORE redirect
  res.redirect('/login');
};


module.exports = middlewareObj;
