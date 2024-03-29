const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  dishName: String,
  dishDescribe: String,
  dishImg: {type: String, required: true},
  cost: Number,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;