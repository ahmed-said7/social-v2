const {generateQuizCode,generateLessonCode,applyCoinCoupon}=require('../services/codeServices');
const express= require('express');
const router =express.Router();
const { protected , allowedTo } = require('../services/authServices');

router.use(protected);
router.route('/quiz-code/:id').post(generateQuizCode);
router.route('/lesson-code/:id').post(generateLessonCode);
router.route('/apply-coupon').post(applyCoinCoupon);
module.exports=router;