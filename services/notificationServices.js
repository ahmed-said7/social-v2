const {getAll,getOne,createOne,updateOne,deleteOne} = require('../utils/apiFactory');
const notificationModel=require('../models/notificationModel');
const apiError = require('../utils/apiError');
const expressHandler = require('express-async-handler');


const createNotification=createOne(notificationModel);
const deleteNotification=deleteOne(notificationModel);
const getNotifications=expressHandler(async(req,res,next)=>{
    const notification=await notificationModel.find({user:req.user._id});
    if(notification.length == 0){
        return res.status(200).json({message:"no notification found"});
    }
    res.status(200).json({notification});
});



const accessNotification=expressHandler(async(req,res,next)=>{
    const notification=await notificationModel.findById(req.params.id);
    if( notification?.user.toString() != req.user._id.toString() ){
        return next(new apiError('you are not notificatio owner',400));
    };
    return next();
});



module.exports = { 
    getNotifications,createNotification,deleteNotification,
    accessNotification
};