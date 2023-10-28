const mongoose= require('mongoose');
require('dotenv').config();

const resultSchema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:"User"},
    score:Number,
    mistake:Number,
    quiz:{type:mongoose.Types.ObjectId,ref:"Quiz"},
    wrongAnswers:[{ 
        question : {type:mongoose.Types.ObjectId,ref:"Question"},
        answer:String
        }]
    },{
    timestamps:true
});

const resultModel=mongoose.model('Result',resultSchema);
module.exports = resultModel;