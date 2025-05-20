import { getCart, getCartTotal } from './cartManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const orderItemsContainer = document.getElementById('order-items');
  const orderTotalEl = document.getElementById('order-total');
  const cart = getCart();

  if (cart.length === 0) {
    orderItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    orderTotalEl.textContent = '0.00';
    return;
  }

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.classList.add('cart-item');
    itemEl.innerHTML = `
      <img src="assets/${item.imageURL}" alt="${item.name}" class="cart-img" />
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>Qty: ${item.quantity}</p>
        <p>Price: $${item.price.toFixed(2)}</p>
      </div>
    `;
    orderItemsContainer.appendChild(itemEl);
  });

  orderTotalEl.textContent = getCartTotal().toFixed(2);

  const checkoutForm = document.getElementById('checkout-form');

  checkoutForm.addEventListener('submit', e => {
    e.preventDefault();
    localStorage.removeItem('cart');
    window.location.href = 'order.html';
  });
});
