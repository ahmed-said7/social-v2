const mongoose= require('mongoose');
require('dotenv').config();

const codeSchema=new mongoose.Schema({
    code:{type:String,unique:true},
    type:[{type:String,enum:['lesson','quiz']},],
    lesson:{type:mongoose.Types.ObjectId,ref:"Lesson"},
    user:{type:mongoose.Types.ObjectId,ref:"User"}
    ,quiz:{type:mongoose.Types.ObjectId,ref:"Quiz"},
    consumed:{type:Boolean,default:false},
    counter:{type:Number,default:0}
    },
    { timestamps:true });

const codeModel=mongoose.model('Code',codeSchema);
module.exports = codeModel;