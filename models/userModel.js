const mongoose = require('mongoose');
const bcryptjs=require('bcryptjs');
require('dotenv').config();
const commentModel = require('./commentModel');
const postModel = require('./postModel');
const messageModel = require('./messageModel');
const chatModel =require('./chatModel');
const userSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,min:3},
        password:{type:String,required:true,min:6},
        username:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        coins:{type:Number,default:0},
        role:{type:String,default:'user',enum:['user','admin']},
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
        passwordExpiredAt:Date,
        resetCodeVertified:Boolean,
        transaction:[{amount:Number,time:Date,orderId:Number,paid:Boolean}]
    } , {timestamps:true} );


userSchema.pre('save',async function(next){
    if(this.birth){
        this.birth=new Date(this.birth);
    };
    if(! this.isModified("password")){ return next();}
    this.password=await bcryptjs.hash(this.password,10);
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


userSchema.post("findOneAndDelete",async function(doc){
    const posts=await postModel.find({user:doc._id});
    const Ids=posts.map((ele)=> ele._id);
    await commentModel.deleteMany({post:{$in:Ids}});
    await postModel.deleteMany({user:doc._id});
    await chatModel.updateMany({"members":doc._id},{$pull:{members:doc._id}});
    await messageModel.deleteMany({sender:doc._id});
});

const userModel=mongoose.model('User',userSchema);


module.exports=userModel;