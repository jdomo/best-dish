const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// index
router.get('/', async (req, res)=>{
    console.log(req.session, 'req.session in index or article')
    try {
      
      const foundRestaurants = await Restaurant.find();
      
      res.render('restaurants/index.ejs', {
        restaurants: foundRestaurants,
      })
    } catch (err) {
      res.send(err);
    }
  });

module.exports = router;