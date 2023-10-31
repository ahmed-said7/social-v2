const {getAll,getOne,createOne,updateOne,deleteOne}=require('../utils/apiFactory');
const postModel=require('../models/postModel');
const apiError = require('../utils/apiError');
const expressHandler = require('express-async-handler');


const setFilterObject=expressHandler(async(req,res,next)=>{
    if(req.params.groupId){
        req.filterObj={};
        req.filterObj.group=req.params.groupId;
    };
    return next();
});

const createPost=createOne(postModel);
const deletePost=deleteOne(postModel);
const updatePost=updateOne(postModel);

const getPost=getOne(postModel,
    [{path:"user",select:"name profile"}]);

const getPosts=getAll(postModel,'post', 
    [{path:"user",select:"name profile"}]);

const accessPost=expressHandler(async(req,res,next)=>{
    const post=await postModel.findById(req.params.id);
    if( post?.user.toString() != req.user._id.toString() ){
        return next(new apiError('you are not post owner',400));
    };
    return next();
});

const getPostLikes=expressHandler(async(req,res,next)=>{
    const post=await postModel.findById(req.params.id);
    if(!post){
        return next(new apiError('you are not post owner',400));
    };
    await post.populate({path:"likes.user",select:"name proofile"});
    return res.status(200).json({ likes : post.likes });
});



const setUserId=expressHandler(async(req,res,next)=>{
    req.body.user=req.user._id;
    return next();
});

module.exports = { createPost,getPost,getPosts,
    accessPost,deletePost,updatePost,
    setUserId,setFilterObject,getPostLikes };

