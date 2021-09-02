const Users = require('../models/users');
const bcrypt = require('bcrypt');
const { response } = require('express');
const saltRound = 10;
const addUser = (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    var data = new Users({
        name: req.body.name,
        password: hash,
        email: req.body.email
    });
    data.save(function (error, result) {
        if (error) {
            console.log(error);
        }
        res.redirect('/login');
    })
    // console.log(req.body)
    // res.send('hello world add');
    // res.render('add');

}

const loginCheck = async (req, resp) => {
    var results = await Users.findOne({ name: req.body.name }, {});
    if (results) {
        var check = await bcrypt.compare(req.body.password, results.password)
        if (check) {
            sess = req.session;
            sess.name = results.name;
            sess.email = results.email;
            resp.redirect('/dasboard');
        } else {
            resq.redirect('/home');
        }
    }
}

const userLogout = (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }
       res.redirect('/home');
    })
}


module.exports = {
    addUser,
    loginCheck,
userLogout

}