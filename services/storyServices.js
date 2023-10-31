const expressHandler=require('express-async-handler');
const apiError = require('../utils/apiError');
const fs=require('fs');
const {promisify} =require('util')
const _stat=promisify(fs.stat);
const{updateOne,deleteOne,getAll,getOne}=require('../utils/apiFactory');
const storyModel = require('../models/storyModel');

const updateStory=updateOne(storyModel);
const deleteStory=deleteOne(storyModel);
const getStory=getOne(storyModel,{path:"user",select:"name profile"});
const getAllStories = getAll(storyModel,null,{path:"user",select:"name profile"});


const setRequestParam=expressHandler(async(req,res,next)=>{
    req.query.select="user,video,text,image,createdAt";
    return next();
});


const getUserStories=expressHandler(async(req,res,next)=>{
    const story=await storyModel.find({user:req.params.id})
    .populate({path:"user",select:"name profile"});
    if( story.length == 0){
        return res.status(200).json({status: 'stories Not Found'});
    };
    res.status(200).json({story});
});

const getFollowingStories=expressHandler(async(req,res,next)=>{
    const story=await storyModel.find({user:{$in:req.user.following}})
    .populate({path:"user",select:"name profile"});
    if( story.length == 0){
        return res.status(200).json({status: 'stories Not Found'});
    };
    res.status(200).json({story});
});

const getLoggedUserStories=expressHandler(async(req,res,next)=>{
    const story=await storyModel.find({user:req.user._id,reel:true})
    .populate([
        {path:"user",select:"name profile"},
        {path:"likes",select:"name profile"}
    ]).select('-votes');
    if( story.length == 0){
        return res.status(200).json({status: 'stories Not Found'});
    };
    res.status(200).json({story});
});

const getLoggedUserReels=expressHandler(async(req,res,next)=>{
    const story=await storyModel.find({user:req.user._id,reel:false})
    .populate([
        {path:"user",select:"name profile"},
        {path:"votes.user",select:"name profile"}
    ]).select('-likes');
    if( story.length == 0){
        return res.status(200).json({status: 'stories Not Found'});
    };
    res.status(200).json({story});
});

const createStory=expressHandler(async(req,res,next)=>{
    req.body.user=req.user._id;
    const story =await storyModel.create(req.body);
    if(! story ){
        return next(new apiError(' Could not create chat ',400));
    };
    res.status(200).json({story});
});

const voteStory=expressHandler(async(req,res,next)=>{
    const id=req.user._id.toString();
    const story =await storyModel.findById(req.params.id);
    if(! story ){
        return next(new apiError(' Could not find story ',400));
    };
    const index=story.votes.findIndex(({user})=>{ user.toString() ==id });
    if(index > -1){
        story.votes[index].type=req.body.type;
    }else {
        story.votes.push({user:id,type:req.body.type})
    };
    await story.save();
    await story.populate({path:"user",select:"name profile"});
    res.status(200).json({story:story});
});

const unvoteStory=expressHandler(async(req,res,next)=>{
    const id = req.user._id.toString();
    const story =await storyModel.findById(req.params.id);
    if(! story ){
        return next( new apiError(' Could not find story ',400));
    };
    const index=story.votes.findIndex(({user})=>{ user.toString() ==id });
    if(index > -1){
        story.votes.splice(index,1);
    };
    await story.save();
    await story.populate({path:"user",select:"name profile"});
    return res.status(200).json({story});
});

const accessStory=expressHandler(async(req,res,next)=>{
    const story=await storyModel.findById(req.params.id);
    if( story?.user.toString() != req.user._id.toString() ){
        return next(new apiError('you are not story owner',400));
    };
    return next();
});

const streamStoryVideo=expressHandler(async(req,res,next)=>{
    const story=await storyModel.findById(req.params.id);
    if( !story ){
        return next(new apiError('Not Found',400));
    };
    const range=req.headers.range;
    if(!range) return next(new apiError('range not specified'),400);
    const videoName= story.video ;
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

module.exports = { 
    accessStory,createStory,
    getFollowingStories,
    getUserStories,
    getAllStories,getStory,
    updateStory,deleteStory,
    voteStory,unvoteStory
    ,getLoggedUserStories ,
    getLoggedUserReels,
    setRequestParam,
    streamStoryVideo
};