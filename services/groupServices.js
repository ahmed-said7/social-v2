const expressHandler=require('express-async-handler');
const apiError = require('../utils/apiError');
const{updateOne,deleteOne,getAll}=require('../utils/apiFactory');
const groupModel = require('../models/groupModel');


const updateGroup=updateOne(groupModel);
const deleteGroup=deleteOne(groupModel);

const getGroup=expressHandler(async(req,res,next)=>{
    const group=await groupModel.findById(req.params.id);
    if(!group){
        return next(new apiError('Not Found',400));
    };
    const valid= group.members.includes( req.user._id.toString() ) ? true : false;
    await group.populate([{path:"members",select:"name profile"}
        ,{path:"admin",select:"name profile"}]);
    let result={... group};
    if(group.posts.length > 0 && !valid ) {
        delete result.posts;
    };
    res.status(200).json({result});
});

const getGroups=getAll(groupModel);
// expressHandler(async(req,res,next)=>{
//     const chat=await chatModel.find({'members':req.user._id}).
//     populate({path:"members",select:"name profile"});
//     if(!chat){
//         return next(new apiError('Not Found',400));
//     };
//     res.status(200).json({chat});
// });



const createGroup=expressHandler(async(req,res,next)=>{
    req.body.members.push(req.user._id.toString());
    req.body.admin=req.user._id.toString();
    const group =await groupModel.create(req.body);
    if(!group){
        return next(new apiError('Could not create chat',400));
    };
    res.status(200).json({group});
});

const accessGroup=expressHandler(async(req,res,next)=>{
    const group=await groupModel.findById(req.params.id);
    if( group.admin.toString() != req.user._id.toString() ){
        return next(new apiError('you are not Group owner',400));
    };
    return next();
});

const getUserGroups=expressHandler(async(req,res,next)=>{
    const group=await groupModel.find({"members":req.user._id})
    .populate([{path:"members",select:"name profile"}
        ,{path:"admin",select:"name profile"}]);;
    if( group.length == 0 ){
        return res.status(200).json({message:"no group found"});
    };
    res.status(200).json({group});
});



module.exports = {
    accessGroup,createGroup,getGroups,getGroup,updateGroup,deleteGroup,
    getUserGroups
};