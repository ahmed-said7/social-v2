const coinRouter=require('./routes/coinRoutes');
const userRouter=require('./routes/userRoutes');
const authRouter=require('./routes/authRoutes');
const postRouter=require('./routes/postRoute');
const commentRouter=require('./routes/commentRoute');
const chatRouter=require('./routes/chatRoute');
const messageRouter=require('./routes/messageRoute');
const likeRouter=require('./routes/likeRoute');
const groupRouter=require('./routes/groupRoutes');
const storyRouter=require('./routes/storyRoutes');
const notificationRouter=require('./routes/notificationRoute');
const lessonRouter=require('./routes/lessonRoutes');
const codeRouter=require('./routes/codeRoutes');
const couponRouter=require('./routes/couponRoutes');
const resultRouter=require('./routes/resultRoutes');
const reviewRouter=require('./routes/reviewRoutes');
const questionRouter=require('./routes/questionRoutes');
const quizRouter=require('./routes/quizRoutes');
const jopRouter=require('./routes/jopRoutes');
const { successPage,coinWebhook  } =require('./services/coinServices');
const errorMiddleware = require('./middlewares/errorMiddleware');
const express=require('express');
const dotenv=require('dotenv');
const morgan = require('morgan');
const apiError = require('./utils/apiError');
const { readJopApplication } = require('./services/jopServices');
dotenv.config();

// readJopApplication
const api=(app)=>{

    app.use(express.json());
    if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
    };
    app.get('/read',readJopApplication);
    app.use(express.static( 'uploads' ));
    app.use(express.static( 'public' ));
    app.set( 'view engine' , 'ejs');
    app.post( '/webhook' , coinWebhook );
    app.get( '/success' , successPage );
    app.use('/user',userRouter);
    app.use('/auth',authRouter);
    app.use('/post',postRouter);
    app.use('/comment',commentRouter);
    app.use('/like',likeRouter);
    app.use('/chat',chatRouter);
    app.use('/message',messageRouter);
    app.use('/coin',coinRouter);
    app.use('/group',groupRouter);
    app.use('/story',storyRouter);
    app.use('/notify',notificationRouter);
    app.use('/lesson',lessonRouter);
    app.use('/quiz',quizRouter);
    app.use('/code',codeRouter);
    app.use('/coupon',couponRouter);
    app.use('/result',resultRouter);
    app.use('/review',reviewRouter);
    app.use('/question',questionRouter);
    app.use('/jop',jopRouter);
    app.all( '*' , (req,res,next) => next ( new apiError('can not find route',400) ));
    app.use(errorMiddleware);

};

module.exports = api;