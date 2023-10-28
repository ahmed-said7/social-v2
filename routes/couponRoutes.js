const {deleteCoupon,createCoupon,
    updateCoupon,getCoupons,getCoupon}=require('../services/couponServices');

const {createCouponValidator,updateCouponValidator,ValidateIdParam}=
require('../validator/couponValidator');

const express= require('express');
const router =express.Router();
const { protected , allowedTo } = require('../services/authServices');

router.use(protected,allowedTo('admin'));
router.route('/').post(createCoupon).get(getCoupons);
router.route('/:id').patch(updateCoupon).get(getCoupon).delete(deleteCoupon);
module.exports=router;