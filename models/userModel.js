const mongoose = require('mongoose');
const bcryptjs=require('bcryptjs');
const userSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,min:3},
        password:{type:String,required:true,min:6},
        username:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        coins:{type:Number,default:0},
        role:{type:String,default:'user',enum:['user','admin']},
        birth:Date,
        cover:String,
        profile:String,
        requests:[ { type:mongoose.Schema.Types.ObjectId , ref:"User" } ],
        friends:[ { type:mongoose.Schema.Types.ObjectId , ref:"User" } ],
        followers:[ { type:mongoose.Schema.Types.ObjectId , ref:"User" } ],
        following:[ { type:mongoose.Schema.Types.ObjectId , ref:"User" } ] ,
        savedPosts:[{ post:{ type:mongoose.Schema.Types.ObjectId , ref:"Post" }
        , savedAt:Date }],
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
    } , {timestamps:true} );


userSchema.pre('save',async function(next){
    if(this.birth){
        this.birth=new Date(this.birth);
    };
    if(! this.isModified("password")){ return next();}
    this.password=await bcryptjs.hash(this.password,10);
    next();
});

const userModel=mongoose.model('User',userSchema);


module.exports=userModel;