const mongoose= require('mongoose');
const chatSchema=new mongoose.Schema({
    image:String,isGroup:{default:false,type:Boolean},name:String,
    admin:{type:mongoose.Types.ObjectId,ref:"User"},
    latestMessage:{type:mongoose.Types.ObjectId,ref:"Message"},
    members:[{type:mongoose.Types.ObjectId,ref:"User"}]
},{
    timestamps:true
});

const chatModel=mongoose.model('Chat',chatSchema);

module.exports = chatModel;