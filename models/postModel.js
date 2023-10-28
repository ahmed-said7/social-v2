const mongoose= require('mongoose');
require('dotenv').config();
const commentModel=require('../models/commentModel');

const postSchema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:"User"},
    group:{type:mongoose.Types.ObjectId,ref:"Group"},
    text:String,
    userPost: { type:Boolean , default:true }
    ,images:[String]
    ,likes:[{
        type:{type:String,enum:["like", "love","haha", "sad", "angry", "wow"]
        ,required:true},
        user:{type:mongoose.Types.ObjectId,ref:"User",required:true}
    },],
    commentsNumber:Number
},{
    timestamps:true,toObject:{virtuals:true},
    toJSON:{virtuals:true}
});


postSchema.post('init',function(doc){
    if(doc.images.length>0){
        doc.images.forEach((img,i)=>{
            doc.images[i]=`${process.env.base_url}/post/${img}`;
        });
    };
});




postSchema.virtual('comments',{
    ref:"Comment",
    localField:"_id",
    foreignField:"post"
});

postSchema.virtual('likeStatic').get(function(){
    let Obj={ all:0,like:0, love:0, haha:0, sad:0, angry:0, wow:0 };
    this.likes.forEach( (ele) =>{
        Obj[ele.type] += 1;
    });
    Obj.all=this.likes.length;
    return Obj;
});


postSchema.post('init',async function(){
    this.commentsNumber=(await commentModel.find({post:this._id})).length;
});

const postModel=mongoose.model('Post',postSchema);

module.exports = postModel;