const express= require('express');
const router =express.Router();
const { protected , allowedTo } = require('../services/authServices');
const { buyCoin }=require('../services/coinServices');

router.use(protected);
router.route('/buy').post(buyCoin);

module.exports=router;