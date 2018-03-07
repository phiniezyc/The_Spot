
const express = require('express');

const app = express();
const routes = require('./controllers/routes.js');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));

app.set('view engine', 'handlebars'); // setting this means we can leave off .handlebars on our handlebars files

app.use('/', routes);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/The_Spot');

app.listen(process.env.PORT || 3000, () => {
  console.log('App has started on PORT: 3000');
});

