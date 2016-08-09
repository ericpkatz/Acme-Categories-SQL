var Promise = require('bluebird');
var pg = require('pg');

module.exports = {
  getCategories: getCategories,
  connect: connect,
  truncate: truncate,
  seed: seed,
  createCategory: createCategory,
  getCategory: getCategory,
  deleteCategory: deleteCategory,
  createProduct: createProduct,
  getProductsById: getProductsById,
  deleteProduct: deleteProduct
};

var _connectionPromise;

function query(qry, params){
  return connect()
    .then(function(conn){
      return new Promise(function(resolve, reject){
        conn.query(qry, params, function(err, result){
          if(err)
            return reject(err);
          resolve(result);
        });
      });
    });
}

function deleteCategory(id){
  return query('delete from categories where id = $1', [id]);
}

function deleteProduct(id){
  return query('delete from products where id = $1', [id]);
}

function getCategory(id){
  return query('select * from categories where id = $1', [ id])
    .then(function(result){
      if(result.rows.length)
        return result.rows[0];
      return null; 
    });
};

function getProductsById(id){
  return query('select * from products where category_id = $1', [ id ])
    .then(function(result){
      return result.rows;
    });
}

function createProduct(id, name){
  return query('insert into products(category_id, name) values ($1, $2) returning id', [id, name])
    .then(function(result){
      return result.rows[0].id;
    });
}

function createCategory(name){
  return query('insert into categories(name) values ($1) returning id', [name])
    .then(function(result){
      return result.rows[0].id;
    });
}

function seed(){
  return truncate()
    .then(function(){
      return Promise.all([ createCategory('foo'), createCategory('bar'), createCategory('buzz') ]);
    });
}

function truncate(){
  return query('truncate table products; truncate table categories', []);
}

function connect(){
  if(_connectionPromise)
    return _connectionPromise;
  _connectionPromise = new Promise(function(resolve, reject){
    var client = new pg.Client(process.env.CONN);
    client.connect(function(err, conn){
      if(err)
        return reject(err);
      resolve(conn);
    });
  });
  return _connectionPromise;
}

function getCategories(){
  return query('select * from categories', [])
    .then(function(result){
      return result.rows;
    });
}
