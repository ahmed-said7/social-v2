const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');
const groupModel=require('../models/groupModel');

const createPostValidator=[
    check('text').optional()
    .isString().withMessage('title should be a string'),
    check('images').optional().
    isArray().withMessage('image should be array'),
    check('group').notEmpty().withMessage('group should not be empty').
    isMongoId().withMessage('group should be a mongo Id').custom( async(val,{req}) =>{
        const group=await groupModel.findById(val);
        if(!group) return Promise.reject(new Error('Group not found'));
        return true;
    } ),validationResult
];

const updatePostValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('text').optional()
    .isString().withMessage('title should be a string'),
    check('images').optional().
    isArray().withMessage('image should be array')
    ,validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];

module.exports = {createPostValidator,updatePostValidator,ValidateIdParam};