const express= require('express');
const router =express.Router();

const {protected,allowedTo}=require('../services/authServices');
const {
    accessGroup,createGroup,getGroups,getGroup,updateGroup,deleteGroup,
    getUserGroups
}=require('../services/groupServices');
const { uploadSingleImage,resizeSingleFile } = require('../middlewares/imageMiddleware');

router.use(protected);
router.route('/').post(uploadSingleImage('image'),
    resizeSingleFile('group',"image"),createGroup).get(getGroups);
router.route('/:id').get(getGroup)
    .patch(accessGroup,uploadSingleImage('image'),
    resizeSingleFile('group',"image"),updateGroup)
    .delete(accessGroup,deleteGroup);

router.route('/my-groups').post(getUserGroups)

module.exports = router;