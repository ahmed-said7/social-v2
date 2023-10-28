const {accessCreateQuestion,updateQuestion,
deleteQuestion,createQuestion,
accessQuestion}=require('../services/questionServices');

const {createQuestionValidator,updateQuestionValidator,ValidateIdParam}=
require('../validator/questionValidator');

const express= require('express');
const router =express.Router();
const { protected , allowedTo } = require('../services/authServices');

router.use(protected);
router.route('/').post(accessCreateQuestion,createQuestion);
router.route('/:id').patch(accessQuestion,updateQuestion)
    .delete(accessQuestion,deleteQuestion);
module.exports=router;