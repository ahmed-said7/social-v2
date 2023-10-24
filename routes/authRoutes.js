const {uploadMultipleImage,resizeMultipleFiles} =require('../middlewares/imageMiddleware');

const express= require('express');
const router =express.Router();
const {
    login,signup,getLoggedUser,updateLoggedUserPassword,deleteLoggedUser,
    updateLoggedUser,protected,allowedTo
    ,forgetPassword,resetCodeVertify,changePassword} = require('../services/authServices');

router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/forget-pass').post(forgetPassword)
router.route('/vertify-code').post(resetCodeVertify)
router.route('/change-pass').post(changePassword);
router.use(protected);
router.route('/get-me').get(getLoggedUser);
router.route('/update-me').patch(uploadMultipleImage([{name:"cover",maxCount:4},{name:"profile",maxCount:1}])
,resizeMultipleFiles('user',"cover","profile"),updateLoggedUser);
router.route('/delete-me').delete(deleteLoggedUser);
router.route('/update-pass').patch(updateLoggedUserPassword)


module.exports = router;