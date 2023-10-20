const mongoose= require('mongoose');
const messageSchema=new mongoose.Schema({
    images:[String],text:String,
    chat:{type:mongoose.Types.ObjectId,ref:"Chat"},
    sender:{type:mongoose.Types.ObjectId,ref:"User"}
},{
    timestamps:true
});

const messageModel=mongoose.model('Chat',messageSchema);

module.exports = messageModel;