const apiError = require("../utils/apiError");
const expressHandler=require('express-async-handler');
const firstStep = require("../utils/session");
const userModel = require("../models/userModel");
const createHash = require("../utils/hmac");
const couponModel = require("../models/couponModel");

const buyCoin= expressHandler ( async(req,res,next) => {
    const user=req.user;
    const {coin,price}=req.body;
    if(price == 0){
        const index=req.user.transaction.length;
        req.user.transaction[index].amount=coin;
        req.user.transaction[index].paid=true;
        req.user.transaction[index].time=Date.now();
        req.user.coins += user.transaction[index].amount;
        await req.user.save();
        return res.status(200).json({status: 'success'});
    };
    const result=await firstStep(user , price*100);
    user.transaction.push({amount:coin,paid:false,orderId:result.id,time:Date.now()});
    await user.save();
    res.status(200).json({user,result});
});

const applyCoupon= expressHandler ( async(req,res,next) => {
    const {price,couponName}=req.body;
    const coupon=await couponModel.findOne(
        {name:couponName,couponExpiresAt:{$gt:Date.now()}});
    if(!coupon){
        return next(new apiError('coupon not found',400));
    };
    const discount=Math.floor((coupon.discount/100)*price);
    price=price-discount;
    res.status(200).json({ price });
});

const coinWebhook= expressHandler ( async (req,res,next) => {
    const result=createHash(req);
    if ( result.hashed == req.query.hmac ){
        const id= result.order_id;
        const data=req.body.obj.payment_key_claims.billing_data;
        const email=data.email;
        let user=await userModel.findOne({email:email});
        const index=user.transaction.findIndex((ele)=> ele.orderId == id);
        if(index > -1){
            user.transaction[index].paid=true;
            user.transaction[index].time=Date.now();
            user.coins += user.transaction[index].amount;
        };
        await user.save();
    } else {
        return next( new apiError('payment failed') , 400 );
    };
});

const successPage=expressHandler(async(req,res,next)=>{
    res.render('success');
});

module.exports={ buyCoin , coinWebhook , successPage,applyCoupon };