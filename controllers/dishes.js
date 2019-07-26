const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

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