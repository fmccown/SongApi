// db.js
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/musicdb");
module.exports = mongoose;