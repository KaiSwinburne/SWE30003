const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

let productList = [];

function loadproducts() {
  const results = [];
  const filePath = path.resolve(__dirname, '../database/products.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', function(data) {
      results.push(data);
    })
    .on('end', function() {
      productList = results;
      console.log(productList);
    });
}

loadproducts();

function getAllProducts(callback) {
  callback(productList);
}

function getFeaturedProducts(callback) {
  const featuredProducts = productList.filter(function(product) {
    return product.Featured === "Yes";
  });
  callback(featuredProducts);
}

module.exports = {
  getAllProducts: getAllProducts,
  getFeaturedProducts: getFeaturedProducts
};
