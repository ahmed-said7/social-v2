const mongoose= require('mongoose');
require('dotenv').config();


const storySchema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:"User"},
    text:String
    ,video:String,
    image:String
    ,votes:[{
        type:{type:Number,min:0,max:100},
        user:{type:mongoose.Types.ObjectId,ref:"User"}
    },]
},{
    timestamps:true,toObject:{virtuals:true},
    toJSON:{virtuals:true}
});

storySchema.post('init',function(doc){
    if(doc.image){
        doc.image=`${process.env.base_url}/story/${doc.image}`;
    };
    if(doc.video){
        doc.video=`${process.env.base_url}/story/${doc.image}`;
    };
});

const storyModel=mongoose.model('Story',storySchema);

module.exports=storyModel;