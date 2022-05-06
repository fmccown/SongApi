// db.js
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/musicdb", 
   { useNewUrlParser: true });
module.exports = mongoose;