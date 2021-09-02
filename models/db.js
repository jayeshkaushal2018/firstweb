const mongoose =require('mongoose');

const url = "mongodb://localhost:27017/EmployeeDB";

//connect method of mongoose

mongoose.connect(url,{useNewUrlParser:true,useFindAndModify: false},(err) =>{
    if(!err){
        console.log("MongoDb Connection is successful");
    }
    else{
        //if any error is there

        console.log("An error occured in connecting mongodb" + err);
    }
})

//include the employee model

require('./employee.model');
require('./list.model');