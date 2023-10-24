const apiError = require("../utils/apiError");
const expressHandler=require('express-async-handler');
const firstStep = require("../utils/session");
const userModel = require("../models/userModel");
const createHash = require("../utils/hmac");

const buyCoin= expressHandler ( async(req,res,next) => {
    const user=req.user;
    const {coin,price}=req.body;
    const result=await firstStep(user , coin*price*100);
    user.transaction.push({amount:coin,paid:false,orderId:result.id});
    await user.save();
    res.status(200).json({user,result});
});


const coinWebhook= expressHandler ( async (req,res,next) => {
    const result=createHash(req);
    if ( result.hashed == req.query.hmac){
        const id= result.order_id;
        const data=req.body.obj.payment_key_claims.billing_data;
        const email=data.email;
        let user=await userModel.findOne({email:email});
        const index=user.transaction.findIndex((ele)=> ele.orderId == id);
        if(index > -1){
            user.transaction[index].paid=true;
            user.coins += user.transaction[index].amount;
        };
        await user.save();
    } else {
        return next(new apiError('payment failed'),400);
    };
});

const successPage=expressHandler(async(req,res,next)=>{
    res.render('success');
});

module.exports={ buyCoin , coinWebhook , successPage };