// // full name // email // mobile // city
// //schme
// const mongoose = require('mongoose');

// var leadlistSchema = new mongoose.Schema({
//     cust_name: {
//         type: String,
//         reqired: 'this filed is required'
//     },
//     contact: {
//         type: String
//     },
//     enquiry: {
//         type: String
//     },
//     action: {
//         type: String
//     },
//     assigned_emp: {
//         type: String
//     },
//     assigned_Id: {
//         type: String
//     },
//     status: {
//         type: String
//     }
// })

// module.exports = mongoose.model('Leadlist', leadlistSchema);







// full name // email // mobile // city
//schme
const mongoose = require('mongoose');

var leadlistSchema = new mongoose.Schema({
    cust_name: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    econtact: {
        type: String
    },
    email: {
        type: String
    },
    city: {
        type: String
    },
    when_needed: {
        type: String
    },
    budget: {
        type: String
    },
    enqiury: {
        type: String
    },
    service: {
        type: String
    },
    room_type: {
        type: String
    },
    no_room: {
        type: String
    },
    pro_status: {
        type: String
    },
    pro_type: {
        type: String
    },
    property_status: {
        type: String
    },
    follow_last: {
        type: Date
    },
    follow_next: {
        type: Date
    },
    customer_property: {
        type: String
    },
    service_wanted: {
        type: Date
    },
    project_status: {
        type: String
    },
    emplyee_working: {
        type: Array
    },
    follow_next_person: {
        type: Array
    },
    follow_last_person:{
        type:Array
    }


})

module.exports = mongoose.model('Leadlists', leadlistSchema);