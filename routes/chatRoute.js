const express= require('express');
const router =express.Router();
const messageRouter=require('./messageRoute');
const {protected,allowedTo} = require('../services/authServices');

const {createChatValidator,updateChatValidator,
    ValidateIdParam,addMemberValidator}=require('../validator/chatValidator');


const { accessChat,createChat,getUserChats,
    changeChatAdmin,addMemberToChat,getChatMembers
    ,setFilterObj,getChats
    ,leaveChat,getChat,updateChat,deleteChat }=require('../services/chatServices');

const {uploadSingleImage,resizeSingleFile} =require('../middlewares/imageMiddleware');
router.use(protected);

router.route('/')
    .post(uploadSingleImage('image'),resizeSingleFile('chat',"image"),createChat)
    .get(setFilterObj,getChats);

router.route('/:id')
    .patch(accessChat,uploadSingleImage('image'),resizeSingleFile('chat',"image"),updateChat)
    .delete(accessChat,deleteChat)
    .get(getChat);

router.route('/my-chats').patch(getUserChats);
router.use('/:chatId/message',messageRouter);
router.route('/add-member/:id').patch(accessChat,addMemberToChat);
router.route('/leave-chat/:id').patch(leaveChat);
router.route('/change-admin/:id').patch(accessChat,changeChatAdmin);
router.route('/members/:id').patch(getChatMembers);

module.exports=router;