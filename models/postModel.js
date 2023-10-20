const mongoose= require('mongoose');

const postSchema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:"User"},
    text:String,
    images:[String]
},{
    timestamps:true
});

const postModel=mongoose.model('Post',postSchema);

module.exports = postModel;