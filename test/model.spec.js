var expect = require('chai').expect;
var db = require('../db');

describe('db', function(){
  beforeEach(function(done){
    db.truncate()
      .then(function(){
        done();
      });
  });

  it('exists', function(){
    expect(db).to.be.ok;
  });

  describe('#deleteProduct', function(){
    var fooId;
    beforeEach(function(done){
      db.seed()
        .then(function(result){
          fooId = result[0];
          return db.createProduct(fooId, 'qug');
        })
        .then(function(productId){
          return db.deleteProduct(productId);
        })
        .then(function(){
          done();
        });
    });

    it('returns products for category', function(done){
      db.getProductsById(fooId)
        .then(function(products){
          expect(products.length).to.equal(0);
          done();
        });
    });
  
  });

  describe('#getProducts', function(){
    var fooId;
    beforeEach(function(done){
      db.seed()
        .then(function(result){
          fooId = result[0];
          return db.createProduct(fooId, 'qug');
        })
        .then(function(){
          done();
        });
    });

    it('returns products for category', function(done){
      db.getProductsById(fooId)
        .then(function(products){
          expect(products.length).to.equal(1);
          expect(products[0].name).to.equal('qug');
          done();
        });
    });
  
  });
  describe('#deleteCategory', function(){
    var fooId;
    beforeEach(function(done){
      db.seed()
        .then(function(results){
          fooId = results[0];
          done();
        });
    });
    it('deletes the category', function(done){
      db.getCategory(fooId)
        .then(function(category){
          expect(category.name).to.equal('foo');
          return db.deleteCategory(fooId);
        })
        .then(function(){
          return db.getCategory(fooId);
        })
        .then(function(category){
          expect(category).to.equal(null);
          done();
        })
        .catch(function(err){
          done(err);
        });
    });
  });

  describe('#getCategory', function(){
    var fooId;
    beforeEach(function(done){
      db.seed()
        .then(function(results){
          fooId = results[0];
          done();
        });
    });
    it('gets the category', function(done){
      db.getCategory(fooId)
        .then(function(category){
          expect(category.name).to.equal('foo');
          done();
        })
        .catch(function(err){
          done(err);
        });
    });
  });

  describe('#getCategories', function(){
    describe('with three categories', function(){
      beforeEach(function(done){
        db.seed()
          .then(function(results){
            done();
          });
      });
      it('returns two categories', function(done){
        db.getCategories()
          .then(function(categories){
            expect(categories.length).to.equal(3);
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    describe('with no categories in database', function(){
      it('returns an empty array', function(done){
        db.getCategories()
          .then(function(categories){
            expect(categories).to.eql([]);
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
  });
});
