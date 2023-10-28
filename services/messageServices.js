const expressHandler=require('express-async-handler');
const messageModel=require('../models/messageModel');
const apiError = require('../utils/apiError');
const{getAll,updateOne,deleteOne}=require('../utils/apiFactory');
const chatModel = require('../models/chatModel');

const deleteMessage=deleteOne(messageModel);
const updateMessage=updateOne(messageModel);
const getMessages=getAll(messageModel,null,{path:"sender",select:"name profile"});

const setFilterObject=expressHandler(async (req,res,next) => {
    req.filterObj={};
    if(req.params.chatId){
        const chat=await chatModel.findOne({_id:req.params.chatId,
            "members":req.user._id});
        if(!chat ){
            return next(new apiError('no messages found',400));
        };
        req.filterObj.chat=req.params.chatId;
        if( req.user._id.toString() == chat.admin.toString() ){
            await messageModel.updateMany(
                {chat:req.params.chatId,seenByAdmin:false},{seenByAdmin:true});
            chat.latestMessage=(await messageModel.find().sort("-createdAt"))[0]._id;
            await chat.save();
        } else {
            req.filterObj.seenByAdmin=true;
        };
    };
    return next();
});

const getMessageRecipient=expressHandler(async(req,res,next)=>{
    const message=await messageModel.findById(req.params.id);
    const chat =await chatModel.findById(message.chat);
    if( req.user._id.toString() == chat.admin.toString() ){
        message.seenByAdmin=true;
        await message.save();
    }else if(! message.seenByAdmin ){
        res.status(200).json({status:"can not find message"});
    };
    await message.populate([ {path:"sender",select:"name profile"}
        ,{path:"recipient",select:"name profile"} ]);
    return res.status(200).json({message});
});

const accessMessage=expressHandler(async(req,res,next)=>{
    const message=await messageModel.findById(req.params.id);
    if( message?.sender.toString() != req.user._id.toString() ){
        return next(new apiError('you are not message owner',400));
    };
    return next();
});



const createMessage=expressHandler(async (req,res,next)=>{
    const sender=req.user;
    if(sender.role == 'admin') req.body.seenByAdmin = true;
    const chat=await chatModel.findOne({_id:req.body.chat,'members':sender._id});
    if(!chat){
        return next(new apiError('chat Not Found',400));
    };
    const recipient=chat.members.filter( (ele) => ele.toString() != sender._id.toString());
    req.body.recipient=recipient;
    req.body.sender=sender._id;
    const message=await messageModel.create(req.body);
    if(!message){
        return next(new apiError('Could not create message',400));
    };
    if(sender.role=='admin') chat.latestMessage=message._id;
    await chat.save();
    res.status(200).json({message});
});

const updateSeenByAdmin=expressHandler(async(req,res,next)=>{
    const message=await messageModel.findByIdAndUpdate(req.params.id,
        {seenByAdmin:true},{new:true});
    if(!message){
        return next(new apiError('Not Found',400));
    };
    const chat=await chatModel.findOne({_id : message.chat});
    if(!chat ){
        return next(new apiError('no messages found',400));
    };
    if( req.user._id.toString() != chat.admin.toString() ){
        return next(new apiError('can not update admin',400));
    };
    await messageModel.populate({path:"sender",select:"name profile"});
    return res.status(200).json({message:message});
});


module.exports={
    accessMessage,createMessage,setFilterObject,
    deleteMessage,updateMessage,getMessageRecipient,getMessages,
    updateSeenByAdmin
};
