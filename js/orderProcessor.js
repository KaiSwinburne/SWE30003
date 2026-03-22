//Handles all orders related functions
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');


const orderFilePath = path.join(__dirname, './database/orders.csv');

if (!fs.existsSync(orderFilePath)) {
  fs.mkdirSync(path.dirname(orderFilePath), { recursive: true });
  fs.writeFileSync(orderFilePath, 'id,name,email,address,cardName,cardNumber,cardExpiry,cardCVV,total,items\n');
}

function createOrder(data, callback){
    const {
        name, email, address,
        cardName, cardNumber, cardExpiry, cardCVV,
        cartItems, total
    } = data;

    if (!cartItems || cartItems.length === 0) {
        return callback({ success: false, message: 'Cart is empty' });
    }

    fs.readFile(orderFilePath,'utf-8',(err,data) => {
        let currentID = 1;
        if (!err){
            //get the lines count
            const lines = data.trim().split('\n');

            //start from the end to find a valid line
            for (let i=lines.length - 1; i>=1; i--){
                const line = lines[i].trim();
                if (line){
                    const lineLastID = parseInt(line.split(',')[0]);
                    if (!isNaN(lineLastID)) {
                        currentID = lineLastID + 1; //update ID accordingly
                        break;
                    }
                }
            }
        }
        const itemsStr = cartItems.map(i => `${i.name} (x${i.quantity})`).join('; ');

        const row = `${currentID},${name},${email},${address},${cardName},${cardNumber},${cardExpiry},${cardCVV},${total},"${itemsStr}"\n`;

        fs.appendFile(orderFilePath, row, err => {
            if (err) {
            console.error('Failed to save order:', err);
            return callback({ success: false, message: 'Failed to save order' });
            }

            console.log('[ORDER SAVED]', { name, total, items: itemsStr });
            callback({ success: true, message: 'Order placed successfully' });
        });
    });
}

module.exports = {
    createOrder
};