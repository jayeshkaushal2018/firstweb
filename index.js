require('./config/database');

const hbs = require('hbs');
//  require('./config/hbs_helper');

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Users = require('./models/users');
const path = require('path');
const bcrypt = require('bcrypt');
var localStorage = require('localStorage');
const app = express();
const mongoose = require("mongoose");
const employeeController = require('./controller/employeeController');
const employeemodel = require('./models/employee.model');
const Leadlist = require('./models/list.model');
const Project = require('./models/project.model');
const session = require('express-session');
const Validator = require("fastest-validator");
 const multer = require('multer');
//const upload = require("express-fileupload");
//app.use(upload());

const storage = multer.diskStorage({
    destination: './public/upload',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

    }
});

//Init Upload
const upload = multer({
    storage: storage,
    //limits: { fileSize: 1000000 }
}).single('file');


const v = new Validator();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,

}))




const url = "mongodb://localhost:27017/EmployeeDB";
// var bodyParser = require('body-parser');
const User = require('./models/tokendb');
var jsonParser = bodyParser.json();
let crypto = require('crypto');
//const { JsonWebTokenError } = require("jsonwebtoken");
let key = "password";
let algo = 'aes256';

// Configure template Engine and Main Template File
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts'
}));
// Setting template Engine
app.set('view engine', 'hbs');
//app.engine('handlebars', engines.handlebars);

app.use('/public', express.static(__dirname + "/public"));

//
const jwt = require('jsonwebtoken');
const { constants } = require('buffer');
const { Console } = require('console');

// routes
app.get('/', (req, res) => {
    res.render('home');
});
// app.get('/aboutus', (req, res) => {
//     res.render('aboutus');
// });
// app.get('/setting', (req, res) => {
//     res.render('setting');
// });
// app.get('/contact', (req, res) => {
//     res.render('contact');
// });
// app.get('/service', (req, res) => {
//     res.render('service');
// });
// app.get('/insertEmp', (req, res) => {
//     res.render('insertEmp');
// });
// app.get('/employee', (req, res) => {
//     res.render('employee');
// });
app.get('/insertlead', async (req, res) => {
    if (req.session.email) {
        let emp = await employeemodel.find().lean();
        console.log(emp);
        res.render('insertlead', {
            emp
        });
    }
    else {
        res.redirect('/');
    }
});


app.get('/lead', async (req, res) => {

    //"$oid": "60effd963c872f19e4e3ec05"
    //     employeemodel.find({$or:[{$oid: "60effd963c872f19e4e3ec05"}]}, function(err, id) 
    //  {
    //     if (err)
    //     {
    //         res.send(err);upload
    //     }
    //     console.log(id);
    //     // res.json(user);

    //  });
    const _id = '60effd963c872f19e4e3ec05';
    const doc = await employeemodel.findById(_id, { 'fullName': 1 });
    console.log(doc);

    if (req.session.email) {
        let lead = await Leadlist.find().lean();
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

        lead.map((res) => {
            res.follow_last = res.follow_last && res.follow_last.toLocaleDateString("en-US", options);
            res.follow_next = res.follow_next && res.follow_next.toLocaleDateString("en-US", options);
            res.service_wanted = res.service_wanted && res.service_wanted.toLocaleDateString("en-US", options);

        })

        console.log(lead);
        res.render('lead', {
            lead
        });
    }
    else {
        res.redirect('/');
    }


});



app.get('/project', async (req, res) => {

    if (req.session.email) {
        let project = await Project.find().lean();
        console.log(project);
        res.render('project', {
            project
        });
    }
    else {
        res.redirect('/');
    }

});




// app.get('/delete/:id', (req, res) => {
//     Leadlist.findByIdAndRemove(req.params.id, (err, doc) => {
//         if (!err) {
//             res.redirect('/lead');
//         }
//         else {
//             console.log('Error in employee remove :' + err);
//         }
//     });
// });

// DELETE
app.delete('/reviews/:id', function (req, res) {
    console.log("DELETE review")
    Leadlist.findByIdAndRemove(req.params.id).then((review) => {
        res.redirect('/lead');
    }).catch((err) => {
        console.log(err.message);
    })
})

app.get('/dashboard', async (req, res) => {



    if (req.session.email) {

        let countLead = await Leadlist.find().count();
        let countemployee = await employeemodel.find().count();
        let countproject = await Project.find().count();

        let obj = { obj1: countLead, obj2: countemployee, obj3: countproject };
        console.log(obj.obj1);
        res.render('dashboard', {
            obj,

        });
    } else {
        res.redirect('/');
    }

    // if (req.session.email) {}
    // else {
    //     res.redirect('/');
    // }




    //     var query = User.find();
    // query.count(function (err, count) {
    //     if (err) console.log(err)
    //     else console.log("Count is", count)
    // });

})



