const { accessReview,setFilterObjectLesson,setFilterObjectQuiz,deleteReview,
    updateReview,getReview,getReviews,setUserId,createReview }=require('../services/reviewServices');

const {createReviewValidator,updateReviewValidator,ValidateIdParam}
    =require('../validator/reviewValidator');

const express= require('express');
const router =express.Router({mergeParams:true});
const { protected , allowedTo } = require('../services/authServices');
    
router.use(protected);
router.route('/').post(setUserId,createReview);
router.route('/lesson/:lessonId').get(setFilterObjectLesson,getReviews);
router.route('/quiz/:quizId').get(setFilterObjectQuiz,getReviews);
router.route('/:id').patch(accessReview,updateReview)
    .get(accessReview,getReview).delete(accessReview,deleteReview);
module.exports=router;