const mongoose= require('mongoose');
const lessonModel = require('./lessonModel');
const quizModel = require('./quizModel');
const userModel = require('./userModel');

require('dotenv').config();
const reviewSchema=new mongoose.Schema({
    text:{type:String},
    stars:{type:Number,min:1,max:5},
    user:{type:mongoose.Types.ObjectId,ref:"User"},
    quiz:{type:mongoose.Types.ObjectId,ref:"Quiz"},
    lesson:{type:mongoose.Types.ObjectId,ref:"Lesson"}
},{ timestamps:true });


reviewSchema.statics.staticFunc=async (Id,model)=>{
    const result=await this.aggregate([
        {$match:{lesson:Id}},
        { $group:{ 
            _id:"$lesson",
            average:{$avg:"$stars"},
            nums:{$sum:1}
        }}
    ]);
    if(result.length > 0){
        const average = result[0].average;
        const nums=result[0].nums;
        await model.findByIdAndUpdate(Id,{nums,average});
    }else {
        await model.findByIdAndUpdate(Id,{nums:0,average:0});
    };
};



reviewSchema.index({user:1,lesson:1},{unique:true});
reviewSchema.index({user:1,quiz:1},{unique:true});

reviewSchema.pre('save',async function(next){
    const userId=this.user;
    const user=await userModel.findById(userId);
    const quizzesTaken= user.quizzesTaken.map(({quiz})=> quiz );
    const attendedLessons= user.attendedLessons.map(({lesson})=> lesson );
    if(this.lesson  && !attendedLessons.includes(userId)){
        return next(new Error('you are not attend lesson'));
    }else if(this.quiz && !quizzesTaken.includes(userId)){
        return next(new Error('you are not attend quiz'));
    };
    return next();
});

reviewSchema.post('save',async function(doc){
    if(doc.lesson){
        this.constructor.staticFunc(doc.lesson,lessonModel);
    }else if(doc.quiz){
        this.constructor.staticFunc(doc.lesson,quizModel);
    };
});

// reviewSchema.pre(/^findOneAnd/,async function(next){
//     this.doc=await this.findOne();
//     next();
// });

// reviewSchema.post(/^findOneAnd/,async function(){
//     if(this.doc.lesson){
//         this.constructor.staticFunc(this.doc.lesson,lessonModel);
//     }else if(this.doc.quiz){
//         this.constructor.staticFunc(this.doc.lesson,quizModel);
//     };
// });

reviewSchema.post("remove",async function(doc){
    if(doc.lesson){
        this.constructor.staticFunc(doc.lesson,lessonModel);
    }else if(doc.quiz){
        this.constructor.staticFunc(doc.lesson,quizModel);
    };
});

const reviewModel=mongoose.model('Review',reviewSchema);
module.exports=reviewModel;