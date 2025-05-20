import {
  getCart,
  saveCart,
  removeFromCart,
  updateQuantity,
  getCartTotal
} from './cartManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  const totalEl = document.getElementById('cart-total');

  // Preload sample cart if empty
  function preloadSampleCart() {
    const existingCart = getCart();
    if (existingCart.length === 0) {
      const sampleCart = [
        {
          id: 'mac-001',
          name: 'MacBook Pro',
          price: 2499.99,
          quantity: 1,
          imageURL: 'macbook-pro.jpg'
        },
        {
          id: 'airpods-001',
          name: 'AirPods Pro',
          price: 249.99,
          quantity: 2,
          imageURL: 'airpods-pro.jpg'
        }
      ];
      saveCart(sampleCart);
    }
  }

  function renderCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      totalEl.textContent = '0.00';
      return;
    }

    cart.forEach(item => {
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

  cartItemsContainer.addEventListener('input', e => {
    if (e.target.type === 'number') {
      const id = e.target.getAttribute('data-id');
      const qty = parseInt(e.target.value);
      if (qty >= 1) updateQuantity(id, qty);
      renderCart();
    }
  });

  cartItemsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('remove-btn')) {
      const id = e.target.getAttribute('data-id');
      removeFromCart(id);
      renderCart();
    }
  });

  preloadSampleCart();
  renderCart();
});
