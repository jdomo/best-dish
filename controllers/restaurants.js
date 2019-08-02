const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const User = require('../models/User');

// index
router.get('/', async (req, res)=>{
    try {   
      const foundRestaurants = await Restaurant.find();
      res.render('restaurants/index.ejs', {
        restaurants: foundRestaurants,
        session: req.session
      })
    } catch (err) {
      res.send(err);
    }
  });

//new
router.get('/new', (req, res) => {
    Restaurant.create();
    res.render('restaurants/new.ejs', {
      session: req.session
    })
  });

// edit
router.get('/:id/edit', async (req, res) => {
    try  {
      const foundRestaurant = await Restaurant.findById(req.params.id);
      if (req.session.userId == foundRestaurant.postedBy) {
        res.render('restaurants/edit.ejs', {
          restaurant: foundRestaurant,
          session: req.session
        });
      } else {
        res.send('You don\'t have permission to do that!');
      }
   } catch (err){
     res.send(err);
   }
});

// put
router.put('/:id', async (req, res) => {
    try  {
   
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {new: true});
    
    res.redirect('/restaurants#link-land');

    } catch (err){
      res.send(err);
    }
  });

// show 
router.get('/:id', async (req, res) => {
    try  {
  
     const foundRestaurant = await Restaurant.findById(req.params.id).populate('dishes').populate('postedBy');
     res.render('restaurants/show.ejs', {
       restaurant: foundRestaurant,
       session: req.session
     });
  
   } catch (err){
  
     res.send(err);
   }
  });

// post
router.post('/', async (req, res) => {
    try {
     const createdRestaurant = await Restaurant.create(req.body);
     const foundUser = await User.findById(req.session.userId);
     createdRestaurant.postedBy = foundUser._id;
     await createdRestaurant.save();
     res.redirect('/restaurants#link-land');
     
   } catch (err){
     console.log(err);
  
   }
  });

// delete
router.delete('/:id', async (req, res) => {
  try {
    const restoDelete = await Restaurant.findById(req.params.id);
    console.log(restoDelete, '<--- restoDelete');
    if (restoDelete.postedBy == req.session.userId) {
      const deletedRestaurant = await Restaurant.findByIdAndDelete(restoDelete._id);
      const deletedDishes = await Dish.deleteMany({
        _id: {
          $in: deletedRestaurant.dishes
        }
      });  
      res.redirect('/restaurants#link-land');
    } else {
      res.send('You don\'t have permission to do that!');
    }
  } catch(err){
    res.send(err)
  }
  });
  
module.exports = router;