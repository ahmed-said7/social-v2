const mongoose= require('mongoose');
require('dotenv').config();
const quizSchema=new mongoose.Schema({
    title:{type:String,unique:true},
    isPublished:{type:Boolean,default:false},
    price:{type:Number,required:true},  // price is number of coins
    admin:{type:mongoose.Types.ObjectId,ref:"User"},
    nums:Number,average:Number,level:String,
    },{
    timestamps:true,toObject:{virtuals:true},
    toJSON:{virtuals:true}
});

quizSchema.virtual('questions',{
    ref:"Question",
    localField:"_id",
    foreignField:"quiz"
});



const quizModel=mongoose.model('Quiz',quizSchema);

module.exports = quizModel;
