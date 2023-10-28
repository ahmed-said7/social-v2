const mongoose= require('mongoose');
require('dotenv').config();

const groupSchema=new mongoose.Schema({
    admin:{type:mongoose.Types.ObjectId,ref:"User"},
    image:String,
    name:String,
    description:String,
    requests:[{type:mongoose.Types.ObjectId,ref:"User"},],
    members:[{type:mongoose.Types.ObjectId,ref:"User"},]
},{
    timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}
});

groupSchema.virtual('posts',{
    ref:"Post",
    localField:"_id",
    foreignField:"group"
});

groupSchema.post('init',function(doc){
    if(doc.image){
        doc.image=`${process.env.base_url}/group/${doc.image}`;
    };
});



const groupModel=mongoose.model('Group',groupSchema);

module.exports=groupModel;