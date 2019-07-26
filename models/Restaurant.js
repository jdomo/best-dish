const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  location: String,
  cashOnly = Boolean,
  dishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
  }]
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;