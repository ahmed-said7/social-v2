const { applyToJop,createJop,updateJop,deleteJop,
    setUserId,setFilterObj,getJops,accessJop,getJop }=require('../services/jopServices');

const express= require('express');
const router =express.Router();
const { protected , allowedTo } = require('../services/authServices');
const { uploadSinglePdf, uploadSingleImage, resizeSingleFile } = require('../middlewares/imageMiddleware');
const {createJopValidator,updateJopValidator,ValidateIdParam}
    =require('../validator/jopValidator');


router.use(protected);

router.route('/').post(uploadSingleImage('image'),resizeSingleFile('jop',"image"),
    setUserId,createJop).get(setFilterObj,getJops);

router.route('/:id').patch(accessJop,updateJop)
    .get(getJop).
    delete(accessJop,deleteJop);

router.route('/apply-jop').post(uploadSinglePdf('cv'),applyToJop);

module.exports=router;