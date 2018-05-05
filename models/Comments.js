const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
