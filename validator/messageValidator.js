const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');
const chatModel=require('../models/chatModel');

const createMessageValidator=[
    check('text').optional()
    .isString().withMessage('title should be a string'),
    check('images').optional().
    isArray().withMessage('image should be array'),
    check('chat').notEmpty().withMessage('chat should not be empty').
    isMongoId().withMessage('group should be a mongo Id').custom( async(val,{req}) =>{
        const chat=await chatModel.findById(val);
        if(!chat) return Promise.reject(new Error('chat not found'));
        return true;
    } ),validationResult
];

const updateMessageValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('text').optional()
    .isString().withMessage('title should be a string'),
    check('images').optional().
    isArray().withMessage('image should be array'),validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];

module.exports = {createMessageValidator,updateMessageValidator,ValidateIdParam};