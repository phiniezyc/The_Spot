const mongoose = require('mongoose');

const { Schema } = mongoose;

const spotSchema = new Schema({
  name: String,
  image: String,
});

const Spot = mongoose.model('Spot', spotSchema);


module.exports = Spot;
