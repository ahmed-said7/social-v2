const {getAll,getOne,createOne,updateOne,deleteOne} = require('../utils/apiFactory');
const commentModel=require('../models/commentModel');
const apiError = require('../utils/apiError');
const expressHandler = require('express-async-handler');


const createComment=createOne(commentModel);
const deleteComment=deleteOne(commentModel);
const updateComment=updateOne(commentModel);
const getComment=getOne(commentModel);
const getComments=getAll(commentModel);

const setFilterObject=expressHandler(async (req,res,next) => {
    if(req.params.postId){
        req.filterObj={};
        req.filterObj.post=req.params.postId;
    };
    return next();
});

const accessComment=expressHandler(async(req,res,next)=>{
    const comment=await commentModel.findById(req.params.id);
    if( comment.user.toString() != req.user._id.toString() ){
        return next(new apiError('you are not comment owner',400));
    };
    return next();
});

const setUserId=expressHandler(async(req,res,next)=>{
    req.body.user=req.user._id;
    return next();
});

module.exports = { createComment,getComments,
    getComment,deleteComment,
    updateComment,accessComment,
    setFilterObject,setUserId
};