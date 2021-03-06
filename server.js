const express         = require('express');
const bodyParser      = require('body-parser');
const methodOverride  = require('method-override');
const session         = require('express-session');
const app             = express();

require('dotenv').config()
const PORT = process.env.PORT;
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

app.use(express.static('public'));
app.use('/dishes', dishesController);
app.use('/restaurants', restaurantsController);
app.use('/auth', usersController)

app.get('/', (req, res) => {
  res.render('index.ejs', {
    session: req.session
  })
});

app.listen(PORT, () => {
  console.log(`listening..... on port ${PORT}`);
});

// app.listen(3000, () => {
//   console.log('server up on 3000');
// })