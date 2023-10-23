const expressHandler=require('express-async-handler');
const commentModel=require('../models/commentModel');
const postModel=require('../models/postModel');
const apiError = require('../utils/apiError');

const likePost=expressHandler(async (req,res,next)=>{
    let post=await postModel.findById(req.params.id);
    if(!post) return next(new apiError('Post Not Found',400));
    const index=post.likes.findIndex((el)=> el.user.toString() == req.user._id.toString());
    if(index > -1){
        if(post.likes[index].type == req.body.type){
            return next(new apiError('you liked post before',400));
        };
        post.likes[index].type = req.body.type;
    }else {
        post.likes.push({type: req.body.type, user: req.user._id})
    };
    await post.save();
    res.status(201).json({post});
});

const unlikePost=expressHandler(async (req,res,next)=>{
    let post=await postModel.findById(req.params.id);
    if(!post) return next(new apiError('Post Not Found',400));
    const index=post.likes.findIndex((el)=> el.user.toString() == req.user._id.toString());
    if(index > -1){
        post.likes.splice(index, 1);
    };
    await post.save();
    res.status(201).json({post});
});

const likeComment=expressHandler(async (req,res,next)=>{
    let comment=await commentModel.findById(req.params.id);
    if(!comment) return next(new apiError('comment Not Found',400));
    const index=comment.likes.findIndex((el)=> el.user.toString() == req.user._id.toString());
    if(index > -1){
        if(comment.likes[index].type == req.body.type){
            return next(new apiError('you liked comment before',400));
        };
        comment.likes[index].type = req.body.type;
    }else {
        comment.likes.push({type: req.body.type, user: req.user._id})
    };
    await comment.save();
    res.status(201).json({comment});
});

const unlikeComment=expressHandler(async (req,res,next)=>{
    let comment=await commentModel.findById(req.params.id);
    if(!comment) return next(new apiError('comment Not Found',400));
    const index=comment.likes.findIndex((el)=> el.user.toString() == req.user._id.toString());
    if(index > -1){
        comment.likes.splice(index, 1);
    };
    await comment.save();
    res.status(201).json({comment});
});

module.exports = { likePost,likeComment,unlikeComment,unlikePost };