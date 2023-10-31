const mongoose= require('mongoose');
require('dotenv').config();
const notificationSchema=new mongoose.Schema({
    text:String,
    user:{type:mongoose.Types.ObjectId,ref:"User"}
},{
    timestamps:true
});

const notificationModel=mongoose.model('Notification',notificationSchema);
module.exports=notificationModel;