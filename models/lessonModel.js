const mongoose= require('mongoose');
require('dotenv').config();
const lessonSchema=new mongoose.Schema({
    title:String,
    notes:String,
    admin:{type:mongoose.Types.ObjectId,ref:"User"},
    isPublished:{type:Boolean,default:false},
    price:{type:Number,required:true},
    nums:Number,average:Number,
    video:String,
    level:String
    },{
    timestamps:true
});

lessonSchema.post('init',function(doc){
    if(doc.image){
        doc.image=`${process.env.base_url}/videos/${doc.image}`;
    };
    if(doc.video){
        doc.video=`${process.env.base_url}/videos/${doc.video}`;
    };
});


const lessonModel=mongoose.model('Lesson',lessonSchema);

module.exports = lessonModel;