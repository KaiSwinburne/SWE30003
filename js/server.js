const express = require('express');
const cors = require('cors');
const path = require('path');
const { getAllProducts, getFeaturedProducts } = require('./catalogueManager');
const { addUser, verifyUser } = require('./userManager');
const { createOrder, getOrdersByUser } = require('./orderProcessor');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '..')));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

app.get('/api/products', (req, res) => {
  getAllProducts(products => res.json(products));
});

app.get('/api/products/featured', (req, res) => {
  getFeaturedProducts(products => res.json(products));
});

app.get('/api/product/:id', (req, res) => {
  getAllProducts(products => {
    const product = products.find(p => p.ID === req.params.id);
    product ? res.json(product) : res.status(404).json({ error: 'Product not found' });
  });
});

app.post('/api/users/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required' });
  addUser(username, password, result => {
    result.success ? res.status(201).json(result) : res.status(400).json(result);
  });
});

app.post('/api/users/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required' });
  verifyUser(username, password, result => {
    result.success ? res.json({ success: true, message: 'Login successful' }) : res.status(401).json({ success: false, message: 'Invalid username or password' });
  });
});

app.post('/api/order', (req, res) => {
  createOrder(req.body, result => {
    result.success ? res.json(result) : res.status(400).json(result);
  });
});

app.get('/api/orders/:username', (req, res) => {
  getOrdersByUser(req.params.username, orders => res.json(orders));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
