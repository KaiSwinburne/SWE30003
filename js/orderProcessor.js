const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const ordersFile = path.join(__dirname, '../database/orders.csv');

if (!fs.existsSync(ordersFile)) {
  fs.mkdirSync(path.dirname(ordersFile), { recursive: true });
  fs.writeFileSync(ordersFile, 'username,id,name,email,address,cardName,cardNumber,cardExpiry,cardCVV,total,items,timestamp\n');
}

function createOrder(data, callback) {
  const username = data.username;
  const name = data.name;
  const email = data.email;
  const address = data.address;
  const cardName = data.cardName;
  const cardNumber = data.cardNumber;
  const cardExpiry = data.cardExpiry;
  const cardCVV = data.cardCVV;
  const cartItems = data.cartItems;
  const total = data.total;

  if (!cartItems || cartItems.length === 0) {
    return callback({ success: false, message: 'Cart is empty' });
  }

  fs.readFile(ordersFile, 'utf-8', function (err, content) {
    let orderId = 1;
    if (!err) {
      const lines = content.trim().split('\n');
      for (let i = lines.length - 1; i >= 1; i--) {
        const columns = lines[i].trim().split(',');
        const lastId = parseInt(columns[1]);
        if (!isNaN(lastId)) {
          orderId = lastId + 1;
          break;
        }
      }
    }

    const itemList = cartItems.map(function (item) {
      return item.name + ' (x' + item.quantity + ')';
    }).join('; ');

    const time = new Date().toISOString();

    const row = [
      username,
      orderId,
      '"' + name + '"',
      '"' + email + '"',
      '"' + address + '"',
      cardName,
      cardNumber,
      cardExpiry,
      cardCVV,
      total,
      '"' + itemList + '"',
      time
    ].join(',') + '\n';

    fs.appendFile(ordersFile, row, function (err) {
      if (err) {
        return callback({ success: false, message: 'Failed to save order' });
      }
      callback({ success: true, message: 'Order placed successfully' });
    });
  });
}

function getOrdersByUser(username, callback) {
  const userOrders = [];

  fs.createReadStream(ordersFile)
    .pipe(csv())
    .on('data', function (row) {
      if (row.username && row.username.toLowerCase() === username.toLowerCase()) {
        userOrders.push(row);
      }
    })
    .on('end', function () {
      callback(userOrders);
    })
    .on('error', function () {
      callback([]);
    });
}

module.exports = {
  createOrder: createOrder,
  getOrdersByUser: getOrdersByUser
};
