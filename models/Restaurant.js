const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  location: String,
  dishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;