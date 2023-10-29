const mongoose= require('mongoose');
require('dotenv').config();
const questionSchema=new mongoose.Schema({
    question:String,
    answers:[String],
    correctAnswer:String,
    quiz:{type:mongoose.Types.ObjectId,ref:"Quiz"},
    },{
    timestamps:true,toObject:{virtuals:true},
    toJSON:{virtuals:true}
});

const questionModel=mongoose.model('Question',questionSchema);

module.exports = questionModel;
