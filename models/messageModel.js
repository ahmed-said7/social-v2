const mongoose= require('mongoose');
require('dotenv').config();
const messageSchema=new mongoose.Schema({
    images:[String],text:String,
    chat:{type:mongoose.Types.ObjectId,ref:"Chat"},
    sender:{type:mongoose.Types.ObjectId,ref:"User"},
    recipient:[{type:mongoose.Types.ObjectId,ref:"User"}]
},{
    timestamps:true,toObject:{virtuals:true},
    toJSON:{virtuals:true}
});

messageSchema.post('init',function(doc){
    if(doc.images.length>0){
        doc.images.forEach((img,i)=>{
            doc.images[i]=`${process.env.base_url}/message/${img}`;
        });
    };
});

const messageModel=mongoose.model('Message',messageSchema);

module.exports = messageModel;