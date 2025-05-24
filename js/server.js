//handle all server API requests

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { getAllProducts, getFeaturedProducts } = require('./catalogueManager');
const { addUser, verifyUser } = require('./userManager');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '..')));
app.use(express.json()); // Added to parse JSON request body

//for testing API requests
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

app.get('/api/products', (req, res) => {
    getAllProducts((products) => {
        res.json(products);
    });
});

app.get('/api/products/featured', (req, res) => {
    getFeaturedProducts((products) => {
        res.json(products);
    });
});

app.get('/api/product/:id', (req, res) => {
    getAllProducts((products) => {
        const product = products.find(p => p.ID === req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
});

// User registration API endpoint
app.post('/api/users/register', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Username and password are required' 
        });
    }
    
    addUser(username, password, (result) => {
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    });
});

// User login API endpoint
app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Username and password are required' 
        });
    }
    
    verifyUser(username, password, (result) => {
        if (result.success) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    });
});

// Order Submission API

const orderFilePath = path.join(__dirname, '../database/orders.csv');

if (!fs.existsSync(orderFilePath)) {
  fs.mkdirSync(path.dirname(orderFilePath), { recursive: true });
  fs.writeFileSync(orderFilePath, 'name,email,address,cardName,cardNumber,cardExpiry,cardCVV,total,items\n');
}

app.post('/api/order', (req, res) => {
  const {
    name, email, address,
    cardName, cardNumber, cardExpiry, cardCVV,
    cartItems, total
  } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  const itemsStr = cartItems.map(i => `${i.name} (x${i.quantity})`).join('; ');

  const row = `${name},${email},${address},${cardName},${cardNumber},${cardExpiry},${cardCVV},${total},"${itemsStr}"\n`;

  fs.appendFile(orderFilePath, row, err => {
    if (err) {
      console.error('Failed to save order:', err);
      return res.status(500).json({ success: false, message: 'Failed to save order' });
    }

    console.log('[ORDER SAVED]', { name, total, items: itemsStr });
    res.json({ success: true, message: 'Order placed successfully' });
  });
});

//testing
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});