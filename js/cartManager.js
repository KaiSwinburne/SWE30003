export const CART_KEY = 'shopping_cart';

// Retrieve cart from localStorage
export function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add item to cart
export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.ID);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.ID,
      name: product.Name,
      price: parseFloat(product.Price),
      imageURL: product.imageURLs || 'default.jpg',
      quantity
    });
  }

  saveCart(cart);
}

// Remove item from cart
export function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

// Update item quantity
export function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
}

// Get total price of all items in cart
export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
