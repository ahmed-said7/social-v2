const express=require('express');

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

process.on('unhandledRejection',(err)=>{
    console.log(err);
    server.close(()=>{
        process.exit(1);
    })
});