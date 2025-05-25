const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const orderFilePath = path.join(__dirname, '../database/orders.csv');

// Ensure CSV exists with correct header
if (!fs.existsSync(orderFilePath)) {
  fs.mkdirSync(path.dirname(orderFilePath), { recursive: true });
  fs.writeFileSync(orderFilePath, 'username,id,name,email,address,cardName,cardNumber,cardExpiry,cardCVV,total,items,timestamp\n');
}

function createOrder(data, callback) {
  const {
    username,
    name, email, address,
    cardName, cardNumber, cardExpiry, cardCVV,
    cartItems, total
  } = data;

  if (!cartItems || cartItems.length === 0) {
    return callback({ success: false, message: 'Cart is empty' });
  }

  fs.readFile(orderFilePath, 'utf-8', (err, fileData) => {
    let currentID = 1;
    if (!err) {
      const lines = fileData.trim().split('\n');
      for (let i = lines.length - 1; i >= 1; i--) {
        const line = lines[i].trim();
        if (line) {
          const lineLastID = parseInt(line.split(',')[1]);
          if (!isNaN(lineLastID)) {
            currentID = lineLastID + 1;
            break;
          }
        }
      }
    }

    const itemsStr = cartItems.map(i => `${i.name} (x${i.quantity})`).join('; ');
    const timestamp = new Date().toISOString();

    const row = [
      username,
      currentID,
      `"${name}"`,
      `"${email}"`,
      `"${address}"`,
      cardName,
      cardNumber,
      cardExpiry,
      cardCVV,
      total,
      `"${itemsStr}"`,
      timestamp
    ].join(',') + '\n';

    fs.appendFile(orderFilePath, row, err => {
      if (err) {
        return callback({ success: false, message: 'Failed to save order' });
      }
      callback({ success: true, message: 'Order placed successfully' });
    });
  });
}

function getOrdersByUser(username, callback) {
  const orders = [];

  fs.createReadStream(orderFilePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.username && row.username.toLowerCase() === username.toLowerCase()) {
        orders.push(row);
      }
    })
    .on('end', () => callback(orders))
    .on('error', (err) => {
      console.error('Error reading orders:', err);
      callback([]);
    });
}

module.exports = {
  createOrder,
  getOrdersByUser
};
