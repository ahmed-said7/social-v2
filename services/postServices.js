const {getAll,getOne,createOne,updateOne,deleteOne}=require('../utils/apiFactory');
const postModel=require('../models/postModel');
const apiError = require('../utils/apiError');
const expressHandler = require('express-async-handler');

const createPost=createOne(postModel);
const deletePost=deleteOne(postModel);
const updatePost=updateOne(postModel);
const getPost=getOne(postModel);
const getPosts=getAll(postModel);
const accessPost=expressHandler(async(req,res,next)=>{
    const post=await postModel.findById(req.params.id);
    if( post.user.toString() != req.user._id.toString() ){
        return next(new apiError('you are not post owner',400));
    };
    return next();
});

const setUserId=expressHandler(async(req,res,next)=>{
    req.body.user=req.user._id;
    return next();
});

module.exports = { createPost,getPost,getPosts,
    accessPost,deletePost,updatePost,setUserId };