const {deleteResult,updateResult,getResults,
    getResult,setFilterObject,accessResult}=require('../services/resultServices');
const express= require('express');
const router =express.Router();
const { protected , allowedTo } = require('../services/authServices');
    
router.use(protected);
router.route('/').get(setFilterObject,getResults);
router.route('/:id').patch(accessResult,updateResult)
    .get(accessResult,getResult).delete(accessResult,deleteResult);
module.exports=router;