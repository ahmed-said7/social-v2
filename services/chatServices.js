const expressHandler=require('express-async-handler');
const apiError = require('../utils/apiError');
const {updateOne,deleteOne,getAll} =require('../utils/apiFactory');
const chatModel = require('../models/chatModel');


const updateChat=updateOne(chatModel);
const deleteChat=deleteOne(chatModel);
const getChats=getAll(chatModel,'chat',{ path:"latestMessage" ,select:"text user"
, populate : { path : "user" , select : "name" , model : "User" }
});
const setFilterObj=expressHandler( async(req,res,next)=>{
    req.filterObj={"members":req.user._id};
    return next();
});

const getChat=expressHandler(async(req,res,next)=>{
    const chat=await chatModel.findById(req.params.id);
    if( !chat  || !chat.members.includes(req.user._id.toString()) ){
        return next(new apiError('you are not member',400));
    };
    await chat.populate([ 
        // { path:"members",select:"name profile"} ,
    { path:"latestMessage" ,select:"text user"
    , populate : { path : "user" , select : "name" , model : "User" }
    }
        ]);
    res.status(200).json({chat});
});

const getChatMembers=expressHandler(async(req,res,next)=>{
    const chat=await chatModel.findById(req.params.id).
    populate( { path:"members",select:"name profile"}).select('members admin');
    if(!chat){
        return res.status(200).json({status:"no chats available"});
    };
    return res.status(200).json({chat});
});

const getUserChats=expressHandler(async(req,res,next)=>{
    const chats=await chatModel.find({'members':req.user._id}).
    populate([{ 
        path:"latestMessage",select:"text user"
        , populate : { path :"user",select:"name",model:"User"} },
    // { path:"members",select:"name profile"}
        ]);
    if(chats.length == 0){
        return res.status(200).json({status:"no chats available"});
    };
    return res.status(200).json({chats});
});



const createChat=expressHandler(async(req,res,next)=>{
    req.body.members.push( req.user._id.toString() );
    req.body.admin = req.user._id.toString();
    const chat = await chatModel.create( req.body );
    if(!chat){
        return next(new apiError('Could not create chat',400));
    };
    return res.status(200).json({chat:chat});
});

const accessChat=expressHandler(async(req,res,next)=>{
    const chat=await chatModel.findById(req.params.id);
    if( chat?.admin.toString() != req.user._id.toString() ){
        return next(new apiError('you are not chat owner',400));
    };
    return next();
});

//  @param id
//  @body user
const addMemberToChat=expressHandler(async(req,res,next)=>{
    const {user}=req.body;
    const chat=await chatModel.findById(req.params.id);
    if( !chat || chat.members.includes(user) ){
        return next(new apiError('can Not Found',404));
    };
    await chat.updateOne({ $push:{members:user} });
    await chat.save();
    res.status(200).json({status:'added'});
});

const leaveChat=expressHandler(async(req,res,next)=>{
    const user=req.user._id;
    const chat=await chatModel.findById(req.params.id);
    if( !chat || ! chat.members.includes(user) ){
        return next(new apiError('can Not Found',404));
    };
    if( user.toString() == chat.admin.toString() ){
        return res.status(200).json({status:"first select group admin"});
    };
    await chat.updateOne({$pull:{members:user}});
    await chat.save();
    res.status(200).json({status:'leaved'});
});

const changeChatAdmin=expressHandler(async(req,res,next)=>{
    const {user}=req.body;
    const chat=await chatModel.findById(req.params.id);
    if(!chat || !chat.members.includes(user)){
        return next(new apiError('Not Found',404));
    };
    chat.admin=user;
    await chat.save();
    res.status(200).json({status:'changed'});
});

module.exports = {
    accessChat,createChat,getUserChats,getChat,updateChat,deleteChat,
    addMemberToChat,leaveChat,changeChatAdmin,getChatMembers
    ,setFilterObj,getChats
};

