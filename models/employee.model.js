// full name // email // mobile // city
//schme
const mongoose = require('mongoose');
var validator = require("email-validator");

var employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    fullName: {
        type: String,
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    city: {
        type: String
    },
    date_of_join: {
        type: String
    },
    econtact: {
        type: String
    },
    image: {
        data: Buffer, 
        contentType: String
    }
})

module.exports = mongoose.model('Employees', employeeSchema);