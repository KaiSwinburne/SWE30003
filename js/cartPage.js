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

  // Add a clear cart button functionality
  const clearCartBtn = document.createElement('button');
  clearCartBtn.id = 'clear-cart-btn';
  clearCartBtn.textContent = 'Clear Cart';
  clearCartBtn.style.marginTop = '20px';
  clearCartBtn.style.padding = '8px 16px';
  clearCartBtn.style.backgroundColor = '#f44336';
  clearCartBtn.style.color = 'white';
  clearCartBtn.style.border = 'none';
  clearCartBtn.style.borderRadius = '4px';
  clearCartBtn.style.cursor = 'pointer';
  
  clearCartBtn.addEventListener('click', () => {
    saveCart([]);
    renderCart();
  });
  
  // Add the clear button after the cart total
  const cartSummary = document.querySelector('.cart-summary');
  cartSummary.appendChild(clearCartBtn);

  renderCart();
});
