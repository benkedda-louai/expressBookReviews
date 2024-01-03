const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const user = req.body;
    const findUser = users.find((x)=>x.username === user.username)
    if(findUser) {
        res.status(400).send("user already exist") ;
        return
    }
    users.push(user)
    res.status(200).send("user created successfully")
  return res.status(300).json({message: "Yet to be implemented"});
});
//
public_users.get("/register", (req,res) => {
  if(users.length == 0) {
    res.status(404).send("No Users Found")
    return
  }
  res.status(200).send(users)
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const booksString = JSON.stringify(books, null, 2);
  return res.send(`List of books available:\n${booksString}`);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const bookIsbn = req.params.isbn;
  return res.status(200).send(books[bookIsbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  return res.status(200).json(books[author]);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title=req.params.title
  return res.status(200).send(books[title])
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  return res.status(200).send(books[isbn].reviews)
});

module.exports.general = public_users;
