var router = require('express').Router();
var db = require('../db');
var Promise = require('bluebird');

module.exports = router;

router.get('/:id', function(req, res, next){
  Promise.all([
    db.getCategory(req.params.id),
    db.getProductsById(req.params.id),
    db.getCategories()
  ])
    .then(function(result){
      var category = result[0];
      res.render('category', {
        category: category,
        products: result[1],
        categories: result[2],
        title: 'Products for ' + category.name
      });
    });
});

router.delete('/:categoryId/products/:id', function(req, res, next){
  db.deleteProduct(req.params.id)
    .then(function(){
      res.redirect('/categories/' + req.params.categoryId);
    });
});

router.delete('/:id', function(req, res, next){
  db.deleteCategory(req.params.id)
    .then(function(){
      res.redirect('/');
    });
});

router.post('/:categoryId/products', function(req, res, next){
  db.createProduct(req.params.categoryId, req.body.name)
    .then(function(){
      res.redirect('/categories/' + req.params.categoryId);
    });
});

router.post('/', function(req, res, next){
  db.createCategory(req.body.name)
    .then(function(id){
      res.redirect('/categories/' + id);
    });
});
