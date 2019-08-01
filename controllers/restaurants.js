const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const User = require('../models/User');

// index
router.get('/', async (req, res)=>{
    console.log(req.session, 'req.session in index or dish');
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
  
     res.render('restaurants/edit.ejs', {
       restaurant: foundRestaurant,
       session: req.session
     });
  
   } catch (err){
     res.send(err);
   }
  });

// put
router.put('/:id', async (req, res) => {
    try  {
   
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {new: true});
    // console.log(updatedRestaurant);
  
    res.redirect('/restaurants');

    } catch (err){
      res.send(err);
    }
  });

// show 
router.get('/:id', async (req, res) => {
    try  {
  
     const foundRestaurant = await Restaurant.findById(req.params.id).populate('dishes').populate('postedBy');
     console.log(foundRestaurant, '<--- foundResto on resto show route')     
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
     console.log(createdRestaurant)
     const foundUser = await User.findById(req.session.userId);
     console.log(req.session, '<-- req.session on resto post route');
     //  console.log(foundUser);
     createdRestaurant.postedBy = foundUser._id;
     await createdRestaurant.save();
     res.redirect('/restaurants');
     
   } catch (err){
     console.log(err);
  
   }
  });

// delete
router.delete('/:id', async (req, res) => {
  try {

    const deletedRestaurant = await Restaurant.findOneAndDelete(req.params.id);
 
 
      const deletedDishes = await Dish.deleteMany({
        _id: {
          $in: deletedRestaurant.dishes
        }
      });

      console.log(deletedDishes)
 
      res.redirect('/restaurants');
  } catch(err){
    res.send(err)
  }
  });
  
module.exports = router;