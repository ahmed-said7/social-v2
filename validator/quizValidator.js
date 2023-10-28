const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');

const createQuizValidator=[
    check('title').notEmpty().withMessage('title is required')
    .isString().withMessage('title should be a string'),
    check('price').notEmpty().withMessage('title is required').
    isString().withMessage('image should be a string'),
    check('level').optional().
    isString().withMessage('level should be a string')
    ,validationResult
];

const updateQuizValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('title').optional()
    .isString().withMessage('title should be a string'),
    check('price').optional().
    isString().withMessage('image should be a string'),
    check('level').optional().
    isString().withMessage('level should be a string')
    ,validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];

module.exports = {createQuizValidator,updateQuizValidator,ValidateIdParam};