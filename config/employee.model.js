// full name // email // mobile // city
//schme
const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    fullName: {
        type: String
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
    empid:{
        type: String
    }
})

mongoose.model('Employee',employeeSchema);