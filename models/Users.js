const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose); // adds methods to userSchema

const User = mongoose.model('User', userSchema);


module.exports = User;
