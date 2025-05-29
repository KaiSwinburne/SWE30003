import { getCart, getCartTotal } from './cartManager.js';

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

      document.getElementById('logout-button').addEventListener('click', function (e) {
        e.preventDefault();
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
        window.location.reload();
      });
    }
  }

  const orderItemsContainer = document.getElementById('order-items');
  const orderTotalEl = document.getElementById('order-total');
  const cart = getCart();

  if (cart.length === 0) {
    orderItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    orderTotalEl.textContent = '0.00';
    return;
  }

  cart.forEach(function (item) {
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

  function displayError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function applyInputLimiters() {
    const cardNumberInput = document.getElementById('card-number');
    cardNumberInput.addEventListener('input', function () {
      cardNumberInput.value = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
    });

    const cardExpiryInput = document.getElementById('card-expiry');
    cardExpiryInput.addEventListener('input', function () {
      var v = cardExpiryInput.value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 3) {
        v = v.slice(0, 2) + '/' + v.slice(2);
      }
      cardExpiryInput.value = v;
    });

    const cardCvvInput = document.getElementById('card-cvv');
    cardCvvInput.addEventListener('input', function () {
      cardCvvInput.value = cardCvvInput.value.replace(/\D/g, '').slice(0, 4);
    });

    const zipInput = document.getElementById('shipping-zip-postal');
    zipInput.addEventListener('input', function () {
      zipInput.value = zipInput.value.replace(/\D/g, '').slice(0, 4);
    });

    const phoneInput = document.getElementById('shipping-phone');
    phoneInput.addEventListener('input', function () {
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    });
  }

  function validateForm() {
    var isValid = true;
    var errorElements = document.querySelectorAll('.error-message');

    errorElements.forEach(function (el) {
      el.textContent = '';
    });

    var cardName = document.getElementById('card-name').value.trim();
    if (cardName === '') {
      displayError('card-name', 'Name on card is required.');
      isValid = false;
    }

    var cardNumber = document.getElementById('card-number').value.trim();
    if (cardNumber === '') {
      displayError('card-number', 'Card number is required.');
      isValid = false;
    } else if (!/^\d{16}$/.test(cardNumber)) {
      displayError('card-number', 'Invalid card number (must be 16 digits).');
      isValid = false;
    }

    var cardExpiry = document.getElementById('card-expiry').value.trim();
    if (cardExpiry === '') {
      displayError('card-expiry', 'Expiry date is required.');
      isValid = false;
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      displayError('card-expiry', 'Invalid expiry date (MM/YY format).');
      isValid = false;
    } else {
      var parts = cardExpiry.split('/');
      var month = parseInt(parts[0], 10);
      var year = parseInt(parts[1], 10);
      var now = new Date();
      var currentYear = now.getFullYear() % 100;
      var currentMonth = now.getMonth() + 1;
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        displayError('card-expiry', 'Card has expired.');
        isValid = false;
      }
    }

    var cardCvv = document.getElementById('card-cvv').value.trim();
    if (cardCvv === '') {
      displayError('card-cvv', 'CVV is required.');
      isValid = false;
    } else if (!/^\d{3,4}$/.test(cardCvv)) {
      displayError('card-cvv', 'Invalid CVV (3 or 4 digits).');
      isValid = false;
    }

    var shippingCountry = document.getElementById('shipping-country').value.trim();
    if (shippingCountry === '') {
      displayError('shipping-country', 'Country is required.');
      isValid = false;
    }

    var address1 = document.getElementById('shipping-address-1').value.trim();
    if (address1 === '') {
      displayError('shipping-address-1', 'Primary address is required.');
      isValid = false;
    }

    var shippingFirstName = document.getElementById('shipping-first-name').value.trim();
    if (shippingFirstName === '') {
      displayError('shipping-first-name', 'First name is required.');
      isValid = false;
    }

    var city = document.getElementById('shipping-city').value.trim();
    if (city === '') {
      displayError('shipping-city', 'City is required.');
      isValid = false;
    }

    var state = document.getElementById('shipping-state-province').value.trim();
    if (state === '') {
      displayError('shipping-state-province', 'State/Province is required.');
      isValid = false;
    }

    var shippingZipPostal = document.getElementById('shipping-zip-postal').value.trim();
    if (shippingZipPostal === '') {
      displayError('shipping-zip-postal', 'Zip/Postal Code is required.');
      isValid = false;
    } else if (!/^\d{4}$/.test(shippingZipPostal)) {
      displayError('shipping-zip-postal', 'Invalid Zip/Postal Code (e.g., 3000).');
      isValid = false;
    }

    var shippingPhone = document.getElementById('shipping-phone').value.trim();
    if (shippingPhone !== '' && !/^\d{10}$/.test(shippingPhone)) {
      displayError('shipping-phone', 'Invalid Phone Number (e.g., 04XXXXXXXX).');
      isValid = false;
    }

    return isValid;
  }

  checkoutForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Form validation failed.');
      return;
    }

    var orderData = {
      name: document.getElementById('shipping-first-name').value + ' ' + document.getElementById('shipping-last-name').value,
      email: document.getElementById('shipping-email')?.value || 'none',
      address: document.getElementById('shipping-address-1').value + ', ' +
               document.getElementById('shipping-city').value + ', ' +
               document.getElementById('shipping-state-province').value + ', ' +
               document.getElementById('shipping-country').value,
      cardName: document.getElementById('card-name').value,
      cardNumber: document.getElementById('card-number').value,
      cardExpiry: document.getElementById('card-expiry').value,
      cardCVV: document.getElementById('card-cvv').value,
      cartItems: getCart(),
      total: getCartTotal().toFixed(2)
    };

    fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (data.success) {
        localStorage.removeItem('shopping_cart');
        window.location.href = 'order.html';
      } else {
        alert('Failed to place order. Please try again.');
      }
    }).catch(function (error) {
      alert('An error occurred while placing your order.');
      console.error(error);
    });
  });

  applyInputLimiters();
});
