const express = require('express');
const ExpressError = require('./expressError');
const itemsRoutes = require('./routes/items');
const app = express()

app.use(express.json());
app.use('/items', itemsRoutes);

// Error handlers
//404
app.use(function(req, res, next) {
  return new ExpressError("Not Found", 404);
});

//Generic
app.use(function(err, req, res, next) {
  
  let status = err.status || 500;

  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});

module.exports = app;