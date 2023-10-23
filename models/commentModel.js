const mongoose= require('mongoose');
require('dotenv').config();
const commentSchema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:"User"},
    post:{type:mongoose.Types.ObjectId,ref:"Post"},
    text:String,
    image:String,
    likes:[{
        type:{type:String,enum:["like", "love","haha", "sad", "angry", "wow"]
        ,required:true},
        user:{type:mongoose.Types.ObjectId,ref:"User",required:true}
    },]
},{
    timestamps:true,toJSON:{virtuals:true},
    toObject:{virtuals:true},
});

commentSchema.post('init',function(doc){
    if(doc.image){
        doc.image=`${process.env.base_url}/comment/${doc.image}`;
    };
});

commentSchema.virtual('likeStatic').get(function(){
    let Obj={all:0 ,like:0, love:0, haha:0, sad:0, angry:0, wow:0 };
    this.likes.forEach( (ele) =>{
        Obj[ele.type] += 1;
    });
    Object.all=this.likes.length;
    return Obj;
});


const commentModel=mongoose.model('Comment',commentSchema);
module.exports = commentModel;