// app.post('/leadtest', jsonParser, function (req, res) {
//     const doc = new Leadlist();
//     //doc.cust_name = req.body.cust_name;
//     console.log(req.body.cust_name)
//     doc.phone = "test";
//     doc.address = "test";
//     doc.email = "test";
//     doc.city = "test";
//     doc.when_needed = "test";
//     doc.budget = "test";
//     doc.service = "test";
//     doc.save(function (err, data) {
//         if (err) {
//             console.log(error);
//         }
//         else {
//             res.send("Data inserted");
//         }
//     });;
//     //  let lead = await Leadlist.find().lean();
//     // console.log(lead)
//     // res.render('lead', {
//     //     lead
//     // });
// });



// app.get('/registration', (req, res) => {
//     res.render('registration');
// });


app.use(bodyParser.urlencoded({
    extended: true
}));

// app.use(bodyParser.json());
// app.get('/dashboard', (req, res) => {
//     res.render('dashboard');
// });

app.get('/password', (req, res) => {
    res.render('password');
});

app.get('/editEmp', (req, res) => {
    res.render('editEmp');
})
app.get('/addcust', (req, res) => {
    if (req.session.email) {
        res.render('addcust');
    } else {
        res.redirect('/');
    }

})
app.get('/insertproject', (req, res) => {
    res.render('insertproject');
})

app.get('/profileSetting', (req, res) => {
    res.render('profileSetting');
})

app.get('/passwordReset', async (req, res) => {



    // if (check) {
    //    console.log("this is working");
    // } 
    if (req.session.email) {
        res.render('passwordReset');
    }
    else {
        res.redirect('/');
    }
})

app.post('/passwordReset', async (req, res) => {

    var results = await Users.findOne({ name: "admin" }, {});
    console.log(results);
    var check = await bcrypt.compare(req.body.password, results.password);
    // let error={mess:"passwor not matcg"};
    // console.log(error.mess);



    if (check) {
        Users.findOneAndUpdate({ name: "admin" }, req.body.passwordone, { new: true }, (err, doc) => {
            if (!err) { res.redirect('/passwordReset') };
        }).lean();
    }
    res.render('passwordReset');

})

app.get('/employeedit', (req, res) => {
    res.render('employeedit');
})

// app.get('/addOrEdit', (req, res) => {
//     res.render('Employee/addOrEdit');
// });

app.get('/leadedit', (req, res) => {
    if (req.session.email) {
        res.render('leadedit');
    }
    else {
        res.render('/');
    }
});


// app.post('/submit',(req,res)=>{

//     const { login, password } = req.body;
//     if(login =="login" && password=="password"){
//         console.log("it is an successful login");
//         res.render('employee')
//     }
//     else{
//         console.log("it is an unsuccessful");
//     }

// });

app.post('/login', jsonParser, async (req, resp) => {
    // User.findOne({ email: req.body.email }).then((data) => {

    //     var decipher = crypto.createDecipher(algo, key);
    //     // res.json(data);
    //     var decrypted = decipher.update(data.password, 'hex', 'utf8') +
    //         decipher.final('utf8');


    var results = await Users.findOne({ email: req.body.email }, {});
    // var error = {arr :"password or email having error"};
    console.log(results);
    if (results) {
        var check = await bcrypt.compare(req.body.password, results.password)
        if (check) {
            sess = req.session;
            sess.name = req.body.name;
            sess.email = req.body.email;
            resp.redirect('/dashboard');
        } else {
            resp.redirect('/');
        }
    }



    // if ("password" == req.body.password) {
    //     // jwt.sign({ data }, "jwt", { expiresIn: '300s' }, (err, token) => {
    //     //  res.status(200).json({token});
    //     sess = req.session;
    //     sess.email = req.body.email;
    //     sess.password = req.body.password;

    //     localStorage.setItem("token", "this is it");

    //     // res.redirect('/dashboard');

    //     // localStorage.setItem("token", );

    // }
    // )

    // }
    else {
        console.log("not fine");
        console.log("decrypted" + decrypted);
        console.log("password " + req.body.password);
    }

    // res.json(data);
    // })
})

app.get('project', (req, res) => {
    console.log("project");
    // Project.findByIdAndRemove(req.params.id,(err,doc) => {
    //     if(!err){
    //         res.redirect('/project');
    //     }
    //     else{
    //         console.log("An error occured during the Delete Process" + err);
    //     }
    // })
})

app.get('/logout', (req, res) => {


    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        // window.open("http://localhost:3000/");

        // res.redirect('/');
        res.redirect(req.get('referer'));
        // res.redirect('/');
    })

})
app.get('/project/delete/:id', (req, res) => {


    Project.findByIdAndDelete(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/project');
        } else {
            console.log('Error while deleting', err)
        }
    });
})

