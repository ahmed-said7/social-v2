const mongoose= require('mongoose');
require('dotenv').config();
const notificationSchema=new mongoose.Schema({
    text:String,
    url:String,
    user:{type:mongoose.Types.ObjectId,ref:"Notification"}
},{
    timestamps:true
});

const notificationModel=mongoose.model('Notification',notificationSchema);
module.exports=notificationModel;