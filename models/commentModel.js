const mongoose= require('mongoose');
const commentSchema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:"User"},
    post:{type:mongoose.Types.ObjectId,ref:"Post"},
    text:String,
    image:String
},{
    timestamps:true
});
const commentModel=mongoose.model('Comment',commentSchema);
module.exports = commentModel;