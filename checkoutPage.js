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

  function displayError(id, message) {
    const err = document.getElementById(`${id}-error`);
    if (err) err.textContent = message;
  }

  function validateForm() {
    let isValid = true;
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    const fields = ['card-name', 'card-number', 'card-expiry', 'card-cvv',
                    'shipping-country', 'shipping-first-name', 'shipping-last-name',
                    'shipping-address-1', 'shipping-city', 'shipping-state-province', 'shipping-zip-postal'];

    fields.forEach(id => {
      const value = document.getElementById(id)?.value.trim();
      if (!value) {
        displayError(id, 'This field is required.');
        isValid = false;
      }
    });

    return isValid;
  }

  checkoutForm.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Form validation failed.');
      return;
    }

    const orderData = {
      name: document.getElementById('shipping-first-name').value + ' ' + document.getElementById('shipping-last-name').value,
      email: document.getElementById('shipping-email')?.value || 'none',
      address: `${document.getElementById('shipping-address-1').value}, ${document.getElementById('shipping-city').value}, ${document.getElementById('shipping-state-province').value}, ${document.getElementById('shipping-country').value}`,
      cardName: document.getElementById('card-name').value,
      cardNumber: document.getElementById('card-number').value,
      cardExpiry: document.getElementById('card-expiry').value,
      cardCVV: document.getElementById('card-cvv').value,
      cartItems: getCart(),
      total: getCartTotal().toFixed(2)
    };

    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();
    if (data.success) {
      localStorage.removeItem('shopping_cart');
      window.location.href = 'order.html';
    } else {
      alert('Failed to place order. Please try again.');
    }
  });
});
