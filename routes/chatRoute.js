const express= require('express');
const router =express.Router();
const messageRouter=require('./messageRoute');
const {protected,allowedTo} = require('../services/authServices');
const { accessChat,createChat,getUserChats,
    getChat,updateChat,deleteChat }=require('../services/chatServices');
const {uploadSingleImage,resizeSingleFile} =require('../middlewares/imageMiddleware');
router.use(protected);

router.route('/')
    .post(uploadSingleImage('image'),resizeSingleFile('chat',"image"),createChat)
    .get(getUserChats);

router.route('/:id')
    .patch(accessChat,uploadSingleImage('image'),resizeSingleFile('chat',"image"),updateChat)
    .delete(accessChat,deleteChat)
    .get(getChat);

router.use('/:chatId/message',messageRouter);

module.exports=router;