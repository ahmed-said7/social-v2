const userRouter=require('./routes/userRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const express=require('express');
const dotenv=require('dotenv');
const morgan = require('morgan');
dotenv.config();


const api=(app)=>{
    app.use(express.json());
    if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
    };
    app.use('/user',userRouter);
    app.use(errorMiddleware);
};
module.exports = api;