const mongoose= require('mongoose');
require('dotenv').config();
const couponSchema=new mongoose.Schema({
    name:{type:String,unique:true,required:true},
    couponExpiresAt:{type:Date,required:true},
    discount:{type:Number,required:true}
},{ timestamps:true });

couponSchema.pre('save',function(next){
    if(this.couponExpiresAt){
        this.couponExpiresAt=new Date(this.couponExpiresAt);
    }else{
        this.couponExpiresAt=Date.now() + 3*24*3600*1000;
    };
    if(! this.discount ){
        this.discount=30;
    };
    next();
});


const couponModel=mongoose.model('Coupon',couponSchema);
module.exports=couponModel;