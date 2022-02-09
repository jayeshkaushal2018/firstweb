// full name // email // mobile // city
//schme
const mongoose = require('mongoose');


var transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    },
    currtBalanceDebit:{
        type: Number,
    },
    currtBalancecredit:{
        type: Number,
    },
    updateBalance:{
        type:Number,
    },
    updateBalanceDebit:{
        type:Number,
    },
    updateBalancecredit:{
        type:Number,
    },
    typeTransaction:{
        type:String
    },
    debitFrom:{
        type:String
    },
    debiterName:{
        type:String
    },
    crediterName:{
        type:String
    },
    creditTo:{
        type:String
    },
    amount:{
        type: Number
    }
   
})

module.exports = mongoose.model('Transaction', transactionSchema);