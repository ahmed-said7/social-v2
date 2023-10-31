const expressHandler=require('express-async-handler');
const apiError = require('../utils/apiError');
const {updateOne,deleteOne,getAll} =require('../utils/apiFactory');
const lessonModel = require('../models/lessonModel');
const codeModel = require('../models/codeModel');
const fs=require('fs');
const {promisify} =require('util')
const _stat=promisify(fs.stat);

const createLesson=expressHandler(async(req,res,next)=>{
    req.body.admin=req.user._id;
    const lesson=await lessonModel.create(req.body);
    if(!lesson){
        return next(new apiError('can not create a new lesson',400));
    };
    // await lesson.populate({path:"admin",select:"name profile"});
    res.status(200).json({result:lesson});
});

const deleteLesson=deleteOne(lessonModel);
const updateLesson=updateOne(lessonModel);
const getAllLessons=getAll(lessonModel,'lesson',{path:"admin",select:"name profile"});

const setFilterObj=expressHandler(async(req,res,next)=>{
    req.filterObj={};
    if(req.user.role == 'instructor'){
        req.filterObj.admin = req.user._id; 
    }else if(req.user.role == 'student') {
        req.filterObj.isPublished=true;
        req.query.select='title';
    }else if(req.user.role == 'admin'){
        req.query.select='title,unPublished';
    };
    return next();
});

const accessLesson=expressHandler(async(req,res,next)=>{
    const lesson=await lessonModel.findById(req.params.id);
    if( lesson?.admin.toString() != req.user._id.toString() ){
        return next(new apiError('you are not lesson owner',400));
    };
    return next();
});

const publishLesson=expressHandler(async(req,res,next)=>{
    const lesson=await lessonModel.findByIdAndUpdate(
        req.params.id,{isPublished:true},{new:true});
    if(!lesson){
        return next(new apiError('can not create a new lesson',400));
    };
    await lesson.populate({path:"admin",select:"name profile"});
    return res.status(200).json({result:lesson});
});

const unpublishLesson=expressHandler(async(req,res,next)=>{
    const lesson=await lessonModel.findByIdAndUpdate(
        req.params.id,{isPublished:false},{new:true});
    if(!lesson){
        return next(new apiError('can not create a new lesson',400));
    };
    await lesson.populate({path:"admin",select:"name profile"});
    return res.status(200).json({result:lesson});
});

const getLesson=expressHandler(async(req,res,next)=>{
    const {code}=req.body;
    if(!code) return next(new apiError('code not specified',400));
    const lesson=await lessonModel.findById(req.params.id);
    if( !lesson || !lesson.isPublished ){
        return next(new apiError('can not get a new lesson',400));
    };
    const accessCode=await codeModel.findOne({code,lesson:req.params.id});
    if(!accessCode){
        return next(new apiError('access code not found',400));
    };
    if( accessCode.consumed ){
        return next(new apiError("access code consumed",400));
    };
    if(accessCode.user.toString() != req.user._id.toString()){
        return next(new apiError("can not get lesson",400));
    };
    accessCode.counter += 1;
    if(accessCode.counter >=4 ){
        accessCode.consumed=true;
    };
    await accessCode.save();
    await lesson.populate({path:"admin",select:"name profile"});
    return res.status(200).json({lesson});
});

const streamLessonVideo=expressHandler(async(req,res,next)=>{
    const lesson=await lessonModel.findById(req.params.id);
    if( !lesson ){
        return next(new apiError('Not Found',400));
    };
    const range=req.headers.range;
    if(!range) return next(new apiError('range not specified'),400);
    const videoName= lesson.video;
    const path=`${__dirname}}/../uploads/videos/${videoName}`
    const size=(await _stat(path)).size;
    const chunk= 10**6;
    const start=parseInt( range.replace(/bytes=/g,'').split('-')[0] );
    const end=Math.min( chunk+start , size - 1 );
    const contentLength=end-start+1 ;
    res.writeHead( 206 ,{
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength ,
        "Content-Type": "video/mp4" 
    });
    const stream=fs.createReadStream(path,{start,end});
    stream.pipe(res);
});

const attendLesson=expressHandler(async(req,res,next)=>{
    let user=req.user;
    const {code}=req.body;
    if(!code) return next(new apiError('code not specified',400));
    const lesson=await lessonModel.findById(req.params.id);
    if(!lesson || ! lesson.isPublished){
        return next(new apiError('can not get a new lesson',400));
    };
    const accessCode=await codeModel.findOne({code,lesson:req.params.id});
    if(!accessCode){
        return next(new apiError('access code not found',400));
    };
    if(accessCode.consumed){
        return next(new apiError("access code consumed",400));
    };
    if( accessCode.user.toString() != req.user._id.toString()){
        return next(new apiError("can not get lesson",400));
    };
    accessCode.consumed=true;
    await accessCode.save();
    const index=user.attendedLessons.findIndex(
        ({lesson}) => lesson.toString() == req.params.id.toString() );
    if(index > -1){
        res.status(200).json({message:"You have attended lessons before"});
    }else {
        user.attendedLessons.push({lesson:req.params.id,attendedAt:Date.now()});
    };
    await user.save();
    await user.populate({path:'attendedLessons.lesson',select:"title"});
    return res.status(200).json({lesson:user.attendedLessons});
});

module.exports ={
    attendLesson,getLesson,
    unpublishLesson,publishLesson
    ,accessLesson,setFilterObj,deleteLesson,
    updateLesson,getAllLessons,
    createLesson,streamLessonVideo
};