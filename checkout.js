// checkout.js

document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartDiv = document.getElementById('cart-summary');

  if (cart.length === 0) {
    cartDiv.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    const list = cart.map(item =>
      `<li>${item.name} (x${item.quantity}) — $${item.price}</li>`
    ).join('');
    cartDiv.innerHTML = `<ul>${list}</ul>`;
  }
});

document.getElementById('checkout-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const email = document.getElementById('email').value;
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const order = {
    name,
    address,
    email,
    cartItems: cart
  };

  const response = await fetch('http://localhost:3000/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });

  const data = await response.json();
  alert(data.message);

  // Clear cart and redirect
  localStorage.removeItem('cart');
  
});
