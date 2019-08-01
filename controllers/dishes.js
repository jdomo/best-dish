const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

// index
router.get('/', async (req, res) => {
  try {    
    const foundDishes = await Dish.find().populate('postedBy').populate('restaurant'); 
    console.log(foundDishes, '<-- foundDishes in dishes index get route')  
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

      res.render('dishes/show.ejs', {
        session: req.session,
        restaurant: foundRestaurant,
        dish: foundDish
      })
  
    } catch(err) {
      console.log(err);
    }
  });

// post
router.post('/', async (req, res) =>{
    try {
      const createdDish = await Dish.create(req.body);
      console.log(createdDish, '<-- createdDish on dishes post route')
      
      const foundRestaurant = await Restaurant.findById(req.body.restaurant);
      foundRestaurant.dishes.push(createdDish);
      await foundRestaurant.save();
      console.log(foundRestaurant, '<-- foundRestaurant on dishes post route')

      const foundUser = await User.findById(req.session.userId);
      createdDish.postedBy = foundUser._id;
      await createdDish.save();
        ////////////////////////
      console.log(createdDish, '<--- createdDish');

      res.redirect('/dishes#link-land');
  
    } catch (err) {
      console.log(err)
    }
  });

// edit
router.get('/:id/edit', async (req, res) => {
    console.log(req.session, '<--- req.session on dish edit route');
    try  {
     console.log('<---- in edit route')
     const allRestaurants = await Restaurant.find({})
     console.log(allRestaurants, "<--allRestaurants")
     const foundDishRestaurant = await Restaurant.findOne({'dishes': req.params.id})
       .populate({path: 'dishes', match:{_id: req.params.id}});
  
       console.log(foundDishRestaurant.dishes[0], "<---foundDishRestaurant")
    if (req.session.userId == foundDishRestaurant.postedBy) {
      res.render('dishes/edit.ejs', {
        dish: foundDishRestaurant.dishes[0],
        restaurants: allRestaurants,
        dishRestaurant: foundDishRestaurant,
        session: req.session
      });
    } else {
      res.send('You don\'t have permission to be here!');
    }
   } catch (err){
    console.log(err)
    res.send(err);
   }
  });

// delete
router.delete('/:id', async (req, res) => {
    try {
      const toDelete = await Dish.findById(req.params.id);
      if (req.session.userId == toDelete.postedBy) {
        const deletedDish = await Dish.findByIdAndRemove(req.params.id);
        console.log(deletedDish);

        const foundRestaurant = await Restaurant.findOne({'dishes': req.params.id});
        console.log(foundRestaurant);
        foundRestaurant.dishes.remove(req.params.id);
        res.redirect('/dishes#link-land')
      } else {
        res.send('You don\'t have permission to be here!');
      }
    } catch(err) {
      res.send(err)
    }
  });

// put
router.put('/:id', async (req, res) => {
    try  {
    
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, {new: true});
    console.log(updatedDish, "<---updated dish")
  
    res.redirect('/dishes#link-land')
    
    } catch (err){
        res.send(err);
    }
});
  
module.exports = router