const {takeQuiz,matchAnswers,getQuiz,unpublishQuiz,publishQuiz,
    accessQuiz,updateQuiz,
    deleteQuiz,getAllQuizzes,setFilterObject,
    createQuiz}=require('../services/quizServices');

const {createQuizValidator,updateQuizValidator,ValidateIdParam}
    =require('../validator/quizValidator')

const express= require('express');
const router =express.Router();
const reviewRouter=require('../routes/reviewRoutes');
const { protected , allowedTo } = require('../services/authServices');
    
router.use(protected);
router.route('/').post(accessQuiz,createQuiz).get(setFilterObject,getAllQuizzes);
router.route('/:id').patch(accessQuiz,updateQuiz)
        .delete(accessQuiz,deleteQuiz).get(getQuiz);

// router.use('/:quizId/quiz',reviewRouter);
router.route('/publish/:id').patch(accessQuiz,publishQuiz)
router.route('/unpublish/:id').patch(accessQuiz,unpublishQuiz)
router.route('/take-quiz/:id').post(takeQuiz);
router.route('/match-answer/:id').post(matchAnswers);


module.exports=router;