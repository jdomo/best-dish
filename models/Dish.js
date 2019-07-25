const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  dishName: String,
  dishCategory: String,
  dishDescribe: String,
  cost: Number,
  postedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  restaurant: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }]
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;