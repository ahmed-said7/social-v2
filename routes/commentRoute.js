const express= require('express');
const router =express.Router({mergeParams:true});
const {uploadSingleImage,resizeSingleFile} =require('../middlewares/imageMiddleware');
const {protected,allowedTo} = require('../services/authServices');

const {createCommentValidator,updateCommentValidator
    ,ValidateIdParam}=require('../validator/commentValidator');

const { createComment,getComments,
    getComment,deleteComment,
    updateComment,accessComment,setFilterObject
    ,setUserId, getCommentLikes } = require('../services/commentServices');

router.use(protected);
router.route('/')
    .post(uploadSingleImage('image'),resizeSingleFile('comment',"image"),setUserId,createComment)
    .get(setFilterObject,getComments);

router.route('/:id')
    .patch(accessComment,uploadSingleImage('image'),resizeSingleFile('comment',"image"), updateComment)
    .delete(accessComment,deleteComment)
    .get(getComment);

router.route('/likes/:id').get(getCommentLikes);

module.exports=router;