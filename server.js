// server.js
const morgan = require('morgan');
const express = require('express');
 
const app = express();

// Middleware that parses HTTP requests with JSON body
app.use(express.json());
 
// Shows HTTP requests in the console
app.use(morgan('dev'));
  
// Implement CORS to allow requests from any origin
app.use("/api/songs", function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

// Create endpoint http://localhost:8000/api/students
app.use("/api/songs", require("./api/songs"));

app.use(express.static("public"));

const port = 8000;
app.listen(port, () => console.log(`Server listening on port ${port}`));

// Export for testing
module.exports = app;