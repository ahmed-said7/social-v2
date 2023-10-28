const expressHandler=require('express-async-handler');
const jopModel=require('../models/jopModel');
const {updateOne,deleteOne,createOne,getAll,getOne} =require('../utils/apiFactory');
const apiError = require('../utils/apiError');

const createJop=createOne(jopModel);
const updateJop=updateOne(jopModel);

const deleteJop=deleteOne(jopModel);

const getJops=getAll(jopModel,"title",{path:"admin",select:"name profile"});

const accessJop=expressHandler(async(req,res,next)=>{
    const jop=await jopModel.findById(req.params.id);
    if( jop?.admin.toString() != req.user._id.toString() ){
        return next(new apiError('you are not review owner',400));
    };
    return next();
});

const getJop=expressHandler(async(req,res,next)=>{
    const jop=await jopModel.findById(req.params.id);
    if( !jop ){
        return next(new apiError('not found',400));
    };
    let result={...jop};
    const admin=jop.admin;
    if(  admin.toString() != req.user._id.toString() ){
        delete result.applicants;
        res.status(200).json({result});
    };
    await jop.populate({path:"applicants.user",select:"name profile"});
    res.status(200).json({jop});
});

const setFilterObj=expressHandler(async(req,res,next)=>{
    req.query.select='-applicants';
    return next();
});

const setUserId=expressHandler(async(req,res,next)=>{
    req.body.admin=req.user._id;
    return next();
});

const applyToJop=expressHandler(async(req,res,next)=>{
    const jop=await jopModel.findById(req.params.id);
    if(!jop){
        return next(new apiError('Not Found',400));
    };
    // jop.maxApplicants
    if( jop.maxApplicants && jop.applicants.length > jop.maxApplicants ){
        res.status(200).json({status:"you can not apply for this application"});
    };
    const index=jop.applicants.findIndex( 
        ( {user} ) => user.toString() == req.user._id.toString() );
    if(index > -1){
        jop.applicants[index].cv=req.body.cv;
    }else {
        const application={user:req.user._id,cv:req.body.cv};
        jop.applicants.push(application);
    };
    await jop.save();
    await jop.populate({path:"admin",select:"name profile"});
    return res.status(200).json({status:"success , you applied successfully"});
});

module.exports={
    applyToJop,createJop,updateJop,deleteJop,setUserId,setFilterObj,getJops
    ,accessJop,getJop
};