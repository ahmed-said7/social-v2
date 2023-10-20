const mongoose= require('mongoose');
const likeSchema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:"User",required:true},
    post:{type:mongoose.Types.ObjectId,ref:"Post"},
    comment:{type:mongoose.Types.ObjectId,ref:"Comment"},
    type:{type:String,enum:["like", "love", "haha", "sad", "angry", "wow"]
    ,required:true}
},{
    timestamps:true
});

const likeModel=mongoose.model('Like',likeSchema);

module.exports = likeModel;