const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const Restaurant = require('../model/Restaurant')

// index
router.get('/', async (req, res)=>{
    console.log(req.session, 'req.session in index or article')
    try {
      
      const foundDishes = await Dish.find();
      
      res.render('dishes/index.ejs', {
        dishes: foundDishes,
      })
    } catch (err) {
      res.send(err);
    }
  });

// new
router.get('/new', (req, res)=>{
    
    Restaurant.find({}, (err, allRestaurants) => {
      if(err){
        res.send(err);
      } else {
        console.log(allRestaurants, "< -- new route in dishes ")
        console.log('restaurants array ^^^^^^^^^^^^^');
        res.render('dishes/new.ejs', {
          restaurants: allRestaurants
        });
  
      }
    })
  
  });

  module.exports = router