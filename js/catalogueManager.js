const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

let productList = [];

//load product lists from csv and store in memory
function loadproducts(){
    const results = [];
    const filePath = path.resolve(__dirname, '../database/products.csv');

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data)) // Parse each row of the CSV file
        .on('end', () => {
            productList = results
            console.log(productList);
        })
}

loadproducts();

function getAllProducts(callback) {
    callback(productList);
}

function getFeaturedProducts(callback) {
    const featuredProducts = productList.filter(product => product.Featured === "Yes"); //only yes options
    callback(featuredProducts);
}

module.exports = {
    getAllProducts,
    getFeaturedProducts
};