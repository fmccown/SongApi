// db.js
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/musicdb", 
   { useNewUrlParser: true });
module.exports = mongoose;