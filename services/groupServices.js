const expressHandler=require('express-async-handler');
const apiError = require('../utils/apiError');
const{updateOne,deleteOne,getAll}=require('../utils/apiFactory');
const groupModel = require('../models/groupModel');

const setFilterObj=expressHandler(async(req,res,next)=>{
    req.query.select='-members,-requests,-posts';
    return next();
});


const updateGroup=updateOne(groupModel);
const deleteGroup=deleteOne(groupModel);

const getGroup=expressHandler(async(req,res,next)=>{
    const group=await groupModel.findById(req.params.id);
    if(!group){
        return next(new apiError('Not Found',400));
    };
    const valid= group.members.includes( req.user._id.toString() ) ? true : false;
    await group.populate
    ([ 
        { 
        path:"posts" , 
        populate : {path:"user",select:"name profile",model:"User"} 
        } 
    ]);
    let result={... group};
    if( group.posts.length > 0 && !valid ) {
        delete result.posts;
    };
    res.status(200).json({result});
});

const getGroups=getAll(groupModel,'group',{path:"admin",select:"name profile"});
// expressHandler(async(req,res,next)=>{
//     const chat=await chatModel.find({'members':req.user._id}).
//     populate({path:"members",select:"name profile"});
//     if(!chat){
//         return next(new apiError('Not Found',400));
//     };
//     res.status(200).json({chat});
// });

const requestToJoin=expressHandler(async(req,res,next)=>{
    const group=await groupModel.findById(req.params.id);
    if(!group){
        return next(new apiError('Not Found',404));
    };
    if( group.members.includes(req.user._id) || group.requests.includes(req.user._id) ){
        return next(new apiError('can Not Found',404));
    };
    await group.updateOne({$push:{requests:req.user._id}});
    await group.save();
    res.status(200).json({status:'requested'});
});

const cancelRequest=expressHandler(async(req,res,next)=>{
    const group=await groupModel.findById(req.params.id);
    if(!group){
        return next(new apiError('Not Found',404));
    };
    if( group.members.includes(req.user._id) || !group.requests.includes(req.user._id) ){
        return next(new apiError('can Not Found',404));
    };
    await group.updateOne({$pull:{requests:req.user._id}});
    await group.save();
    res.status(200).json({ status:'canceled' });
});

const acceptRequest=expressHandler(async(req,res,next)=>{
    const {user}=req.body;
    const group=await groupModel.findById(req.params.id);
    if(!group){
        return next(new apiError('Not Found',404));
    };
    if( group.members.includes(user) || !group.requests.includes(user) ){
        return next(new apiError('can Not Found',404));
    };
    await group.updateOne({$pull:{ requests:user }});
    await group.updateOne({$push:{ members:user }});
    await group.save();
    res.status(200).json({status:'canceled'});
});

const changeGroupAdmin=expressHandler(async(req,res,next)=>{
    const {user}=req.body;
    const group=await groupModel.findById(req.params.id);
    if(!group){
        return next(new apiError('Not Found',404));
    };
    if( !group.members.includes(user) ){
        return next(new apiError('can Not Found user',404));
    };
    group.admin=user;
    await group.save();
    res.status(200).json({status:'changed'});
});


const createGroup=expressHandler(async(req,res,next)=>{
    req.body.members.push(req.user._id.toString());
    req.body.admin=req.user._id.toString();
    const group =await groupModel.create(req.body);
    if(!group){
        return next(new apiError('Could not create group',400));
    };
    res.status(200).json({group});
});

const accessGroup=expressHandler(async(req,res,next)=>{
    const group=await groupModel.findById(req.params.id);
    if( group?.admin.toString() != req.user._id.toString() ){
        return next(new apiError('you are not Group owner',400));
    };
    return next();
});

const getGroupMembers=expressHandler(async(req,res,next)=>{
    const group=await groupModel.findById(req.params.id).populate
    ( { path:"members",select:"name profile"} );
    if( !group ){
        return res.status(200).json({message:"no group found"});
    };
    res.status(200).json({ members:group.members });
});

const getUserGroups=expressHandler(async(req,res,next)=>{
    const group=await groupModel.find({"members":req.user._id})
    .populate([{path:"members",select:"name profile"}]);;
    if( group.length == 0 ){
        return res.status(200).json({message:"no group found"});
    };
    res.status(200).json({group});
});

const leaveGroup=expressHandler(async(req,res,next)=>{
    const user=req.user._id;
    const group=await groupModel.findById(req.params.id);
    if(! group ){
        return next(new apiError('Not Found',404));
    };
    if( user.toString() == group.admin.toString() ){
        res.status(200).json({status:"first select group admin"});
    };
    if( !group.members.includes(user) ){
        return next(new apiError('can Not Found',404));
    };
    await group.updateOne({$pull:{members:user}});
    await group.save();
    res.status(200).json({status:'leaved',group});
});

const accessGroupPost=expressHandler(async(req,res,next)=>{
    const group=await groupModel.findById(req.params.id);
    if(!group){
        return next(new apiError('Not Found',400));
    };
    const valid= group.members.includes( req.user._id ) ? true : false;
    if(!valid){
        return next(new apiError('can not access',400));
    };
    return next();
});


module.exports = { 
    accessGroup,createGroup,getGroups
    ,getGroup,updateGroup,deleteGroup,
    getUserGroups,createGroup,cancelRequest,
    acceptRequest,requestToJoin,changeGroupAdmin,
    leaveGroup,accessGroupPost,getGroupMembers,setFilterObj
};