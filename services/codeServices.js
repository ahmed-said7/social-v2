const expressHandler=require('express-async-handler');
const apiError = require('../utils/apiError');
const codeModel = require('../models/codeModel');
const userModel = require('../models/userModel');
const lessonModel = require('../models/lessonModel');
const quizModel = require('../models/quizModel');
const couponModel = require('../models/couponModel');

const randomCode=()=>{
    let i=0;
    let output='';
    const str='abcdefghijklmnpqrstuvwxyz123789456#&';
    while(i<11){
        const index=Math.floor( Math.random() * str.length );
        if( i % 2 == 0){
            output += str[index];
        };
        i++;
    };
    return output;
};
// console.log(randomCode());

const applyCoinCoupon= expressHandler ( async(req,res,next) => {
    const {coins,couponName}=req.body;
    if(!couponName) return next(new apiError('Invalid Coupon',400));
    if(!coins) return next(new apiError('Invalid Coins',400));
    const coupon=await couponModel.findOne(
        {name:couponName,couponExpiresAt:{$gt:Date.now()}});
    if(!coupon){
        return next(new apiError('coupon not found',400));
    };
    const discount=Math.floor( ( coupon.discount / 100 ) * coins );
    coins= coins - discount;
    res.status(200).json({ coins });
});


const generateLessonCode=expressHandler(async(req,res,next)=>{
    if(req.body.lesson) return next(new apiError('lesson is required',400));
    const user=await userModel.findOne({_id:req.user._id});
    const lesson=await lessonModel.findOne({_id:req.body.lesson,isPublished:true});
    if( ! lesson ){
        return next(new apiError('Not Found',400));
    };
    const coins= req.body.coins || 0 ;  // coins after apply coupon
    const lessonPrice = lesson.price - coins; // price of the lesson with coins
    const diff= user.coins - lessonPrice;
    if(diff < 0){
        return next(new apiError('you don not have enough coins',400));
    };
    user.coins -= lessonPrice;
    req.body.user=req.user._id;
    req.body.code=randomCode();
    req.body.type='lesson';
    const code=await codeModel.create(req.body);
    if(!code){
        user.coins += lessonPrice;
        await user.save();
        res.status(200).json({status:"try again"});
    };
    await user.save();
    res.status(200).json({code})
});

const generateQuizCode=expressHandler(async(req,res,next)=>{
    if(req.body.quiz) return next(new apiError('quiz is required',400));
    const user=await userModel.findOne({_id:req.user._id});
    const quiz=await quizModel.findOne({_id:req.body.quiz,isPublished:true});
    if( ! quiz ){
        return next(new apiError('Not Found',400));
    };
    const coins=req.body.coins || 0;
    const quizPrice = quiz.price - coins;
    const diff=user.coins - quizPrice;
    if(diff < 0){
        return next(new apiError('you don not have enough coins',400));
    };
    user.coins -= quizPrice;
    req.body.user=req.user._id;
    req.body.code=randomCode();
    req.body.type='quiz';
    const code=await codeModel.create(req.body);
    if(!code){
        user.coins += quizPrice;
        await user.save();
        return res.status(200).json({status:"try again"});
    };
    await user.save();
    res.status(200).json({code})
});

module.exports={generateQuizCode,generateLessonCode,applyCoinCoupon};