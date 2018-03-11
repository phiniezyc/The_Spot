
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local');
const routes = require('./controllers/routes.js');
const expressSession = require('express-session');
const User = require('./models/Users');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`)); // __dirname just says look for it in the full path for the public folder.  It should be unnecessary, but it's just a precaution in case can't find file!

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));

app.set('view engine', 'handlebars'); // setting this means we can leave off .handlebars on our handlebars files

// PASSPORT CONFIG
app.use(expressSession({
  secret: 'Ayton is a beast, I hope he is a Hawk!',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.deserializeUser(User.deserializeUser());


app.use('/', routes);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/The_Spot');

app.listen(process.env.PORT || 3000, () => {
  console.log('App has started on PORT: 3000');
});

