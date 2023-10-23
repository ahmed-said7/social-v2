const express= require('express');
const router =express.Router();
const {protected,allowedTo} = require('../services/authServices');
const { likePost,likeComment,unlikeComment,unlikePost }=require('../services/likeServices');

router.use(protected);
router.route('/like-post/:id').post(likePost);
router.route('/unlike-post/:id').post(unlikePost);
router.route('/like-comment/:id').post(likeComment);
router.route('/unlike-comment/:id').post(unlikeComment);
module.exports=router;