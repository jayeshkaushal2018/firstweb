const mongoose = require('mongoose');
//  var conn = require('../config/db');

// mongoose.connect('mongodb://localhost:27017/sessionLogin', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true
// }).then(con=>{
//     console.log("connected DB")
// }).catch(error=>{
//     console.log("error",error);
// })

var userSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
    address: String
});

// let users = con.model('users', userSchema);
module.exports = mongoose.model('users',userSchema);
