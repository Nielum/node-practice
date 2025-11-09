const express = require('express'); // get express module

const routers = require('./routes'); // custome routes

const app = express(); // create app of project using express module

app.use('/api', routers); // app have api routes set

app.listen(3001, () => {  // app to be listen to 3001 PORT can be changed
    console.log('Server is runinng!')
});