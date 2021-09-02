const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/EmployeeDB";
mongoose.connect(url,{useNewUrlParser:true,useFindAndModify: false },(err)=>{
    if(!err){
        console.log("MongoDB Connection is succesful");
    }
    else{
        console.log("An error occured in connecting mongodb" + err);
    }
});


//include the employee model

require('./employee.model');