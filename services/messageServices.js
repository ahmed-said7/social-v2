const expressHandler=require('express-async-handler');
const messageModel=require('../models/messageModel');
const apiError = require('../utils/apiError');
const{getAll,updateOne,deleteOne,getOne}=require('../utils/apiFactory');
const chatModel = require('../models/chatModel');

const deleteMessage=deleteOne(messageModel);
const updateMessage=updateOne(messageModel);
const getMessage=getOne(messageModel);
const getMessages=getAll(messageModel);

const setFilterObject=expressHandler(async (req,res,next) => {
    if(req.params.chatId){
        req.filterObj={};
        req.filterObj.chat=req.params.chatId;
        const chat=await chatModel.findById(req.params.chatId);
        if(!chat || ! chat.members.includes(req.user._id.toString()) ){
            return next(new apiError('no messages found',400));
        };
    }else{
        return next(new apiError('nested route only',400));
    };
    return next();
});

const accessMessage=expressHandler(async(req,res,next)=>{
    const message=await messageModel.findById(req.params.id);
    if( message.sender.toString() != req.user._id.toString() ){
        return next(new apiError('you are not message owner',400));
    };
    return next();
});

const accessReadMessages=expressHandler(async(req,res,next)=>{
    const message=await messageModel.findById(req.params.id);
    if( !message.recipient.includes(req.user._id.toString()) ){
        return next(new apiError('you are not message owner',400));
    };
    return next();
});



const createMessage=expressHandler(async (req,res,next)=>{
    const sender=req.user._id;
    const chat=await chatModel.findOne({_id:req.body.chat,'members':sender});
    if(!chat){
        return next(new apiError('chat Not Found',400));
    };
    const recipient=chat.members.filter( (ele)=> ele.toString() != sender.toString());
    req.body.recipient=recipient;
    req.body.sender=sender;
    const message=await messageModel.create(req.body);
    if(!message){
        return next(new apiError('Could not create message',400));
    };
    // await message.populate([
    //     {path:"sender",path:'name'}
    //     ,{path:"recipient",path:'name'},
    //     {path:"chat",path:'name'}
    // ]);
    chat.latestMessage=message._id;
    await chat.save();
    res.status(200).json({message});
});

module.exports={
    accessMessage,createMessage,accessReadMessages,setFilterObject,
    deleteMessage,updateMessage,getMessage,getMessages
};

