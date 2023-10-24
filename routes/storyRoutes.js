const express= require('express');
const router =express.Router();
const {protected,allowedTo}=require('../services/authServices');
const {uploadSingleVideo,uploadSingleImage,resizeSingleFile} =require("../middlewares/imageMiddleware");
const { accessStory,createStory,
    getFollowingStories,getUserStories,
    getAllStories,getStory,updateStory,deleteStory }=require('../services/storyServices');

router.use(protected);

router.route('/').post(
    uploadSingleVideo('video'),uploadSingleImage('image')
    ,resizeSingleFile('story',"image"),createStory)
    .get(getAllStories);

router.route('/:id').get(getStory)
    .patch(accessStory,uploadSingleVideo('video'),
    uploadSingleImage('image'),resizeSingleFile('story',"image"),updateStory)
    .delete(accessStory,deleteStory);

router.route('/stories/:id').post(getUserStories);
router.route('/following-stories').post(getFollowingStories);

module.exports = router;