const express= require('express');
const router =express.Router();

const {protected,allowedTo}=require('../services/authServices');
const {
    accessGroup,createGroup,getGroups,
    getGroup,updateGroup,deleteGroup,
    getUserGroups,acceptRequest,
    cancelRequest,requestToJoin,
    changeGroupAdmin,getGroupMembers,
    setFilterObj,leaveGroup,
    accessGroupPost
    }=require('../services/groupServices');
const { uploadSingleImage,resizeSingleFile } = require('../middlewares/imageMiddleware');
const postRouter=require('./postRoute');

router.use(protected);
router.route('/')
    .post(uploadSingleImage('image'),resizeSingleFile('group',"image"),createGroup)
    .get(setFilterObj,getGroups);

router.route('/:id').get(getGroup)
    .patch(accessGroup,uploadSingleImage('image'),
    resizeSingleFile('group',"image"),updateGroup)
    .delete(accessGroup,deleteGroup);

router.route('/my-groups').get(getUserGroups);
router.route('/accept-request/:id').patch(accessGroup,acceptRequest);
router.route('/cancel-request/:id').patch(cancelRequest);
router.route('/join-request/:id').patch(requestToJoin);
router.route('/change-admin/:id').patch(accessGroup,changeGroupAdmin);
router.route('/leave-group/:id').patch(leaveGroup);
router.route('/members/:id').get(getGroupMembers);
router.use(accessGroupPost);
router.use("/:groupId/posts",postRouter)

module.exports = router;