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

      document.getElementById('logout-button').addEventListener('click', function(e) {
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

  function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + '-error');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  function applyInputLimiters() {
    const cardNumberInput = document.getElementById('card-number');
    cardNumberInput.addEventListener('input', function () {
      cardNumberInput.value = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
    });

    const cardExpiryInput = document.getElementById('card-expiry');
    cardExpiryInput.addEventListener('input', function () {
      let v = cardExpiryInput.value.replace(/\D/g, '').slice(0, 4);
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
    let isValid = true;
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(function (el) {
      el.textContent = '';
    });

    const cardName = document.getElementById('card-name').value.trim();
    if (cardName === '') {
      displayError('card-name', 'Name on card is required.');
      isValid = false;
    }

    const cardNumber = document.getElementById('card-number').value.trim();
    if (cardNumber === '') {
      displayError('card-number', 'Card number is required.');
      isValid = false;
    } else if (!/^\d{16}$/.test(cardNumber)) {
      displayError('card-number', 'Invalid card number (must be 16 digits).');
      isValid = false;
    }

    const cardExpiry = document.getElementById('card-expiry').value.trim();
    if (cardExpiry === '') {
      displayError('card-expiry', 'Expiry date is required.');
      isValid = false;
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      displayError('card-expiry', 'Invalid expiry date (MM/YY format).');
      isValid = false;
    } else {
      const parts = cardExpiry.split('/');
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        displayError('card-expiry', 'Card has expired.');
        isValid = false;
      }
    }

    const cardCvv = document.getElementById('card-cvv').value.trim();
    if (cardCvv === '') {
      displayError('card-cvv', 'CVV is required.');
      isValid = false;
    } else if (!/^\d{3,4}$/.test(cardCvv)) {
      displayError('card-cvv', 'Invalid CVV (3 or 4 digits).');
      isValid = false;
    }

    const shippingCountry = document.getElementById('shipping-country').value.trim();
    if (shippingCountry === '') {
      displayError('shipping-country', 'Country is required.');
      isValid = false;
    }

    const shippingFirstName = document.getElementById('shipping-first-name').value.trim();
    if (shippingFirstName === '') {
      displayError('shipping-first-name', 'First name is required.');
      isValid = false;
    }

    const shippingLastName = document.getElementById('shipping-last-name').value.trim();
    if (shippingLastName === '') {
      displayError('shipping-last-name', 'Last name is required.');
      isValid = false;
    }

    const shippingAddress1 = document.getElementById('shipping-address-1').value.trim();
    if (shippingAddress1 === '') {
      displayError('shipping-address-1', 'Address Line 1 is required.');
      isValid = false;
    }

    const shippingCity = document.getElementById('shipping-city').value.trim();
    if (shippingCity === '') {
      displayError('shipping-city', 'City is required.');
      isValid = false;
    }

    const shippingStateProvince = document.getElementById('shipping-state-province').value.trim();
    if (shippingStateProvince === '') {
      displayError('shipping-state-province', 'State/Province is required.');
      isValid = false;
    }

    const shippingZipPostal = document.getElementById('shipping-zip-postal').value.trim();
    if (shippingZipPostal === '') {
      displayError('shipping-zip-postal', 'Zip/Postal Code is required.');
      isValid = false;
    } else if (!/^\d{4}$/.test(shippingZipPostal)) {
      displayError('shipping-zip-postal', 'Invalid Zip/Postal Code (e.g., 3000).');
      isValid = false;
    }

    const shippingPhone = document.getElementById('shipping-phone').value.trim();
    if (shippingPhone !== '' && !/^\d{10}$/.test(shippingPhone)) {
      displayError('shipping-phone', 'Invalid Phone Number (e.g., 04XXXXXXXX).');
      isValid = false;
    }

    return isValid;
  }

  function handleCheckoutSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      localStorage.removeItem('cart');
      window.location.href = 'order.html';
    } else {
      console.log('Form validation failed.');
    }
  }

  applyInputLimiters();
  checkoutForm.addEventListener('submit', handleCheckoutSubmit);
});
