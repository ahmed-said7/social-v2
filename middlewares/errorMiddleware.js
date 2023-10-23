const dotenv=require('dotenv');
const apiError = require('../utils/apiError');
dotenv.config();

const sendErrorDev=(err,res)=>{
    res.status(err.statusCode).json({
        errors: err,
        message: err.message,
        stack:err.stack,
        status:err.status
    });
};

const sendErrorProd=(err,res)=>{
    if( err.isOperational ){
        res.status(err.statusCode)
        .json({ mesage:err.message , status:err.status });
    } else {
        res.status(500)
        .json({ mesage:'something went wrong ',status:'failed' });
    };
};

const handleDuplicateError=(err)=>{
    const val= Object.values(err.keyValue);
    return new apiError(` duplicate value ${ val } `, 400);
};

const handleValidationError = (err) => {
    const values = Object.values(err.errors).map((ele) => ele.message);
    return new apiError(`Validation errors: ${values.join("&")} `,400)
};

const errorMiddleware=(err,req,res,next)=>{
    err.statusCode = err.statusCode || 400;
    console.log(err);
    if(process.env.NODE_ENV == 'development'){
        sendErrorDev(err, res);
    }else if(process.env.NODE_ENV == 'production'){
        let objErr = { ...err };
        if(err.name == "CastError"){
            objErr=new apiError(`invalid object id ${err.value}`,400);
        };
        if( err.code == 11000 ){
            objErr=handleDuplicateError(err);
        };
        if(err.name == "ValidationError"){
            objErr=handleValidationError(err);
        };
        sendErrorProd(objErr,res);
    };
};
module.exports=errorMiddleware;