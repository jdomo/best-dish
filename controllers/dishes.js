const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

// index
router.get('/', async (req, res) => {
  try {    
    const foundDishes = await Dish.find().populate('postedBy').populate('restaurant'); 
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

      res.render('dishes/show.ejs', {
        session: req.session,
        restaurant: foundRestaurant,
        dish: foundDish
      })
  
    } catch(err) {
      res.send(err);
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

      res.redirect('/dishes#link-land');
  
    } catch (err) {
      res.send(err)
    }
  });

// edit
router.get('/:id/edit', async (req, res) => {
    try  {
     const allRestaurants = await Restaurant.find({})
     const foundDishRestaurant = await Restaurant.findOne({'dishes': req.params.id})
       .populate({path: 'dishes', match:{_id: req.params.id}}); 
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
    res.send(err);
   }
  });

// delete
router.delete('/:id', async (req, res) => {
    try {
      const toDelete = await Dish.findById(req.params.id);
      if (req.session.userId == toDelete.postedBy) {
        const deletedDish = await Dish.findByIdAndRemove(req.params.id);

        const foundRestaurant = await Restaurant.findOne({'dishes': req.params.id});
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

    const findOldRestaurant = await Restaurant.findOne({'dishes': updatedDish.id});
    findOldRestaurant.dishes.splice(findOldRestaurant.dishes.indexOf(updatedDish), 1);
    await findOldRestaurant.save();

    const foundNewRestaurant = await Restaurant.findById(req.body.restaurantId)
    foundNewRestaurant.dishes.push(updatedDish);
    await foundNewRestaurant.save();

    updatedDish.restaurant = foundNewRestaurant;
    await updatedDish.save();
  
    res.redirect('/dishes#link-land');
    
    } catch (err){
      res.send(err);
    }
});
  
module.exports = router;