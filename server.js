const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');
const methodOverride = require('method-override');

const User = require('./models/Users');
const commentRoutes = require('./controllers/routes/comments');
const spotRoutes = require('./controllers/routes/spots');
const indexRoutes = require('./controllers/routes/index');
const hbsHelpers = require('./helpers/hbsHelpers');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`)); // __dirname means look for it in full path for the public folder.  It should be unnecessary, but a precaution in case can't find file.

app.use(methodOverride('_method'));
app.use(flash());

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: hbsHelpers,
}));
app.set('view engine', 'handlebars'); // setting this means we can leave off .handlebars on our handlebars files because it is understood as a handlebars file.

// PASSPORT CONFIG
app.use(expressSession({
  secret: 'Ayton is a beast, I hope he is a Hawk!',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // Custom middleware function so don't have to add route restriction to every individual route
  res.locals.currentUser = req.user;
  // this is an easy way to pass a variable to all our views. currentUser is available everywhere
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
  // Without next, will just stop everything, next tells it to continue on, important for middleware
});


app.use('/', indexRoutes);
app.use('/spots', spotRoutes); // '/spots' shortens the routes in spots file. Everything starts w/ /spots
app.use('/spots/:id/comments', commentRoutes);
// Wherever we have a param value (like :id) as a prefix to the routes (like commentRoutes),
// Use mergeParams (in the file) for those routes to get the value of :id passed in to that router.

mongoose.Promise = global.Promise; // Sets mongoose to use the promise API
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/The_Spot');

app.listen(process.env.PORT || 3000, () => {
  console.log('App has started on PORT: 3000');
});

