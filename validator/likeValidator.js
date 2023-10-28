const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');

const addLikeValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('type').notEmpty().withMessage('type is required')
    .isString().withMessage('type should be a string')
    ,validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];

module.exports = {addLikeValidator,ValidateIdParam};