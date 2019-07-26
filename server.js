const express         = require('express');
const bodyParser      = require('body-parser');
const methodOverride  = require('method-override');
const session         = require('express-session');
const app             = express();

require('./db/db');

const dishesController = require('./controllers/dishes.js');
const restaurantsController = require('./controllers/restaurants.js');
const usersController = require('./controllers/users.js')

app.use(session({
    secret: 'RANDOM SECRET STRING',
    resave: false,
    saveUninitialized: false
  }));

app.use(bodyParser.urlencoded({extended:false}));

app.use(methodOverride('_method'));

app.use('/dishes', dishesController);
app.use('/restaurants', restaurantsController);
app.use('/auth', usersController)

app.get('/', (req, res) => {
    res.render('index.ejs')
  });

app.listen(3000, () => {
    console.log('listening..... on port 3000');
  });