const resultModel=require('../models/resultModel');
const{getAll,updateOne,deleteOne,getOne,createOne}=require('../utils/apiFactory');
const expressHandler=require('express-async-handler');
const deleteResult=deleteOne(resultModel);
const updateResult=updateOne(resultModel);
const getResult=getOne(resultModel,{path:"user",select:"name profile"});
const getResults=getAll(resultModel,null,{path:"user",select:"name profile"});

const setFilterObject=expressHandler(async(req,res,next)=>{
    req.filterObj={};
    req.filterObj.user=req.user._id;
    return next();
});

const accessResult=expressHandler(async(req,res,next)=>{
    const result=await resultModel.findById(req.params.id);
    if( result?.user.toString() != req.user._id.toString() ){
        return next(new apiError('you are not result owner',400));
    };
    return next();
});


module.exports={deleteResult,updateResult,getResults,getResult,setFilterObject,accessResult};