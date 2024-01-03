const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = '123'
let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post('/customer/login', (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(400).json({ message: 'Invalid username' });
  }

  // Authenticate the user
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // User is authenticated, create a JWT token
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

  // Send the token in the response
  return res.status(200).json({ token });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { username, review } = req.body;

  // Check if the user is authenticated
  if (!isValid(username)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Add the review to the book
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: 'Review added successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
