const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: String,
  favDishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;