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

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    const username = sessionStorage.getItem('username');
    
    if (isLoggedIn === 'true' && username) {
        // User is logged in, replace login button with account image
        const loginSection = document.getElementById('login-section');
        
        // Create account section with image and username
        loginSection.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="assets/account.png" alt="Account" style="height: 48px; width: auto;">
                <span style="color: rgb(232, 208, 51); margin-left: 8px;">${username}</span>
                <a href="#" id="logout-button" style="margin-left: 10px; color: rgb(232, 208, 51); font-size: 16px;">(Logout)</a>
            </div>
        `;
        
        // Add logout functionality
        document.getElementById('logout-button').addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('loggedIn');
            sessionStorage.removeItem('username');
            window.location.reload();
        });
    }
});