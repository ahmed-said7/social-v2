const reviewModel=require('../models/reviewModel');
const{getAll,updateOne,deleteOne,getOne,createOne}=require('../utils/apiFactory');

const expressHandler=require('express-async-handler');
const createReview=createOne(reviewModel);
const deleteReview=deleteOne(reviewModel);
const updateReview=updateOne(reviewModel);
const getReview=getOne(reviewModel);
const getReviews=getAll(reviewModel);

const setFilterObjectLesson=expressHandler(async(req,res,next)=>{
    req.filterObj={};
    if(req.params.lessonId){
        req.filterObj.lesson=req.params.lessonId;
    };
    return next();
});

const setFilterObjectQuiz=expressHandler(async(req,res,next)=>{
    req.filterObj={};
    if(req.params.quizId){
        req.filterObj.quiz=req.params.quizId;
    };
    return next();
});

const accessReview=expressHandler(async(req,res,next)=>{
    const review=await reviewModel.findById(req.params.id);
    if( review?.user.toString() != req.user._id.toString() ){
        return next(new apiError('you are not review owner',400));
    };
    return next();
});

const setUserId=expressHandler(async(req,res,next)=>{
    req.body.user=req.user._id;
    return next();
});

module.exports={
    accessReview,setFilterObjectLesson,setFilterObjectQuiz,deleteReview,
    updateReview,getReview,getReviews,setUserId,createReview
};