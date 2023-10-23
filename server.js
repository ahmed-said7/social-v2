const express=require('express');
const socket=require('./socket');
const dotenv=require('dotenv');
const dbConnect=require('./config/db');


const app=express();
dbConnect();
dotenv.config();

const api=require('./apis');
api(app);

const port= process.env.PORT || 9090;
const server=app.listen(port,()=>{
    console.log('server listening on port ')
});

const io=require('socket.io')(server);
socket(io);


process.on('unhandledRejection',(err)=>{
    console.log(err);
    server.close( () => {
        process.exit(1);
    } );
});