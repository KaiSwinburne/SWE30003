import {
  getCart,
  saveCart,
  removeFromCart,
  updateQuantity,
  getCartTotal
} from './cartManager.js';

document.addEventListener('DOMContentLoaded', function () {

  const isLoggedIn = sessionStorage.getItem('loggedIn');
  const username = sessionStorage.getItem('username');

  if (isLoggedIn === 'true' && username) {
    const loginSection = document.getElementById('login-section');

    if (loginSection) {
      loginSection.innerHTML = `
        <div style="display: flex; align-items: center;">
          <img src="assets/account.png" alt="Account" style="height: 48px; width: auto;">
          <span style="color: rgb(232, 208, 51); margin-left: 8px;">${username}</span>
          <a href="#" id="logout-button" style="margin-left: 10px; color: rgb(232, 208, 51); font-size: 16px;">(Logout)</a>
        </div>
      `;

      document.getElementById('logout-button').addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
        window.location.reload();
      });
    }
  }


  const cartItemsContainer = document.querySelector('.cart-items');
  const totalEl = document.getElementById('cart-total');

  function renderCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      totalEl.textContent = '0.00';
      return;
    }

    cart.forEach(function (item) {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="assets/${item.imageURL}" alt="${item.name}" class="cart-img" />
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>Price: $${item.price.toFixed(2)}</p>
          <label>
            Qty:
            <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" />
          </label>
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    totalEl.textContent = getCartTotal().toFixed(2);
  }

  cartItemsContainer.addEventListener('input', function (e) {
    if (e.target.type === 'number') {
      const id = e.target.getAttribute('data-id');
      const qty = parseInt(e.target.value);
      if (qty >= 1) updateQuantity(id, qty);
      renderCart();
    }
  });

  cartItemsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-btn')) {
      const id = e.target.getAttribute('data-id');
      removeFromCart(id);
      renderCart();
    }
  });

  const clearCartBtn = document.createElement('button');
  clearCartBtn.id = 'clear-cart-btn';
  clearCartBtn.classList.add('clear-cart-btn');
  clearCartBtn.textContent = 'Clear Cart';

  clearCartBtn.addEventListener('click', function () {
    saveCart([]);
    renderCart();
  });

  const cartSummary = document.querySelector('.cart-summary');
  cartSummary.appendChild(clearCartBtn);

  renderCart();
});
