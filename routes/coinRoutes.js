const express= require('express');
const router =express.Router();
const { protected , allowedTo } = require('./services/authServices');
const { buyCoin,applyCoupon }=require('./services/coinServices');

router.use(protected);
router.route('/buy').post(buyCoin);
router.route('/apply-coupon').post(applyCoupon);

module.exports=router;