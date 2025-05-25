// JS file for the Home page

import { Product } from './product.js';

let allProducts;

document.addEventListener('DOMContentLoaded', () => {
  const productSearchBar = document.getElementById('product-search');
  const allProductContainer = document.querySelector('.all-products-container');

  // Fetch featured products
  fetch('http://localhost:3000/api/products/featured')
    .then(response => response.json())
    .then(products => {
      const container = document.querySelector('.product-container');
      if (!container) {
        console.error("Missing .product-container in HTML");
        return;
      }
      renderProductCards(products, container);
    })
    .catch(error => console.error('Error fetching featured products:', error));

  // Fetch all products
  fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(products => {
      const container = document.querySelector('.all-products-container');
      if (!container) {
        console.error("Missing .all-products-container in HTML");
        return;
      }
      allProducts = products;
      renderProductCards(products, container);
    })
    .catch(error => console.error('Error fetching all products:', error));

  // Product search filtering
  productSearchBar?.addEventListener('input', (e) => {
    const input = e.target.value.trim().toLowerCase();
    const filtered = allProducts.filter(p =>
      p.Name.toLowerCase().includes(input) ||
      p.Category.toLowerCase().includes(input) ||
      p.Brand.toLowerCase().includes(input)
    );
    allProductContainer.innerHTML = '';
    renderProductCards(filtered, allProductContainer);
  });

  // AWE logo always redirects to home.html
  const logoLink = document.getElementById('logo-link');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'home.html';
    });
  }

  // Display logged-in user UI
  const isLoggedIn = sessionStorage.getItem('loggedIn');
  const username = sessionStorage.getItem('username');

  if (isLoggedIn === 'true' && username) {
    const loginSection = document.getElementById('login-section');
    loginSection.innerHTML = `
      <div style="display: flex; align-items: center;">
        <a href="user.html">
          <img src="assets/account.png" alt="Account" style="height: 48px; width: auto; cursor: pointer;" />
        </a>
        <span style="color: rgb(232, 208, 51); margin-left: 8px;">${username}</span>
        <a href="#" id="logout-button" style="margin-left: 10px; color: rgb(232, 208, 51); font-size: 16px;">(Logout)</a>
      </div>
    `;

    document.getElementById('logout-button').addEventListener('click', function (e) {
      e.preventDefault();
      sessionStorage.removeItem('loggedIn');
      sessionStorage.removeItem('username');
      window.location.reload();
    });
  }
});

function renderProductCards(products, container) {
  const results = document.getElementById('results');
  if (results) results.textContent = `Showing ${products.length} results`;

  products.forEach(p => {
    const product = new Product(p);
    container.appendChild(product.renderCard());
  });
}
