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

app.use(function(req, res, next) {
  console.log('[REQUEST] ' + req.method + ' ' + req.url);
  next();
});

app.get('/api/products', function(req, res) {
  getAllProducts(function(products) {
    res.json(products);
  });
});

app.get('/api/products/featured', function(req, res) {
  getFeaturedProducts(function(products) {
    res.json(products);
  });
});

app.get('/api/product/:id', function(req, res) {
  getAllProducts(function(products) {
    const product = products.find(function(p) {
      return p.ID === req.params.id;
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });
});

app.post('/api/users/register', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }
  addUser(username, password, function(result) {
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  });
});

app.post('/api/users/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }
  verifyUser(username, password, function(result) {
    if (result.success) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  });
});

app.post('/api/order', function(req, res) {
  createOrder(req.body, function(result) {
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  });
});

app.get('/api/orders/:username', function(req, res) {
  getOrdersByUser(req.params.username, function(orders) {
    res.json(orders);
  });
});

app.listen(PORT, function() {
  console.log('Server running at http://localhost:' + PORT);
});
