const asyncHandler=require('express-async-handler');
const apiFeatures=require('../utils/apiFeatures');
const apiError = require('../utils/apiError');
const getOne=(model,population='')=> asyncHandler ( async(req,res,next)=>{
    const id=req.params.id;
    const query=model.findById(id);
    if(population){
        query=query.populate(population);
    };
    const document=await query;
    if(!document){
        return next(new apiError(`Couldn't find ${model} for ${id}`,400));
    };
    return res.status(200).json({status:"success",result:document});
});

const createOne=(model)=> asyncHandler(async(req,res,next)=>{
    let document=await model.create(req.body);
    if(!document){
        return next(new apiError(`Couldn't create ${model} `,400));
    };
    await document.save();
    res.status(200).json({status:"success",result:document}); 
})

const updateOne=(model,options=null)=> asyncHandler(async(req,res,next)=>{
    const document=await model.findOneAndUpdate({_id:req.params.id},req.body,{new:true});
    if(!document){
        return next(new apiError(`Couldn't find ${model} for ${req.params.id}`,400));
    };
    await document.save();
    res.status(200).json({status:"success",result:document});
});

const deleteOne=(model)=> asyncHandler(async(req,res,next)=>{
        let document=await model.findOne({_id:req.params.id});
        if(!document){
            return next(new apiError(`Couldn't find ${model} for ${id}`,400));
        };
        await document.remove();
        res.status(200).json({status:"success",result:`document deleted`});
});

const getAll=(model,search=null,populate=null)=> asyncHandler(async(req,res,next)=>{
    if(!req.filterObj){
        req.filterObj={};
    };
    const endIndex=await model.countDocuments();
    const features=new apiFeatures(model.find(),req.query).
    filter(req.filterObj)
    .sort().search(search).select().pagination(endIndex).population(populate);
    const query=await features.query;
    const pagination=await features.Obj;
    res.status(200).json({pagination,query});
});

module.exports={getAll,getOne,createOne,updateOne,deleteOne};