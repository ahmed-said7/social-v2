const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');


const createJopValidator=[
    check('experience').optional()
    .isString().withMessage('experience should be string'),
    check('salary').optional()
    .isNumeric().withMessage('salary should be number'),
    check('title').optional()
    .isString().withMessage('title should be string'),
    check('requirements').optional()
    .isString().withMessage('requirements should be string'),
    check('company').optional()
    .isString().withMessage('company should be string'),
    check('qualification').optional()
    .isString().withMessage('qualification should be string'),
    check('workingDetails').optional()
    .isString().withMessage('working detais should be string'),
    check('image').optional()
    .isString().withMessage('image detais should be string')
    ,validationResult
];

const updateJopValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('experience').optional()
    .isString().withMessage('experience should be string'),
    check('salary').optional()
    .isNumeric().withMessage('salary should be number'),
    check('title').optional()
    .isString().withMessage('title should be string'),
    check('requirements').optional()
    .isString().withMessage('requirements should be string'),
    check('company').optional()
    .isString().withMessage('company should be string'),
    check('qualification').optional()
    .isString().withMessage('qualification should be string'),
    check('workingDetails').optional()
    .isString().withMessage('working detais should be string'),
    check('image').optional()
    .isString().withMessage('image detais should be string')
    ,validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];

module.exports = {createJopValidator,updateJopValidator,ValidateIdParam};