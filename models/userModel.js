const mongoose = require('mongoose');
const bcryptjs=require('bcryptjs');
require('dotenv').config();
const commentModel = require('./commentModel');
const postModel = require('./postModel');
const messageModel = require('./messageModel');
const chatModel =require('./chatModel');
const reviewModel = require('./reviewModel');
const lessonModel = require('./lessonModel');
const resultModel = require('./resultModel');
const quizModel = require('./quizModel');
const questionModel = require('./questionModel');

const userSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,min:3},
        password:{type:String,required:true,min:6},
        // username:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        coins:{type:Number,default:0},
        role:{type:String,default:'student',enum:['student','admin','instructor']},
        birth:Date,
        cover:[String],
        profile:String,
        requests:[ { type:mongoose.Schema.Types.ObjectId , ref:"User" } ],
        friends:[ { type:mongoose.Schema.Types.ObjectId , ref:"User" } ],
        followers:[ { type:mongoose.Schema.Types.ObjectId , ref:"User" } ],
        following:[ { type:mongoose.Schema.Types.ObjectId , ref:"User" } ] ,
        savedPosts:[{ post:{ type:mongoose.Schema.Types.ObjectId , ref:"Post" }
        , savedAt:Date }],
        search:[{ user:{ type:mongoose.Schema.Types.ObjectId , ref:"User" }
        , searchAt:Date }],
        highSchool:String,
        relationship:{ type:String , enum : ["single","married","In a relationship"],
            default:"single"},
        college:String,
        homeTown:String,
        currentTown:String,
        workPlace:String,
        jop:String,
        otherName:String,
        bio:String,
        gender:{type:String,enum:["male","female"]},
        instagram:String,
        passwordChangedAt:Date,
        passwordResetCode:String,
        resetCodeExpiredAt:Date,
        resetCodeVertified:Boolean,
        transaction:[{amount:Number,time:Date,orderId:Number,paid:Boolean}],
        attendedLessons:[{ lesson:{ type:mongoose.Schema.Types.ObjectId , ref:"Lesson" }
        , attendedAt:Date }],
        quizzesTaken:[{ quiz:{ type:mongoose.Schema.Types.ObjectId , ref:"Quiz" }
        , takenAt:Date }]
        ,coordinates:[Number]
} , {timestamps:true} );

userSchema.index({coordinates:"2dsphere"});

userSchema.pre('save',async function(next){
    if( this.isModified('birth') ){
        this.birth=new Date(this.birth);
    };
    if(! this.isModified("password")){ return next();}
    this.password=await bcryptjs.hash( this.password , 10 );
    next();
});

userSchema.post('init',function(doc){
    if(doc.cover.length>0){
        doc.cover.forEach((img,i)=>{
            doc.cover[i]=`${process.env.base_url}/user/${img}`;
        });
    };
    if(doc.profile){
        doc.profile=`${process.env.base_url}/user/${doc.profile}`;
    };
});


userSchema.post("remove",async function(doc){
    const posts=await postModel.find({user:doc._id});
    const Ids=posts.map((ele)=> ele._id);
    await commentModel.deleteMany({post:{$in:Ids}});
    await postModel.deleteMany({user:doc._id});
    await chatModel.updateMany({"members":doc._id},{$pull:{members:doc._id}});
    await messageModel.deleteMany({sender:doc._id});
    await lessonModel.deleteMany({admin:doc._id});
    await reviewModel.deleteMany({ user : doc._id});
    await resultModel.deleteMany({ user : doc._id});
    const quizIds=await quizModel.find({admin:doc._id}).select('_id');
    await questionModel.deleteMany({ quiz : { $in : quizIds } });
    await resultModel.deleteMany({admin:doc._id});
});

const userModel=mongoose.model('User',userSchema);

module.exports=userModel;