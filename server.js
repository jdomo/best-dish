const express         = require('express');
const bodyParser      = require('body-parser');
const methodOverride  = require('method-override');
const session         = require('express-session');
const app             = express();

require('./db/db');

app.use(session({
    secret: 'RANDOM SECRET STRING',
    resave: false,
    saveUninitialized: false
  }));

app.use(bodyParser.urlencoded({extended:false}));

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('index.ejs')
  });

app.listen(3000, () => {
    console.log('listening..... on port 3000');
  });