//JS file for the Home page

import {Product} from './product.js';

let allProducts;

document.addEventListener('DOMContentLoaded', () => {
    const productSearchBar = document.getElementById('product-search');
    const allProductContainer = document.querySelector('.all-products-container');

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

            renderProductCards(products, container);
        })
        .catch(error => console.error('Error fetching products:', error));

    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(products => {
            //select div class product-container
            const container = document.querySelector('.all-products-container');
            if (!container) {
                console.error("Missing .all-products-container in HTML");
                return;
            }
            console.log('Received products:', products);

            allProducts = products;

            renderProductCards(products, container)
        })
        .catch(error => console.error('Error fetching products:', error));

    //search bar filtering
    productSearchBar.addEventListener('input', (e) =>{
        const inputs = e.target.value.trim().toLowerCase();
        const filteredProducts = allProducts.filter(p=>{
            return(
                p.Name.toLowerCase().includes(inputs) ||
                p.Category.toLowerCase().includes(inputs) ||
                p.Brand.toLowerCase().includes(inputs)
            );
        });
        allProductContainer.innerHTML = '';

        renderProductCards(filteredProducts, allProductContainer);
        console.log("Search term:", inputs);
        console.log("filtered:", filteredProducts);
    })
});

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    const username = sessionStorage.getItem('username');
    
    if (isLoggedIn === 'true' && username) {
        //replace login button with account image
        const loginSection = document.getElementById('login-section');
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

//create product cards based on returned data
function renderProductCards(products, container){
    const productsCount = document.getElementById('results');
    productsCount.innerHTML=`
        Showing ${products.length} results
    `

    products.forEach(p => {
        const product = new Product(p);
        const card = product.renderCard();
        container.appendChild(card);
    });
}
