const expressHandler=require('express-async-handler');
const userModel=require('../models/userModel');

const createUser=expressHandler(async (req,res,next)=>{
    let user=await userModel.create(req.body);
    res.status(201).json({user});
});

const getUser=expressHandler(async (req,res,next)=>{
    let user=await userModel.findById(req.params.id);
    res.status(201).json({user});
});

module.exports = {createUser,getUser};