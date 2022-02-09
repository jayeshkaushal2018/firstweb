// full name // email // mobile // city
//schme
const mongoose = require('mongoose');


var venderSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    mobile:{
        type: String,
    },
    email:{
        type:String,
    },
    city:{
        type:String,
    },
    state:{
        type:String,
    },
    gstNo:{
        type: String,
    },
    firmName:{
        type: String,
    },
    bankDetail:{
        type: String,
    },
    venderType:{
        type: String,
    },
    remark:{
        type: String,
    },
    referenceBy:{
        type: String,
    }

})

module.exports = mongoose.model('Vender', venderSchema);