const expressHandler=require('express-async-handler');
const apiError = require('../utils/apiError');
const{updateOne,deleteOne,getAll}=require('../utils/apiFactory');
const questionModel = require('../models/questionModel');
const lessonModel = require('../models/lessonModel');
const quizModel = require('../models/quizModel');
const resultModel = require('../models/resultModel');
const codeModel = require('../models/codeModel');



const setFilterObject = expressHandler(async(req,res,next)=>{
    req.filterObj={};
    if( req.user.role == 'instractor' ){
        req.filterObj.admin= req.user._id;
    }else if( req.user.role == 'student' ){
        req.query.select= "title";
        req.query.isPublished= true;
    }else if ( req.user.role == 'admin' ){
        req.query.select= "title,isPublished";
    };
});

const createQuiz=expressHandler(async(req,res,next)=>{
    req.body.admin=req.user._id;
    const quiz=await quizModel.create(req.body);
    if(!quiz){
        return next(new apiError('can not create a new quiz',400));
    };
    res.status(200).json({result:lesson});
});

const deleteQuiz=deleteOne(quizModel);
const updateQuiz=updateOne(quizModel);
const getAllQuizzes=getAll(quizModel,'quiz',{path:"admin",select:"name profile"});

const accessQuiz=expressHandler(async(req,res,next)=>{
    const quiz=await quizModel.findById(req.params.id);
    if( quiz?.admin.toString() != req.user._id.toString() ){
        return next(new apiError('you are not quiz owner',400));
    };
    return next();
});

const publishQuiz=expressHandler(async(req,res,next)=>{
    const quiz=await quizModel.findByIdAndUpdate(req.params.id,
        {isPublished:true},{new:true});
    if(!quiz){
        return next(new apiError('No quiz found',400));
    };
    res.status(200).json({quiz});
});

const unpublishQuiz=expressHandler(async(req,res,next)=>{
    const quiz=await quizModel.findByIdAndUpdate(req.params.id,
        {isPublished:false},{new:true});
    if(!quiz){
        return next(new apiError('No quiz found',400));
    };
    res.status(200).json({quiz});
});

const getQuiz=expressHandler(async(req,res,next)=>{
    const quiz=await quizModel.findById(req.params.id);
    const admin=req.user._id;
    if(!quiz){
        return next(new apiError('No quiz found',400));
    };
    await quiz.populate([{path:"admin",select:"name profile"},{path:'questions'}]);
    let result={... quiz};
    if(req.user._id.toString() == admin.toString() ){
        return res.status(200).json({quiz:result});
    };
    result.questions.forEach((ele)=>{
        delete ele.correctAnswer;
    });
    return res.status(200).json({quiz:result});
});

const matchAnswers=expressHandler(async(req,res,next)=>{
    const valid=req.user.quizzesTaken.some(
        ({quiz})=>quiz.toString() == req.params.id.toString());
    if(!valid){
        return next(new apiError('Invalid id',400));
    };
    const answers=req.body.answers || [];
    if(answers.length == 0){
        return next(new apiError('answers is required',400));
    };
    //  answers => [{answer,questionId}]
    const quiz=await quizModel.findById(req.params.id);
    if(!quiz || ! quiz.isPublished){
        return next(new apiError('can not get a quiz',400));
    };
    await quiz.populate([{path:"admin",select:"name profile"},{path:'questions'}]);
    const form=quiz.questions.map( 
        ({_id,correctAnswer})=> { _id , correctAnswer});
    const Obj={wrongAnswers:[],score:0,mistake:0};
    form.forEach(({_id,correctAnswer}) => {
        const element=answers.find( 
            ({questionId,answer}) => questionId.toString() == _id.toString() );
        if(! element) {
            Obj.wrongAnswers.push({question:_id});
            Obj.mistake +=1;
        }else if( element.answer == correctAnswer ){
            Obj.score +=1;
        }else if( element.answer != correctAnswer){
            Obj.wrongAnswers.push({question:_id,answer:element.answer});
            Obj.mistake +=1;
        };
    });
    const response=await resultModel.create({...Obj,quiz:req.params.id,user:req.user._id});
    return res.status(200).json({quiz:response});
});

const takeQuiz=expressHandler(async(req,res,next)=>{
    let user=req.user;
    const {code}=req.body;
    if(! code) return next(new apiError('Invalid code',400));
    const quiz=await quizModel.findById(req.params.id);
    if(!quiz || ! quiz.isPublished){
        return next(new apiError('can not get a new lesson',400));
    };
    await quiz.populate([{path:"admin",select:"name profile"},{path:'questions'}]);
    const accessCode=await codeModel.findOne({code,quiz:req.params.id});
    if(!accessCode){
        return next(new apiError('access code not found',400));
    };
    if(accessCode.consumed){
        return next(new apiError("access code consumed",400));
    };
    if( accessCode.user.toString() != req.user._id.toString()){
        return next(new apiError("can not take quiz",400));
    };
    accessCode.consumed=true;
    accessCode.counter =1;
    await accessCode.save();
    const index=user.quizzesTaken.findIndex(
        (ele) => ele.quiz.toString() == req.params.id.toString() );
    if(index > -1){
        return res.status(200).json({message:"You have taken quiz before"});
    }else {
        user.attendedLessons.push({quiz:req.params.id,takenAt:Date.now()});
    };
    await user.save();
    let result={... quiz};
    result.questions.forEach( (ele)=>{
        delete ele.correctAnswer;
    });
    return res.status(200).json({quiz:result});
});

module.exports={takeQuiz,matchAnswers,getQuiz,unpublishQuiz,publishQuiz,
accessQuiz,updateQuiz,deleteQuiz,getAllQuizzes,setFilterObject,createQuiz};