const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

// index
router.get('/', async (req, res) => {
  try {    
    const foundDishes = await Dish.find();   
    res.render('dishes/index.ejs', {
      dishes: foundDishes,
      session: req.session
    })
  } catch (err) {
    res.send(err);
  }
});

//new
router.get('/new', (req, res)=>{
    
    Restaurant.find({}, (err, allRestaurants) => {
      if(err){
        res.send(err);
      } else {
        console.log(allRestaurants, "< -- new route in dishes ")
        console.log('restaurants array ^^^^^^^^^^^^^');
        res.render('dishes/new.ejs', {
          restaurants: allRestaurants,
          session: req.session
        });
      }
    })
  });

// show
router.get('/:id', async (req, res) => {

    try {
  
      const foundRestaurant = await Restaurant.findOne({'dishes': req.params.id}).populate('dishes')
      const foundDish = await Dish.findOne({'_id': req.params.id}).populate('postedBy');
      console.log(foundRestaurant, '<--- foundRestaurant on show route');
      let dish = {};
  
      for( let i = 0; i < foundRestaurant.dishes.length; i++) {
        if(foundRestaurant.dishes[i]._id.toString() === req.params.id.toString()) {
          dish = foundRestaurant.dishes[i];
          console.log(dish, " < the dish")
        }
      }
  
      res.render('dishes/show.ejs', {
        session: req.session,
        restaurant: foundRestaurant,
        dish: dish,
        foundDish: foundDish
      })
  
    } catch(err) {
      console.log(err);
    }
  });

// post
router.post('/', async (req, res) =>{
    try {
      const createdDish = await Dish.create(req.body);
      
      
      const foundRestaurant = await Restaurant.findById(req.body.restaurant);
      foundRestaurant.dishes.push(createdDish);
      await foundRestaurant.save();

      const foundUser = await User.findById(req.session.userId);
      createdDish.postedBy = foundUser._id;
      await createdDish.save();

      console.log(createdDish, '<--- createdDish');

      res.redirect('/dishes');
  
    } catch (err) {
      console.log(err)
    }
  });

// edit
router.get('/:id/edit', async (req, res) => {
    try  {
     console.log('<---- in edit route')
     const allRestaurants = await Restaurant.find({})
     console.log(allRestaurants, "<--allRestaurants")
     const foundDishRestaurant = await Restaurant.findOne({'dishes': req.params.id})
       .populate({path: 'dishes', match:{_id: req.params.id}});
  
       console.log(foundDishRestaurant.dishes[0], "<---foundDishRestaurant")
     res.render('dishes/edit.ejs', {
       dish: foundDishRestaurant.dishes[0],
       restaurants: allRestaurants,
       dishRestaurant: foundDishRestaurant,
       session: req.session
   });
  
   } catch (err){
    console.log(err)
    res.send(err);
   }
  });

// delete
router.delete('/:id', async (req, res) => {
    try {
      const deletedDish = await Dish.findByIdAndRemove(req.params.id);
      console.log(deletedDish);

      const foundRestaurant = await Restaurant.findOne({'dishes': req.params.id});
      console.log(foundRestaurant);
      foundRestaurant.dishes.remove(req.params.id);
      res.redirect('/dishes')

    } catch(err) {
      res.send(err)
    }
  });

// put
router.put('/:id', async (req, res) => {
    try  {
    
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, {new: true});
    console.log(updatedDish, "<---updated dish")
  
    res.redirect('/dishes')
    
    } catch (err){
        res.send(err);
    }
});
  
module.exports = router