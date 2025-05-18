//handle all server API requests

const express = require('express');
const cors = require('cors');
const path = require('path');
const { getAllProducts, getFeaturedProducts } = require('./catalogueManager');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '..')));

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

//testing
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});