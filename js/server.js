
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getAllProducts, getFeaturedProducts } = require('./catalogueManager');
const { addUser, verifyUser } = require('./userManager');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '..')));
app.use(express.json()); 

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

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});