app.get('/employeedit/:id', async (req, res) => {


    // Project.findByIdAndDelete(req.params.id, (err, doc)=>{
    //     if(!err){
    //         res.redirect('/project');            
    //     } else {
    //         console.log('Error while deleting', err)
    //     }
    // });
    // let lead = await employeemodel.find().lean();
    // let employeeid = await employeemodel.findById({ _id : req.body.id }).lean();
    // console.log(employeeid);
    // res.render('employeedit', {
    //     employeeid
    // });

    if (req.session.email) {
        employeemodel.findById(req.params.id, (err, employeeid) => {
            console.log(employeeid);
            if (!err) {

                res.render("employeedit", {
                    employeeid
                })
            }
        }).lean();
    } else {
        res.redirect('/');
    }
})

// app.post('/leadedit/update',  (req, res) => {
//     Leadlist.findOneAndUpdate({_id: req.body._id},req.body,{new: true},(err,doc)=>{
//         if(!err){
//             res.redirect('lead');
//         }
//         else{
//             console.log(err);
//         }
//     })
// })

app.get('/leadedit/:id', async (req, res) => {


    if (req.session.email) {
        Leadlist.findById(req.params.id, async (err, Lead) => {
            // var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

            // Lead.map((res) => {
            //     res.follow_last = res.follow_last && res.follow_last.toLocaleDateString("en-US", options);
            //     res.follow_next = res.follow_next && res.follow_next.toLocaleDateString("en-US", options);
            //     res.service_wanted = res.service_wanted && res.service_wanted.toLocaleDateString("en-US", options);

            // })

            if (!err) {

                let emp = await employeemodel.find().lean();
                console.log(Lead);
                res.render("leadedit", {
                    Lead,
                    emp
                })
            }
        }).lean();
    } else {
        res.redirect('/');
    }

})

app.get('/projectedit/:id', async (req, res) => {


    // Project.findById(req.params.id, (err, projectlist) => {
    //     if (!err) {

    //         res.render("projectedit", {
    //             projectlist
    //         })
    //     }
    // }).lean();
    // Project.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }, (err, doc) => {
    //     if (!err) { res.redirect('projectedit') };
    // }).lean();

    if (req.session.email) {
        Project.findById(req.params.id, async (err, projectlist) => {
            console.log(projectlist);
            let emp = await employeemodel.find().lean();
            if (!err) {

                res.render("projectedit", {
                    projectlist,
                    emp
                })
            }
        }).lean();
    } else {
        res.redirect('/');
    }


})

app.post('/project/update', async (req, res) => {


    // Project.findByIdAndDelete(req.params.id, (err, doc)=>{
    //     if(!err){
    //         res.redirect('/project');            
    //     } else {
    //         console.log('Error while deleting', err)
    //     }
    // });
    // let lead = await employeemodel.find().lean();
    // let Lead = await  Leadlist.findOne({ id: req.body.id }).lean();

    // console.log(Lead);

    Project.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/project') };
    }).lean();
    // res.render('leadedit', {
    //     Lead
    // });
})
app.get('/projectadd/:id', async (req, res) => {

    if (req.session.email) {
        let emp = await employeemodel.find().lean();
        Leadlist.findById(req.params.id, (err, projectlist) => {
            // Leadlist.findById(req.params.id, (err, Lead) => {

            console.log(emp);
            if (!err) {

                res.render("insertproject", {
                    projectlist,
                    emp

                })
            }
        }).lean();
    } else {
        res.redirect('/');
    }


})

app.post('/leadedit/update', async (req, res) => {


    // Project.findByIdAndDelete(req.params.id, (err, doc)=>{
    //     if(!err){
    //         res.redirect('/project');            
    //     } else {
    //         console.log('Error while deleting', err)
    //     }
    // });
    // let lead = await employeemodel.find().lean();
    // let Lead = await  Leadlist.findOne({ id: req.body.id }).lean();

    // console.log(Lead);

    Leadlist.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/lead') };
    }).lean();
    // res.render('leadedit', {
    //     Lead
    // });
})

app.post('/employeedit/update', async (req, res) => {
    // let employeeid = await  employeemodel.findOne({ id: req.body.id }).lean();
    //employeemodel.findByIdAndRemove({id: req.body.id},{employeeid.fullName},function(err,data){if(!err) console.log(data);});
    // const doc = new employeemodel();
    // doc.cust_name = req.body.fullName;
    // doc.email = req.body.email;
    // doc.mobile = req.body.mobile;
    // doc.city = req.body.city;
    //    employeemodel.findByIdAndRemove({id: req.body.id},{employeeid.fullName},function(err,data){if(!err) console.log(data);});
    if (req.session.email) {
        console.log("editupdate");
        console.log(req.body);
        employeemodel.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }, (err, doc) => {
            if (!err) { res.redirect('/employee/list') };
        }).lean();
    } else {
        res.redirect('/');
    }
})

