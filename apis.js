const coinRouter=require('./routes/coinRoutes');
const userRouter=require('./routes/userRoutes');
const authRouter=require('./routes/authRoutes');
const postRouter=require('./routes/postRoute');
const commentRouter=require('./routes/commentRoute');
const chatRouter=require('./routes/chatRoute');
const messageRouter=require('./routes/messageRoute');
const likeRouter=require('./routes/likeRoute');
const likeRouter=require('./routes/likeRoute');
const { successPage,coinWebhook  } =require('./services/coinServices');
const errorMiddleware = require('./middlewares/errorMiddleware');
const express=require('express');
const dotenv=require('dotenv');
const morgan = require('morgan');
const apiError = require('./utils/apiError');
dotenv.config();


const api=(app)=>{
    app.use(express.json());
    if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
    };
    app.use(express.static('uploads'));
    app.use(express.static('puplic'));
    app.set('view engine', 'ejs');
    app.post('/webhook',coinWebhook);
    app.get('/success',successPage);
    app.use('/user',userRouter);
    app.use('/auth',authRouter);
    app.use('/post',postRouter);
    app.use('/comment',commentRouter);
    app.use('/like',likeRouter);
    app.use('/chat',chatRouter);
    app.use('/message',messageRouter);
    app.use('/coin',coinRouter);
    app.all( '*' , (req,res,next) => next ( new apiError('can not find route',400) ));
    app.use(errorMiddleware);
};
module.exports = api;