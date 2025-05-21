//JS file for the Home page

import {Product} from './product.js';

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/products/featured')
        .then(response => response.json())
        .then(products => {
            //select div class product-container
            const container = document.querySelector('.product-container');
            if (!container) {
                console.error("Missing .product-container in HTML");
                return;
            }

            console.log('Received products:', products);

            //create product cards based on returened data
            products.forEach(p => {
                const product = new Product(p);
                const card = product.renderCard();
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});