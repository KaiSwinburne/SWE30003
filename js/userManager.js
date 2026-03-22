const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const usersFilePath = path.join(__dirname, './database/users.csv');

// Get all users from the CSV file
function getAllUsers(callback) {
    
    const users = [];
    fs.createReadStream(usersFilePath)
        .pipe(csv())
        .on('data', (row) => {
            row.id = parseInt(row.id)
            users.push(row);
        })
        .on('end', () => {
            callback(users);
        })
        .on('error', (error) => {
            console.error('Error reading users.csv:', error);
            callback([]);
        });
}

// Check if a username already exists
function usernameExists(username, callback) {
    getAllUsers((users) => {
        const exists = users.some(user => user.username === username);
        callback(exists);
    });
}

// Add a new user to the CSV file
function addUser(username, password, callback) {
    usernameExists(username, (exists) => {
        if (exists) {
            callback({ success: false, message: 'Username already exists' });
            return;
        }

        getAllUsers((users) => {
            const maxID = users.reduce((max, user) => Math.max(max, user.id || 0), 0);
            const currentID = maxID + 1;

            // Add the new user
            users.push({id: currentID, username, password });
            
            // Write back to CSV
            const csvWriter = createObjectCsvWriter({
                path: usersFilePath,
                header: [
                    { id: 'id', title: 'id' },
                    { id: 'username', title: 'username' },
                    { id: 'password', title: 'password' }
                ]
            });
            
            csvWriter.writeRecords(users)
                .then(() => {
                    callback({ success: true, message: 'User registered successfully' });
                })
                .catch(err => {
                    console.error('Error writing to users.csv:', err);
                    callback({ success: false, message: 'Server error while registering user' });
                });
        });
    });
}

// Verify user credentials
function verifyUser(username, password, callback) {
    getAllUsers((users) => {
        const user = users.find(u => u.username === username && u.password === password);
        callback({ success: !!user });
    });
}

module.exports = {
    getAllUsers,
    usernameExists,
    addUser,
    verifyUser
};