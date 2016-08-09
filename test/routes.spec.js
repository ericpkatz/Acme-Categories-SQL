var expect = require('chai').expect;
var client = require('supertest')(require('../app'));
var db = require('../db');

describe('routes', function(){
  var barId, qugId
  beforeEach(function(done){
    db.seed()
      .then(function(result){
        barId = result[1];
        return db.createProduct(barId, 'qug');
      })
      .then(function(id){
        qugId =  id;
        done(); 
      })
      .catch(function(err){
        done(err);
      });
  });
  describe('home page', function(){
    it('has the message welcome', function(done){
      client.get('/')
        .expect(200)
        .end(function(err, result){
          if(err)
            return done(err);
          expect(result.text).to.contain('Welcome');
          expect(result.text).to.contain('foo');
          expect(result.text).to.contain('bar');
          expect(result.text).to.contain('buzz');
          expect(result.text).to.contain('Insert Category');
          done();
        });
    });
  });
  describe('GET categories/:categoryId', function(){
    it('expect shows products for category', function(done){
      var url = '/categories/' + barId;
      client.get(url)
        .expect(200)
        .end(function(err, result){
          if(err)
            return done(err);
          expect(result.text).to.contain('qug');
          expect(result.text).to.contain('foo');
          expect(result.text).to.contain('bar');
          expect(result.text).to.contain('Delete Category');
          expect(result.text).to.contain('Delete Product');
          expect(result.text).to.contain('Products for bar');
          expect(result.text).to.contain('Insert Product');
          done();
        });
    });
  });

  describe('DELETE /categories/:id', function(){
    it('redirects to the home page', function(done){
      client.delete('/categories/' + barId)
        .expect(302)
        .end(function(err, result){
          if(err)
            return done(err);
          expect(result.header.location).to.equal('/');
          done();
        });
    
    });
  });

  describe('POST /categories/:categoryId/products', function(){
    it('redirects back to categories page', function(done){
      client.post('/categories/' + barId + '/products')
        .send('name=hello')
        .expect(302)
        .end(function(err, result){
          if(err)
            return done(err);
          expect(result.header.location).to.equal('/categories/' + barId);
          done();
        });
    });
  
  });

  describe('DELETE /categories/:categoryId/products/:productId', function(){
    it('redirects back to categories page', function(done){
      client.delete('/categories/' + barId + '/products/' + qugId)
        .expect(302)
        .end(function(err, result){
          if(err)
            return done(err);
          expect(result.header.location).to.equal('/categories/' + barId);
          done();
        });
    });
  });

  describe('POST /categories', function(){
    it('redirects to the new category', function(done){
      client.post('/categories')
        .send('name=whatever')
        .expect(302)
        .end(function(err, result){
          if(err)
            return done(err);
          expect(result.header.location).to.contain('categories');
          done();
        });
    });
  });
});
