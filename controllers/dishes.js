const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant')

// index
router.get('/', async (req, res)=>{
    console.log(req.session, 'req.session in index or dish')
    try {
      
      const foundDishes = await Dish.find();
      
      res.render('dishes/index.ejs', {
        dishes: foundDishes,
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
          restaurants: allRestaurants
        });
  
      }
    })
  });

// put
router.put('/:id', async (req, res) => {
    try  {
    
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {new: true});
    console.log(updatedRestaurant)
  
    res.redirect('/dishes')
    
    } catch (err){
        res.send(err);
    }
});

// show
router.get('/:id', async (req, res) => {

    try {
  
      const foundRestaurant = await Restaurant.findOne({'dishes': req.params.id}).populate('dishes')
      console.log(foundRestaurant, "<======= found rest");
  
      let dish = {};
  
      for( let i = 0; i < foundRestaurant.dishes.length; i++) {
        if(foundRestaurant.dishes[i]._id.toString() === req.params.id.toString()) {
          dish = foundRestaurant.dishes[i];
          console.log(dish, " < the dish")
        }
      }
  
      res.render('dishes/show.ejs', {
        restaurant: foundRestaurant,
        dish: dish
      })
  
    } catch(err) {
        console.log(err)
      res.send(err);
    }
  });

// edit
router.get('/:id/edit', async (req, res) => {
    try  {
     console.log('<---- in edit route')
     const allRestaurants = await Restaurant.find({})
     const foundDishRestaurant = await Restaurant.findOne({
       'dishes': req.params.id}).populate({path: 'dishes', match:{_id: req.params.id}});
  
       console.log(foundDishRestaurant.dishes[0])
     res.render('dishes/edit.ejs', {
       dish: foundDishRestaurant.dishes[0],
       restaurants: allRestaurants,
       dishRestaurant: foundDishRestaurant
     });
  
   } catch (err){
     res.send(err);
  
   }
  });

// post
router.post('/', async (req, res) =>{
    try {
      const createdDish = await Dish.create(req.body);
  
      console.log('------------')
      console.log(createdDish, 'in post route')
      console.log('------------')
  
      const foundRestaurant = await Restaurant.findById(req.body.restaurant);
      console.log(foundRestaurant)
  
      foundRestaurant.dishes.push(createdDish);
      await foundRestaurant.save()
  
        res.redirect('/dishes')
  
    } catch (err) {
      res.send(err)
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

    })
  
module.exports = router