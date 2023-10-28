const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');

const createStoryValidator=[
    check('text').optional().isString().withMessage('text should be a string'),
    check('image').optional().isString().withMessage('image should be a string'),
    check('video').optional().isString().withMessage('video should be a string'),
    check('reel').optional().isBoolean().withMessage('reel should be a boolean')
    ,validationResult
];

const updateStoryValidator=[
    check('text').optional().isString().withMessage('text should be a string'),
    check('image').optional().isString().withMessage('image should be a string'),
    check('video').optional().isString().withMessage('video should be a string')
    ,validationResult
];

const voteStoryValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('type').notEmpty().withMessage('type is required').
    isNumeric().withMessage('type should be a numeric')
    ,validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];

module.exports={ValidateIdParam,voteStoryValidator,
    createStoryValidator,updateStoryValidator};