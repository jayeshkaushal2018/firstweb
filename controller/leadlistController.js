const express = require('express');

const mongoose = require('mongoose');

const Leadlist = require('../models/list.model');

//include the model class

const router = express.Router();

console.log("this an controller outer");
router.get('/leadlist', async (req, res) => {
    let lead = await Leadlist.find().lean();
    console.log(lead)
    res.render('lead', {
        lead
    })
    // Employee.find((err, docs) => {
    //     if (!err) {

    //     }
    // })
    console.log("this an controller");
})


app.get('/lead', async(req, res) => {
    // const doc = new Leadlist();
    // doc.cust_name = "test",
    // doc.contact = "test",
    // doc.enquiry = "test",
    // doc.action ="test",
    // doc.assigned_Id ="test",
    // doc.assigned_emp ="test",
    // doc.Status ="test",
    //await doc.save()
    let lead = await Leadlist.find().lean();
    console.log(lead)
    res.render('lead', {
        lead
    });
});

module.exports = router;
