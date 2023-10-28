const mongoose= require('mongoose');
require('dotenv').config();


const storySchema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:"User"},
    text:String
    ,video:String,
    image:String,
    reel:{type:Boolean,default:false},
    duration:Date,
    likes:[{type:mongoose.Types.ObjectId,ref:"User"}]
    ,votes:[{
        type:{type:Number,min:0,max:100},
        user:{type:mongoose.Types.ObjectId,ref:"User"}
    },],
    active:{ type:Boolean ,default:true}
},{
    timestamps:true,toObject:{virtuals:true},
    toJSON:{virtuals:true}
});

storySchema.pre('save', function(next){
    if( !this.duration && !this.reel){
        this.duration=Date.now() + 24*60*60*1000;
    };
    return next();
});

storySchema.pre( /^find/ ,async function(next){
    await storyModel.updateMany({ reel:false , duration :{ $lt : Date.now() }},{active:false});
    // await storyModel.deleteMany({active:false});
    this.find({active:true});
    return next();
});

storySchema.post('init',function(doc){
    if(doc.image){
        doc.image=`${process.env.base_url}/story/${doc.image}`;
    };
    if(doc.video){
        doc.video=`${process.env.base_url}/videos/${doc.image}`;
    };
});

const storyModel=mongoose.model('Story',storySchema);

module.exports=storyModel;