app.get('/lead/delete/:id', (req, res) => {
    if (req.session.email) {
        // console.log("list delete");
        Leadlist.findByIdAndDelete(req.params.id, (err, doc) => {
            if (!err) {
                res.redirect('/lead');
            } else {
                console.log('Error while edit', err)
            }
        });
    } else {
        res.redirect('/');
    }
})

app.get('/insertlead/follow_last_person/add/', (req, res) => {
    console.log("working");
    //    console.log(req.params.fullName);
})





app.post('/insertproject', async (req, res) => {

    const doc = new Project();
    doc.cust_name = req.body.fullName;
    doc.contact = req.body.mobile;
    doc.city = req.body.city;
    doc.email = req.body.email;
    doc.enquiry = req.body.enqiury;
    doc.status = req.body.status;
    doc.assign_emp = req.body.employee;
    await doc.save();
    let add = await Project.find().lean();
    console.log(add);
    res.redirect('project');
})




app.post('/addcust', async (req, res) => {
    // cont doc = new Leadlist();
    // doc.cust_name = "test",
    // doc.contact = "test",
    // doc.enquiry = "test",
    // doc.action ="test",
    // doc.assigned_Id ="test",
    // doc.assigned_emp ="test",
    // doc.Status ="test",
    //await doc.save()
    // let lead = await Leadlist.find().lean();
    // console.log(lead)
    // res.render('lead', {
    //     lead
    // });
     if (req.session.email) {       
   
        upload(req, res, (err) => {
            if (err) {
             Console.log(err);
            }
            else{
                // console.log(req.file);
                // console.log("test");
            }
        });
        const doc = new employeemodel();
        doc.firstName = req.body.firstName;
        doc.lasttName = req.body.lastName;
        doc.date_of_join = req.body.date_of_join;
        doc.fullName = req.body.fullName;
        doc.mobile = req.body.mobile;
        doc.city = req.body.city;
        doc.email = req.body.email;
        doc.econtact = req.body.econtact;
        
        //var file = req.file;
       // var filename = req.body.pencard;
        


        await doc.save();
    //     console.log(doc);
         console.log(req.body);
    //    console.log(req.params);
        let emp = await employeemodel.find().lean();
        
        console.log(doc);
       
        // console.log(req.body.file);
       // console.log(req.files.file);
        // console.log(filename);

        
        
        res.redirect('employee/list');
        // res.render('employee/list', {
        //     emp
        // });
       // console.log("hello world");
    }
    else {
        res.redirect('/');
    }
});


app.post('/addemployee', async (req, res) => {
    // const doc = new Leadlist();
    // doc.cust_name = "test",
    // doc.contact = "test",
    // doc.enquiry = "test",
    // doc.action ="test",
    // doc.assigned_Id ="test",
    // doc.assigned_emp ="test",
    // doc.Status ="test",
    //await doc.save()
    // let lead = await Leadlist.find().lean();
    // console.log(lead)
    // res.render('lead', {
    //     lead
    // });
    if (req.session.email) {
        const doc = new Leadlist();
        doc.cust_name = req.body.custs_name;
        doc.phone = req.body.phone;
        doc.city = req.body.city;
        doc.budget = req.body.budget;
        doc.enqiury = req.body.enqiury;
        doc.email = req.body.email;
        doc.address = req.body.address;
        doc.econtact = req.body.econtact;
        doc.no_room = req.body.no_room;
        doc.property_status = req.body.property_status;
        doc.customer_property = req.body.customer_property;
        doc.follow_last = req.body.follow_last;
        doc.follow_next = req.body.follow_next;
        doc.service_wanted = req.body.service_wanted;
        doc.project_status = req.body.project_status;
        //  doc.follow_next_person = req.body.follow_next_person;
        doc.follow_last_person = req.body.follow_last_person;
        doc.follow_next_person = req.body.follow_next_person;
        doc.emplyee_working = req.body.emplyee_working;
        await doc.save();
        let lead = await Leadlist.find().lean();
        console.log(lead)
        res.render('lead', {
            lead
        });
        console.log("hello world");

    } else {
        res.redirect('/');
    }
});

console.log("hello jayesh kaushal")


app.set('views', path.join(__dirname, '/views/'));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));

// port where app is served
app.listen(3000, () => {
    console.log('The web server has started on port 3000');
});

app.use('/employee', employeeController);
app.use('/addcust', employeeController);

module.exports = app;