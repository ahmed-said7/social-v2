const lessonModel = require("../models/lessonModel");
const quizModel = require("../models/quizModel");
const { check }=require('express-validator');
const validationResult=require('../middlewares/validationResult');

const createReviewValidator=[
    check('stars').notEmpty().withMessage('stars is required')
    .isNumeric().withMessage('stars should be an array'),
    check('text').optional()
    .isString().withMessage('text should be string'),
    check('quiz').optional()
    .isMongoId().withMessage('quiz should be mongo id').
    custom( async(val,{req}) =>{
        const quiz = await quizModel.findOne({_id:val});
        if(!quiz) return Promise.reject(new Error('quiz not found'));
        return true;
    }),
    check('lesson').optional()
    .isMongoId().withMessage('lesson should be mongo id').
    custom( async(val,{req}) =>{
        const lesson = await lessonModel.findOne({_id:val});
        if(! lesson) return Promise.reject(new Error('lesson not found'));
        return true;
    }),validationResult
];

const updateReviewValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('stars').optional()
    .isNumeric().withMessage('stars should be an array'),
    check('text').optional()
    .isString().withMessage('text should be string'),
    check('quiz').optional()
    .isMongoId().withMessage('quiz should be mongo id').
    custom( async(val,{req}) =>{
        const quiz = await quizModel.findOne({_id:val});
        if(!quiz) return Promise.reject(new Error('quiz not found'));
        return true;
    }),
    check('lesson').optional()
    .isMongoId().withMessage('lesson should be mongo id').
    custom( async(val,{req}) =>{
        const lesson = await lessonModel.findOne({_id:val});
        if(! lesson) return Promise.reject(new Error('lesson not found'));
        return true;
    }),validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];
module.exports={createReviewValidator,updateReviewValidator,ValidateIdParam};