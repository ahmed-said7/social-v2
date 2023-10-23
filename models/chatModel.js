const mongoose= require('mongoose');
require('dotenv').config();
const messageModel = require('./messageModel');
const chatSchema=new mongoose.Schema({
    image:String,isGroup:{default:false,type:Boolean},name:String,
    admin:{type:mongoose.Types.ObjectId,ref:"User"},
    latestMessage:{type:mongoose.Types.ObjectId,ref:"Message"},
    members:[{type:mongoose.Types.ObjectId,ref:"User"}]
},{
    timestamps:true,toObject:{virtuals:true},
    toJSON:{virtuals:true}
});

chatSchema.post('init',function(doc){
    if(doc.image){
        doc.image=`${process.env.base_url}/chat/${doc.image}`;
    };
});

chatSchema.post("findOneAndDelete",async function(doc){
    await messageModel.deleteMany({chat:doc._id});
});

chatSchema.virtual('messages',{
    ref:"Message",
    localField:"_id",
    foreignField:"chat"
});


const chatModel=mongoose.model('Chat',chatSchema);
module.exports=chatModel;