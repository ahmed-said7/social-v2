const expressHandler=require('express-async-handler');
const apiError = require('../utils/apiError');
const{updateOne,deleteOne,createOne}=require('../utils/apiFactory');
const questionModel = require('../models/questionModel');
const lessonModel = require('../models/lessonModel');
const quizModel = require('../models/quizModel');

const createQuestion=createOne(questionModel);
const accessQuestion=expressHandler(async(req,res,next)=>{
    const question=await questionModel.findById(req.params.id);
    req.body.quiz=question?.quiz;
    const quiz=await quizModel.findById(req.body.quiz);
    if( quiz?.admin.toString() != req.user._id.toString() ){
        return next(new apiError('Not found',400));
    };
    return next();
});
const accessCreateQuestion=expressHandler(async(req,res,next)=>{
    const quiz=await quizModel.findById(req.body.quiz);
    if( quiz?.admin.toString() != req.user._id.toString() ){
        return next(new apiError('Not found',400));
    };
    return next();
});

const updateQuestion=updateOne(questionModel);
const deleteQuestion=deleteOne(questionModel);



module.exports={accessCreateQuestion,updateQuestion,
    deleteQuestion,createQuestion,accessQuestion};