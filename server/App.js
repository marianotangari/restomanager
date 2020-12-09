const express = require('express');
const app = express();
const bParser = require('body-parser');
const userRouter = require('./routes/Users');
const productRouter = require('./routes/Products');
const ordersRouter = require('./routes/Orders');

app.listen(5000,  () => {
    console.log("Server Started");
  }
);

app.use(bParser.json(), userRouter, productRouter, ordersRouter);

module.exports = app;



