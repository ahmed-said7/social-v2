const mongoose = require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const dbConnect=()=>{
    mongoose.connect(process.env.URL).then(()=>{
        console.log('Connect to Mongoose server running');
    });
};

module.exports=dbConnect;
