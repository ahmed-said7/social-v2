const {uploadMultipleImage,resizeMultipleFiles} =require('../middlewares/imageMiddleware');
const express= require('express');
const router =express.Router();
const {protected,allowedTo} = require('../services/authServices');
const {
    addFriend,getProfile,cancelRequest,
    deleteRequest,addToSearch,removeFromSearch,removeFollwer,
    followBack,unfollow,follow,acceptRequest,unFriend
    ,getUsers,createUser,updateUser,deleteUser,updateUserPassword
} = require('../services/userServices');

router.use(protected);
router.route('/add-friend/:id').patch(addFriend);
router.route('/cancel-request/:id').patch(cancelRequest);
router.route('/delete-request/:id').patch(deleteRequest);
router.route('/add-to-search/:id').patch(addToSearch);
router.route('/remove-from-search/:id').patch(removeFromSearch);
router.route('/remove-follower/:id').patch(removeFollwer);
router.route('/follow-back/:id').patch(followBack);
router.route('/follow/:id').patch(follow);
router.route('/unfollow/:id').patch(unfollow);
router.route('/accept-request/:id').patch(acceptRequest);
router.route('/get-profile/:id').patch(getProfile);
router.route('/unfriend/:id').patch(unFriend);
router.route('/').get(getUsers).
    post(uploadMultipleImage([{name:"cover",maxCount:4},{name:"profile",maxCount:1}])
    ,resizeMultipleFiles('message',"cover","profile"),createUser);
router.route('/:id')
    .patch(uploadMultipleImage([{name:"cover",maxCount:4},{name:"profile",maxCount:1}])
    ,resizeMultipleFiles('user',"cover","profile"),updateUser)
    .delete(deleteUser);
router.route('/update-pass/:id').patch(updateUserPassword);

module.exports = router;