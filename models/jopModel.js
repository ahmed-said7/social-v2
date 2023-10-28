const mongoose= require('mongoose');
require('dotenv').config();

const jopSchema=new mongoose.Schema({
    admin:{type:mongoose.Types.ObjectId,ref:"User"},
    image:String,
    company:String,
    qualification:String,
    requirements:String,
    experience:String,
    salary:Number,
    workingDetails:String,
    title:String,
    applicants:[{ user:{type:mongoose.Types.ObjectId,ref:"User"} , cv:String }],
    maxApplicants:{type:Number,required:true},
    },{
    timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}
});

jopSchema.post('init',function(doc){
    if(doc.image){
        doc.image=`${process.env.base_url}/jop/${doc.image}`;
    };
    if(doc.applicants){
        doc.applicants.forEach(({cv},index)=>{
            doc.applicants[index].cv=`${process.env.base_url}/jop/${cv}`;
        });
    };
});


const jopModel=mongoose.model('Jop',jopSchema);

module.exports=jopModel;