const mongoose = require('mongoose');

const { Schema } = mongoose;

const spotSchema = new Schema({
  name: String,
  image: String,
  description: String,
  // this could be called author or user, doesn't really matter
  cost: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

const Spot = mongoose.model('Spot', spotSchema);


module.exports = Spot;
