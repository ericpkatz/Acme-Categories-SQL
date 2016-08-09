var express = require('express');
var swig = require('swig');
swig.setDefaults({cache: false});
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var db = require('./db');

var app = express();
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

module.exports = app;

app.get('/', function(req, res, next){
  db.getCategories()
    .then(function(categories){
      res.render('index', {
        title: 'Welcome',
        categories: categories
      });
    });
});

app.use('/categories', require('./routes/categories'));
