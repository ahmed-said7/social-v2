const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');
const quizModel=require('../models/userModel');

const createQuestionValidator=[
    check('answers').notEmpty().withMessage('answers is required')
    .isArray().withMessage('answers should be an array'),
    check('correctAnswer').notEmpty().withMessage('correctAnswer is required')
    .isString().withMessage('correctAnswer should be string'),
    check('question').notEmpty().withMessage('question is required')
    .isString().withMessage('question should be string'),
    check('quiz').notEmpty().withMessage('quiz is required')
    .isMongoId().withMessage('quiz should be mongo id').
    custom( async(val,{req}) =>{
        const quiz = await quizModel.findOne({_id:val});
        if(!quiz) return Promise.reject(new Error('quiz not found'));
        return true;
    }),validationResult
];

const updateQuestionValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('answers').optional()
    .isArray().withMessage('answers should be an array'),
    check('correctAnswer').optional()
    .isString().withMessage('correctAnswer should be string'),
    check('question').optional()
    .isString().withMessage('question should be string'),
    check('quiz').optional()
    .isMongoId().withMessage('quiz should be mongo id').
    custom( async(val,{req}) =>{
        const quiz = await quizModel.findOne({_id:val});
        if(!quiz) return Promise.reject(new Error('quiz not found'));
        return true;
    }),validationResult
];



const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];

module.exports = {createQuestionValidator,updateQuestionValidator,ValidateIdParam};