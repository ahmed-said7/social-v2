const expressHandler=require('express-async-handler');
const apiError = require('../utils/apiError');
const{updateOne,deleteOne,getAll,getOne}=require('../utils/apiFactory');
const storyModel = require('../models/storyModel');


const updateStory=updateOne(storyModel);
const deleteStory=deleteOne(storyModel);
const getStory=getOne(storyModel,{path:"user",select:"name profile"});
const getAllStories = getAll(storyModel);


const getUserStories=expressHandler(async(req,res,next)=>{
    const story=await storyModel.find({user:req.params.id})
    .populate({path:"user",select:"name profile"});
    if( story.length == 0){
        return res.status(200).json({status: 'stories Not Found'});
    };
    res.status(200).json({story});
});

const getFollowingStories=expressHandler(async(req,res,next)=>{
    const story=await storyModel.find({user:{$in:req.user.following}})
    .populate({path:"user",select:"name profile"});
    if( story.length == 0){
        return res.status(200).json({status: 'stories Not Found'});
    };
    res.status(200).json({story});
});



const createStory=expressHandler(async(req,res,next)=>{
    req.body.user=req.user._id;
    const story =await storyModel.create(req.body);
    if(! story ){
        return next(new apiError(' Could not create chat ',400));
    };
    res.status(200).json({story});
});

const accessStory=expressHandler(async(req,res,next)=>{
    const story=await storyModel.findById(req.params.id);
    if( story.user.toString() != req.user._id.toString() ){
        return next(new apiError('you are not story owner',400));
    };
    return next();
});

module.exports = { accessStory,createStory,getFollowingStories,getUserStories,
    getAllStories,getStory,updateStory,deleteStory };