const express = require('express');
const fs = require('fs');
const path = require('path');

const userRouters = require('./users');
const productsRouters = require('./products');

const routers = express.Router();

//file name with path dynamically
const logDir = path.join(__dirname, '../logs');
const logfile = path.join(logDir, 'error.txt');

//Middleware for all routes -> Authentication
routers.use((req, res, next) => {
    console.log('Request received');
    let content = 'Request received';
    const today = new Date();
  
    // const logTime = today.getDate()+'-'+today.getMonth()+'-'+today.getFullYear();
    // const logtimestamp = logTime +' ' + today.getHours() + ':'+today.getMinutes()+':' + today.getSeconds();
    // content = logtimestamp +'  :'+ content;

    //file append evry time API is hit
    fs.appendFile(logfile, content, err => {
        if(err) {
            console.error(err);
        }
    });
    next();
});

// Middleware for error handling or logging
routers.use((err, req, res, next) => {
    res.status(500).send('Something went wrong!');
});
// api/users
routers.use('/users', userRouters); //Routes for Users module
// api/products
routers.use('/products', productsRouters); //routes for products module

module.exports = routers;