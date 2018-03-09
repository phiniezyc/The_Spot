const mongoose = require('mongoose');

const { Schema } = mongoose;

const spotSchema = new Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

const Spot = mongoose.model('Spot', spotSchema);


module.exports = Spot;
