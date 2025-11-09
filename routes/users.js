const express = require('express');
const userRouters = express.Router();

userRouters.get('/', (req, res) => {
     res.send('User list');
});

module.exports = userRouters;