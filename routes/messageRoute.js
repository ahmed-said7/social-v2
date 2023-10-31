const express= require('express');
const router =express.Router();

const {protected,allowedTo} = require('../services/authServices');

const { accessMessage,createMessage,setFilterObject,getMessageRecipient,
    updateSeenByAdmin,
    deleteMessage,updateMessage,getMessages }
    =require('../services/messageServices');

const {uploadMultipleImage,resizeMultipleFiles} =require('../middlewares/imageMiddleware');

router.use(protected);

const {createMessageValidator,updateMessageValidator
    ,ValidateIdParam}=require('../validator/messageValidator');

router.route('/').
    post(uploadMultipleImage([{name:"images",maxCount:10}])
    ,resizeMultipleFiles('message',"images",undefined),createMessage)
    .get(setFilterObject,getMessages);

router.route('/:id')
    .get(getMessageRecipient)
    .delete(accessMessage,deleteMessage).
    patch(accessMessage,uploadMultipleImage([{name:"images",maxCount:10}])
    ,resizeMultipleFiles('message',"images",undefined),updateMessage);

router.route('/seenByAdmin/:id').patch(accessMessage,updateSeenByAdmin);

module.exports=router;