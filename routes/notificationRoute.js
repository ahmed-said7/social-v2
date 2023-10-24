const { 
    getNotifications,createNotification,deleteNotification,
    accessNotification
}=require('../services/notificationServices');
const express= require('express');
const router =express.Router();
const {protected,allowedTo} = require('../services/authServices');


router.use(protected);
router.route('/').post(createNotification).get(getNotifications);
router.route('/:id').delete(accessNotification,deleteNotification)
module.exports=router;