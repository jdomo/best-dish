const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish')

// index
router.get('/', async (req, res)=>{
    console.log(req.session, 'req.session in index or dish')
    try {
      
      const foundRestaurants = await Restaurant.find();
      
      res.render('restaurants/index.ejs', {
        restaurants: foundRestaurants,
      })
    } catch (err) {
      res.send(err);
    }
  });

//new
router.get('/new', (req, res) => {
    res.render('restaurants/new.ejs')
  });

// put
router.put('/:id', async (req, res) => {
    try  {
   
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {new: true});
    console.log(updatedRestaurant);
  
    res.redirect('/restaurants');
  
    } catch (err){
      res.send(err);
    }
  });

// post
router.post('/', async (req, res) => {
    try  {
  
     const createdRestaurant = await Restaurant.create(req.body);
     console.log(createdRestaurant)
     res.redirect('/restaurants');
  
   } catch (err){
     res.send(err);
  
   }
  });
  
module.exports = router;