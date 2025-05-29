export const CART_KEY = 'shopping_cart';

export function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(function (item) {
    return item.id === product.ID;
  });

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.ID,
      name: product.Name,
      price: parseFloat(product.Price),
      imageURL: product.imageURLs || 'default.jpg',
      quantity: quantity
    });
  }

  saveCart(cart);
}

export function removeFromCart(productId) {
  const cart = getCart().filter(function (item) {
    return item.id !== productId;
  });
  saveCart(cart);
}

export function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(function (item) {
    return item.id === productId;
  });
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
}

export function getCartTotal() {
  const cart = getCart();
  return cart.reduce(function (total, item) {
    return total + item.price * item.quantity;
  }, 0);
}
