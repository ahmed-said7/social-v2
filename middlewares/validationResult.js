
const asyncHandler=require("express-async-handler");
const {validationResult} =require('express-validator');

const validaionMiddleware =asyncHandler(async(req, res, next) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message:errors.message, errors:errors});
    };
    
    return next();
});
module.exports=validaionMiddleware;