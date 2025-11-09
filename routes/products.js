const express = require('express');

const productsRouters = express.Router();

productsRouters.get('/', (req, res) => {
     res.send('Product list');
});

module.exports = productsRouters;