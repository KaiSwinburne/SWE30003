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

  // Helper function to display error messages
  function displayError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  // Helper function to clear error messages
  function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  // Validation function
  function validateForm() {
    let isValid = true;

    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    // Payment Details Validation
    const cardName = document.getElementById('card-name').value.trim();
    if (cardName === '') {
      displayError('card-name', 'Name on card is required.');
      isValid = false;
    }

    const cardNumber = document.getElementById('card-number').value.trim();
    if (cardNumber === '') {
      displayError('card-number', 'Card number is required.');
      isValid = false;
    } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) { // Basic check for 16 digits
      displayError('card-number', 'Invalid card number (must be 16 digits).');
      isValid = false;
    }

    const cardExpiry = document.getElementById('card-expiry').value.trim();
    if (cardExpiry === '') {
      displayError('card-expiry', 'Expiry date is required.');
      isValid = false;
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) { // MM/YY format
      displayError('card-expiry', 'Invalid expiry date (MM/YY format).');
      isValid = false;
    } else {
      const [month, year] = cardExpiry.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
      const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        displayError('card-expiry', 'Card has expired.');
        isValid = false;
      }
    }

    const cardCvv = document.getElementById('card-cvv').value.trim();
    if (cardCvv === '') {
      displayError('card-cvv', 'CVV is required.');
      isValid = false;
    } else if (!/^\d{3,4}$/.test(cardCvv)) { // 3 or 4 digits
      displayError('card-cvv', 'Invalid CVV (3 or 4 digits).');
      isValid = false;
    }

    // Shipping Address Validation
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
    } else if (!/^\d{4}$/.test(shippingZipPostal)) { // Basic check for 4 digits (common in Australia)
        displayError('shipping-zip-postal', 'Invalid Zip/Postal Code (e.g., 3000).');
        isValid = false;
    }

    // Phone number is optional, but if entered, validate format (basic)
    const shippingPhone = document.getElementById('shipping-phone').value.trim();
    if (shippingPhone !== '' && !/^\d{10}$/.test(shippingPhone.replace(/\s/g, ''))) { // Basic check for 10 digits (common for mobile in Australia)
        displayError('shipping-phone', 'Invalid Phone Number (e.g., 04XXXXXXXX).');
        isValid = false;
    }


    return isValid;
  }

  checkoutForm.addEventListener('submit', e => {
    e.preventDefault(); // Prevent default form submission

    if (validateForm()) {
      // If validation passes, proceed with the order
      localStorage.removeItem('cart');
      window.location.href = 'order.html';
    } else {
      // If validation fails, do nothing (errors are already displayed)
      console.log('Form validation failed.');
    }
  });
});
