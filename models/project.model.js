const mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    cust_name: {
        type: String
    },

    contact: {
        type: String
    },

    assign_emp: {
        type: String
    },
    enquiry: {
        type: String
    },
    email: {
        type: String
    },
    status: {
        type: String
    }



})

module.exports = mongoose.model('projects', ProjectSchema);