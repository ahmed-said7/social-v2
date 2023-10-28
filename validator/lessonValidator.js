const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');

const createLessonValidator=[
    check('title').notEmpty().withMessage('title is required')
    .isString().withMessage('title should be a string'),
    check('price').notEmpty().withMessage('price is required').
    isNumeric().withMessage('price should be a number'),
    check('level').optional().
    isString().withMessage('level should be a string'),
    check('notes').optional().
    isString().withMessage('notes should be a string')
    ,validationResult
];

const updateLessonValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('title').optional()
    .isString().withMessage('title should be a string'),
    check('price').optional().
    isNumeric().withMessage('price should be a number'),
    check('notes').optional().
    isString().withMessage('notes should be a string'),
    check('level').optional().
    isString().withMessage('level should be a string')
    ,validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];

module.exports = {createLessonValidator,updateLessonValidator,ValidateIdParam};