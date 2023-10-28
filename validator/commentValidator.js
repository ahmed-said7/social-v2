const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');
const postModel=require('../models/postModel');

const createCommentValidator=[
    check('text').optional()
    .isString().withMessage('title should be a string'),
    check('image').optional().
    isString().withMessage('image should be string'),
    check('chat').notEmpty().withMessage('group should not be empty').
    isMongoId().withMessage('chat should be a mongo Id').custom( async(val,{req}) =>{
        const post=await postModel.findById(val);
        if(!post) return Promise.reject(new Error('post not found'));
        return true;
    } ),validationResult
];

const updateCommentValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('text').optional()
    .isString().withMessage('title should be a string'),
    // check('image').optional().isString().withMessage('image should be a string')
    // ,
    validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];

module.exports = {createCommentValidator,updateCommentValidator,ValidateIdParam};