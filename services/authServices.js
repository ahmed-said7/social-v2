const userModel=require("../models/userModel");
const postModel=require("../models/postModel");
const crypto=require('crypto');
const jwt=require('jsonwebtoken');
const expressHandler=require('express-async-handler');
const bcryptjs=require('bcryptjs');
const apiError = require("../utils/apiError");
const dotenv=require('dotenv');
const sendMail = require("../utils/sendMail");
const util=require('util');
const _scrypt=util.promisify(crypto.scrypt);
dotenv.config();

const login=expressHandler(async (req, res, next) => {
    const user = await userModel.findOne({email:req.body.email});
    if(!user) {
        return next(new apiError('no user found',400))
    };
    const valid=await bcryptjs.compare(req.body.password,user.password);
    if(!valid){
        return next(new apiError('password mismatch or email error',400));
    };
    const token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:"12d"});
    res.status(200).json({ token });
});

const signup = expressHandler( async (req,res,next) => {
    let user = await userModel.findOne({email:req.body.email});
    if(user) {
        return next(new apiError('email should be unique ',400));
    };
    user=await userModel.create(req.body);
    const token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:"12d"});
    return res.status(200).json({ token });
} );

const protected=expressHandler(async ( req, res , next ) => {
    let token;
    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        token=req.headers.authorization.split(' ')[1];
    };
    if( !token ) return next(new apiError('no token found'));
    const decoded=jwt.verify(token,process.env.SECRET);
    if( !decoded) return next(new apiError('invalid token',400));
    const user=await userModel.findById(decoded.userId);
    if( !user) return next(new apiError('user not found',400));
    if( user.passwordChangedAt){
        const timestamps=Math.floor( user.passwordChangedAt / 1000 );
        if( decoded.iat < timestamps ) return next(new apiError('password changed at',400));
    };
    req.user = user;
    return next();
});

const allowedTo=(...roles)=> expressHandler(async(req,res,next)=>{
    if(!roles.includes(req.user.role)){ 
        return next(new apiError('you are not allowed to access role',400));
    };
    next();
});


const getLoggedUser=expressHandler(async(req,res,next)=>{
    const user=req.user;
    // await user.populate([
    //     {path:"following",select:"name profile"},
    //     {path:"followers",select:"name profile"},
    //     {path:"friends",select:"name profile"}
    // ]);
    const posts=await postModel.find({user:user._id})
    .populate({ path:"user",select:"name profile"});
    // const stories=await storyModel.find({user:req.user._id}).
    // populate({path:"user",select:"name profile"});
    res.status(200).json({posts,user});
});


const getLoggedUserRequests=expressHandler(async(req,res,next)=>{
    const user=req.user;
    await user.populate({path:"requests",select:"name profile"});
    res.status(200).json({requests:user.requests});
});

const getLoggedUserFollowers=expressHandler(async(req,res,next)=>{
    const user=req.user;
    await user.populate({path:"followers",select:"name profile"});
    res.status(200).json({followers:user.followers});
});

const getLoggedUserFollowing=expressHandler(async(req,res,next)=>{
    const user=req.user;
    await user.populate({path:"following",select:"name profile"});
    res.status(200).json({followings:user.following});
});


const getLoggedUserFriends=expressHandler(async(req,res,next)=>{
    const user=req.user;
    await user.populate({path:"friends",select:"name profile"});
    res.status(200).json({friends:user.friends});
});

const updateLoggedUser=expressHandler(async(req,res,next)=>{
    if(req.body.password){
        return next(new apiError('can not update password',400));
    };
    const user=await userModel.findByIdAndUpdate(req.user._id,req.body,{new:true});
    res.status(200).json({user});
});

const deleteLoggedUser=expressHandler(async(req,res,next)=>{
    const user=await userModel.findOne({_id:req.user._id});
    await user.remove();
    res.status(200).json({status:"deleted"});
});


const updateLoggedUserPassword=expressHandler(async(req,res,next)=>{
    let user=req.user;
    user.password=req.body.password;
    user.passwordChangedAt=Date.now();
    await user.save();
    res.status(200).json({status:"updated"});
});


const forgetPassword=expressHandler(async(req,res,next)=>{
    let user= await userModel.findOne({email:req.body.email});
    if(!user){
        return next(new apiError('user not found',400));
    };
    const mailSender=new sendMail(user);
    const resetCode=mailSender.createRandomCode();
    const randomCode=crypto.randomBytes(8).toString('hex');
    const hashCode=(await _scrypt(resetCode,randomCode,32)).toString('hex');
    user.passwordResetCode=hashCode+"&"+randomCode;
    user.resetCodeExpiredAt=Date.now()+ 10*60*1000;
    user.resetCodeVertified=false;
    try{
        await mailSender.sendCode(resetCode);
    }catch(err){
        console.log(err);
        user.passwordResetCode=undefined;
        user.resetCodeExpiredAt=undefined;
        user.resetCodeVertified=undefined;
    };
    await user.save();
    res.status(200).json({status : 'success'});
});


const resetCodeVertify=expressHandler( async (req, res ,next) => {
    let user= await userModel.findOne({email:req.body.email});
    if(!user){
        return next(new apiError('user not found',400));
    };
    const resetCode=req.body.resetCode;
    const storedHash=user.passwordResetCode;
    const salt=storedHash.split('&')[1];
    const resultHash=(await _scrypt(resetCode,salt,32)).toString('hex');
    if(resultHash != storedHash.split('&')[0]){
        return next(new apiError('resetCode mismatch',400));
    };
    if(user.resetCodeExpiredAt < Date.now()){
        return next(new apiError('password reset code has been expired',400));
    };
    user.passwordResetCode=undefined;
    user.resetCodeExpiredAt=undefined;
    user.resetCodeVertified=true;
    await user.save();
    res.status(200).json({status : 'success'});
});


const changePassword=expressHandler( async (req, res,next) => {
    let user= await userModel.findOne({email:req.body.email});
    if(!user){
        return next(new apiError('user not found',400));
    };
    if(! user.resetCodeVertified ){
        return next(new apiError('vertify reset code',400));
    };
    user.password=req.body.password;
    user.passwordChangedAt=Date.now();
    user.resetCodeVertified=undefined;
    await user.save();
    res.status(200).json({status : 'success'});
} );


module.exports={
    login,signup,protected,allowedTo,
    getLoggedUser,updateLoggedUserPassword,deleteLoggedUser,
    updateLoggedUser,resetCodeVertify,forgetPassword,changePassword,
    getLoggedUserFollowers,getLoggedUserFollowing,getLoggedUserFriends,
    getLoggedUserRequests
};