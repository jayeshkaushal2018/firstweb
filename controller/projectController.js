const express = require('express');

const mongoose = require('mongoose');

// const Project = require('../models/project.model');
const Project = mongoose.model('Project');

router.get('/project', async (req, res) => {
    let projectlist = await Project.find().lean();

    console.log("projectlist");

    res.render('project', {
        projectlist
    })
    // Employee.find((err, docs) => {
    //     if (!err) {

    //     }
    // })
})


module.exports = router;