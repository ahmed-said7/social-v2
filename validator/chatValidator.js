const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');
const userModel=require('../models/userModel');

const createChatValidator=[
    check('members').notEmpty().withMessage('members is required')
    .isArray().withMessage('members should be an array')
    .custom( async (val,{req}) => {
        const len=(await userModel.find({_id:{$in:val}})).length;
        if(len != val.length) return Promise.reject('members not found');
        return true;
    }),
    check('name').notEmpty().withMessage('name is required')
    .isString().withMessage('name should be string'),
    check('image').optional()
    .isString().withMessage('image should be string'),validationResult
];

const updateChatValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('name').optional()
    .isString().withMessage('name should be string'),
    check('image').optional()
    .isString().withMessage('image should be string'),validationResult
];

const addMemberValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('user').notEmpty().withMessage('user is required')
    .isMongoId().withMessage('name should be string').custom( async(val,{req}) =>{
        const user = await userModel.findOne({_id:val});
        if(!user) return Promise.reject(new Error('User not found'));
        return true;
    }),validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    validationResult
];

module.exports = {createChatValidator,updateChatValidator,
    ValidateIdParam,addMemberValidator};