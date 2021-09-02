const express = require('express');

const mongoose = require('mongoose');

const Employee = mongoose.model('Employee');
// const Leadlist = require('./models/list.model');


//include the model class

const router = express.Router();

router.get('/', (req, res) => {
    res.render('employee/addOrEdit.hbs', {
        viewTitle: 'Insert Employee'
    })
})


//handle the post request

router.post('/', (req, res) => {
    //create a customer function
    if (req.body._id == "") {
        insertRecord(req, res);
    }
    else{
        updateRecord(req,res);
    }
})

function updateRecord(req,res){
    Employee.findOneAndUpdate({_di:req.body._id},req.body,{new:true},(err,doc)=>{
        if(!err){
            res.redirect('employee/list');

        }
    });
}
// router.get('/:id',(req,res) =>{
//     Employee.findById(req,this.param.id,(err,doc)=>{
//         if(!err){
//             res.render('employee/addOrEdit',({
//                 viewTitle:'Update Employee',
//                 employee:doc
//             })  
//             )
//         }
//     })
// })
function insertRecord(req, res) {
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.save((err, doc) => {
        //if no error is there

        if (!err) {
            res.redirect('employee/list');
        }
        else {
            //if error is there 
            console.log("An error is there in inserting the row" + err);
        }
    });
}

//create a route  for displaying all the user
router.get('/list', async (req, res) => {
    if (req.session.email) {
    let list = await Employee.find().lean();
    res.render('employee/list', {
        list
    })
} else {
    res.redirect('/');
}
    // Employee.find((err, docs) => {
    //     if (!err) {

    //     }
    // })
})


//create a route  for displaying all the user
// router.get('/dashboard', async (req, res) => {
//     let list = await Employee.find().lean();
//     res.render('dashboard', {
//         list
//     })
//     // Employee.find((err, docs) => {
//     //     if (!err) {

//     //     }
//     // })
// })



router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                emplist: docs
            });
        }
        else {
            console.log('Error in retrieving emp list :' + err);
        }
    });
});


router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else {
            console.log('Error in employee remove :' + err);
        }
    });
});



// router.get('/lead', async (req, res) => {
//     let list = await Leadlist.find().lean();
//     res.render('lead', {
//         list
//     })
//     // Employee.find((err, docs) => {
//     //     if (!err) {

//     //     }
//     // })
// })

router.get('/auth',async(req,res)=>{
    let login = await Employee.find().l
})

router.get('/:id',(req,res)=>{
    Employee.findById(req.params.id,(err,doc)=>{
        if(!err){
            res.render("employee/addOREdit",{
                viewTitle:"Update Employee",
                employee: doc
            })
        }
    })
});

module.exports = router;