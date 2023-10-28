const couponModel=require('../models/couponModel');
const{getAll,updateOne,deleteOne,getOne,createOne}=require('../utils/apiFactory');

const deleteCoupon=deleteOne(couponModel);
const createCoupon=createOne(couponModel);
const updateCoupon=updateOne(couponModel);
const getCoupon=getOne(couponModel);
const getCoupons=getAll(couponModel);

module.exports={deleteCoupon,createCoupon,updateCoupon,getCoupons,getCoupon};