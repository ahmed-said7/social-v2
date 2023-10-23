const expressHandler=require('express-async-handler');
const apiError = require('../utils/apiError');
const{updateOne,deleteOne}=require('../utils/apiFactory');
const chatModel = require('../models/chatModel');


const updateChat=updateOne(chatModel);
const deleteChat=deleteOne(chatModel);

const getChat=expressHandler(async(req,res,next)=>{
    const chat=await chatModel.findById(req.params.id);
    if(!chat){
        return next(new apiError('Not Found',400));
    };
    if( !chat.members.includes(req.user._id.toString()) ){
        return next(new apiError('you are not member',400));
    };
    await chat.populate({path:"members",select:"name profile"});
    res.status(200).json({chat});
});

const getUserChats=expressHandler(async(req,res,next)=>{
    const chat=await chatModel.find({'members':req.user._id}).
    populate({path:"members",select:"name profile"});
    if(!chat){
        return next(new apiError('Not Found',400));
    };
    res.status(200).json({chat});
});



const createChat=expressHandler(async(req,res,next)=>{
    req.body.members.push(req.user._id.toString());
    req.body.admin=req.user._id.toString();
    const chat =await chatModel.create(req.body);
    if(!chat){
        return next(new apiError('Could not create chat',400));
    };
    res.status(200).json({chat:chat});
});

const accessChat=expressHandler(async(req,res,next)=>{
    const chat=await chatModel.findById(req.params.id);
    if( chat.admin.toString() != req.user._id.toString() ){
        return next(new apiError('you are not chat owner',400));
    };
    return next();
});

module.exports = {
    accessChat,createChat,getUserChats,getChat,updateChat,deleteChat
};

