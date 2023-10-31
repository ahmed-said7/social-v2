const express= require('express');
const router =express.Router();

const {ValidateIdParam,voteStoryValidator,
    createStoryValidator,updateStoryValidator}=
    require('../validator/storyValidator');

const {protected,allowedTo}=require('../services/authServices');
const {uploadSingleVideo,uploadSingleImage,resizeSingleFile} =require("../middlewares/imageMiddleware");
const { accessStory,createStory,getLoggedUserStories,
    getFollowingStories,getLoggedUserReels,setRequestParam,
    getUserStories,voteStory,unvoteStory,streamStoryVideo,
    getAllStories,getStory,updateStory,deleteStory }=require('../services/storyServices');


router.use(protected);

router.route('/').post(
    uploadSingleVideo('video')
    // ,uploadSingleImage('image'),resizeSingleFile('story',"image")
    ,createStory)
    .get(setRequestParam,getAllStories);

router.route('/:id').get(getStory)
    .patch(accessStory,uploadSingleVideo('video'),
    updateStory)
    .delete(accessStory,deleteStory);

router.route('/stories/:id').get(getUserStories);
router.route('/following-stories').get(getFollowingStories);
router.route('/vote/:id').patch(voteStory);
router.route('/unvote/:id').patch(unvoteStory);
router.route('/stories').get(getLoggedUserStories);
router.route('/reels').get(getLoggedUserReels);
router.route('/stream-video/:id').get(streamStoryVideo);

module.exports = router;