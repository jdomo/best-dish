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
    Restaurant.create();
    res.render('restaurants/new.ejs')
  });

// edit
router.get('/:id/edit', async (req, res, next) => {
    try  {
  
     const foundRestaurant = await Restaurant.findById(req.params.id);
  
     res.render('restaurants/edit.ejs', {
       restaurant: foundRestaurant,
     });
  
   } catch (err){
     res.send(err);
   }
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

// show 
router.get('/:id', async (req, res) => {
    try  {
  
     const foundRestaurant = await Restaurant.findById(req.params.id).populate('dishes');
  
     res.render('restaurants/show.ejs', {
       restaurant: foundRestaurant,
     });
  
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

// delete
router.delete('/:id', async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndRemove(req.params.id);
    console.log(deletedRestaurant);

    const foundRestaurant = await Restaurant.findOne({'dishes': req.params.id});
    console.log(foundRestaurant, "<---found restaurant");
    foundRestaurant.dishes.remove(req.params.id);
    res.redirect('/restaurants')


  } catch(err) {
    console.log(err)
    res.send(err)
  }

  })
  
module.exports = router;