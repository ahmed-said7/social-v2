const express= require('express');
const router =express.Router({mergeParams:true});
const {protected,allowedTo} = require('../services/authServices');
const { accessMessage,createMessage,accessReadMessages,setFilterObject,
    deleteMessage,updateMessage,getMessage,getMessages }
    =require('../services/messageServices');

const {uploadMultipleImage,resizeMultipleFiles} =require('../middlewares/imageMiddleware');

router.use(protected);
router.route('/').
    post(uploadMultipleImage([{name:"images",maxCount:10}])
    ,resizeMultipleFiles('message',"images",undefined),createMessage)
    .get(setFilterObject,getMessages);
router.route('/:id')
    .get(accessReadMessages,getMessage)
    .delete(accessMessage,deleteMessage).
    patch(accessMessage,uploadMultipleImage([{name:"images",maxCount:10}])
    ,resizeMultipleFiles('message',"images",undefined),updateMessage);

module.exports=router;