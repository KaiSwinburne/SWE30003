const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

let productList = [];

// Load product list from CSV and store in memory
function loadProducts() {
  const results = [];
  const filePath = path.resolve(__dirname, '../database/products.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', () => {
      productList = results;
      console.log(productList);
    });
}

loadProducts();

function getAllProducts(callback) {
  callback(productList);
}

function getFeaturedProducts(callback) {
  const featuredProducts = productList.filter(
    product => product.Featured === 'Yes'
  );
  callback(featuredProducts);
}

module.exports = {
  getAllProducts,
  getFeaturedProducts
};
