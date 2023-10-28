const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');
const couponModel=require('../models/couponModel');

const createCouponValidator=[
    check('discount').notEmpty().withMessage('discount is required')
    .isNumeric().withMessage('discount should be number'),
    check('couponExpiresAt').optional().
    isDate().withMessage('couponExpiresAt should be date'),
    check('name').notEmpty().withMessage('name should not be empty').
    isMongoId().withMessage('group should be a mongo Id')
    .custom( async(val,{req}) =>{
        const coupon=await couponModel.findOne({name:val});
        if(!coupon) return Promise.reject(new Error('coupon found'));
        return true;
    } ),validationResult
];

const updateCouponValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('discount').optional()
    .isNumeric().withMessage('discount should be number'),
    check('couponExpiresAt').optional().
    isDate().withMessage('couponExpiresAt should be date'),
    check('name').optional().
    isMongoId().withMessage('group should be a mongo Id')
    .custom( async(val,{req}) =>{
        const coupon=await couponModel.findOne({name:val});
        if(coupon) return Promise.reject(new Error('coupon  found'));
        return true;
    } ),validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];


module.exports = {createCouponValidator,updateCouponValidator,ValidateIdParam};