const express= require('express');
const router =express.Router();
const {protected,allowedTo} = require('../services/authServices');
const { likePost,likeComment,unlikeComment,unlikePost,likeReel,unlikeReel }=require('../services/likeServices');
const {addLikeValidator,ValidateIdParam}=require('../validator/likeValidator');


router.use(protected);
router.route('/like-post/:id').post(likePost);
router.route('/unlike-post/:id').post(unlikePost);
router.route('/like-comment/:id').post(likeComment);
router.route('/unlike-comment/:id').post(unlikeComment);
router.route('/like-reel/:id').post(likeReel);
router.route('/unlike-reel/:id').post(unlikeReel);
module.exports=router;