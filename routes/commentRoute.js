const express= require('express');
const router =express.Router({mergeParams:true});
const {uploadSingleImage,resizeSingleFile} =require('../middlewares/imageMiddleware');
const {protected,allowedTo} = require('../services/authServices');
const { createComment,getComments,
    getComment,deleteComment,
    updateComment,accessComment,setFilterObject,setUserId } = require('../services/commentServices');

router.use(protected);
router.route('/')
    .post(uploadSingleImage('image'),resizeSingleFile('comment',"image"),setUserId,createComment)
    .get(setFilterObject,getComments);
router.route('/:id')
    .patch(accessComment,uploadSingleImage('image'),resizeSingleFile('comment',"image"), updateComment)
    .delete(accessComment,deleteComment)
    .get(getComment);

module.exports=router;