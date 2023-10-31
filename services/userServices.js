const expressHandler=require('express-async-handler');
const userModel=require('../models/userModel');
const postModel=require('../models/postModel');
const apiError = require('../utils/apiError');
const{getAll,createOne,updateOne,deleteOne}=require('../utils/apiFactory');

const getUsers=getAll(userModel,'user');

const createUser=createOne(userModel);

const updateUser=updateOne(userModel);

const deleteUser=deleteOne(userModel);

const updateUserPassword=expressHandler(async (req, res, next) =>{
    let user=await userModel.findById(req.params.id);
    if(! user){
        return next(new apiError('User not found',400));
    };
    user.password = req.body.password;
    await user.save();
    res.status(200).json({status: 'OK'});
});

const addFriend=expressHandler(async (req,res,next)=>{
    let sender = req.user;
    if(sender._id.toString() == req.params.id.toString()) return next(new apiError('can not add friend',400));
    let reciver=await userModel.findById(req.params.id);
    if( reciver.friends.includes(sender._id) || reciver.requests.includes(sender._id) ){
        return next(new apiError('can not add friend',400))
    };
    await reciver.updateOne({$push:{followers:sender._id}});
    await reciver.updateOne({$push:{requests:sender._id}});
    await sender.updateOne({$push:{following:reciver._id}});
    await sender.save();
    await reciver.save();
    await sender.populate({path:"following",select:"name profile"});
    res.status(201).json({following:sender.following});
});

const cancelRequest=expressHandler(async (req,res,next)=>{
    let sender = req.user;
    if(sender._id.toString() == req.params.id.toString()) return next(new apiError('can not cancel request',400));
    let reciver = await userModel.findById(req.params.id);
    if( sender.friends.includes( reciver._id ) || !reciver.requests.includes(sender._id) ){
        return next(new apiError('can not cancel request',400))
    };
    await sender.updateOne({$pull:{following:reciver._id}});
    await reciver.updateOne({$pull:{requests:sender._id}});
    await reciver.updateOne({$pull:{followers:sender._id}});
    await sender.save();
    await reciver.save();
    await sender.populate({path:"following",select:"name profile"});
    res.status(201).json({following:sender.following});
});

const unFriend=expressHandler(async (req,res,next)=>{
    let sender = req.user;
    if(sender._id.toString() == req.params.id.toString()) return next(new apiError('can not un friend',400));
    let reciver=await userModel.findById(req.params.id);
    if( !sender.friends.includes( reciver._id ) ){
        return next(new apiError('can not un friend',400))
    };
    await sender.updateOne({$pull:{followers:reciver._id}});
    await sender.updateOne({$pull:{following:reciver._id}});
    await sender.updateOne({$pull:{friends:reciver._id}});
    await reciver.updateOne({$pull:{following:sender._id}});
    await reciver.updateOne({$pull:{followers:sender._id}});
    await reciver.updateOne({$pull:{friends:sender._id}});
    await sender.save();
    await reciver.save();
    await sender.populate({path:"friends",select:"name profile"});
    res.status(201).json({friends:sender.friends});
});

const acceptRequest=expressHandler(async (req,res,next)=>{
    let sender = req.user;
    if(sender._id.toString() == req.params.id.toString()) return next(new apiError('can not add friend',400));
    let reciver=await userModel.findById(req.params.id);
    if( !sender.requests.includes( reciver._id ) || sender.friends.includes( reciver._id )  ){
        return next(new apiError('can not accept friend',400))
    };
    await sender.updateOne({$pull:{requests:reciver._id}});
    await sender.updateOne({$push:{following:reciver._id}});
    await sender.updateOne({$push:{friends:reciver._id}});
    await reciver.updateOne({$push:{followers:sender._id}});
    await reciver.updateOne({$push:{friends:sender._id}});
    await sender.save();
    await reciver.save();
    await sender.populate({path:"friends",select:"name profile"});
    res.status(201).json({friends:sender.friends});
});

const deleteRequest=expressHandler(async (req,res,next)=>{
    let sender = req.user;
    if(sender._id.toString() == req.params.id.toString()) return next(new apiError('can not cancel request',400));
    let reciver = await userModel.findById(req.params.id);
    if( sender.friends.includes( reciver._id ) || !sender.requests.includes(reciver._id) ){
        return next(new apiError('can not delete request',400))
    };
    await sender.updateOne( {$pull:{followers:reciver._id}} );
    await sender.updateOne( {$pull:{requests:reciver._id}} );
    await reciver.updateOne( {$pull:{following:sender._id}} );
    await sender.save();
    await reciver.save();
    await sender.populate({path:"requests",select:"name profile"});
    res.status(201).json({friends:sender.requests});
});

const follow=expressHandler(async (req,res,next)=>{
    let sender = req.user;
    if(sender._id.toString() == req.params.id.toString()) return next(new apiError('can not cancel request',400));
    let reciver = await userModel.findById(req.params.id);
    if( sender.following.includes(reciver._id) ){
        return next(new apiError('can not follow user',400))
    };
    await sender.updateOne( {$push:{following:reciver._id}} );
    await reciver.updateOne( {$push:{followers:sender._id}} );
    await sender.save();
    await reciver.save();
    await sender.populate({path:"following",select:"name profile"});
    res.status(201).json({friends:sender.following});
});

const unfollow=expressHandler(async (req,res,next)=>{
    let sender = req.user;
    if(sender._id.toString() == req.params.id.toString()) return next(new apiError('can not cancel request',400));
    let reciver = await userModel.findById(req.params.id);
    if( !sender.following.includes(reciver._id) ){
        return next(new apiError('can not un follow user',400))
    };
    await sender.updateOne({$pull:{following:reciver._id}});
    await reciver.updateOne({$pull:{followers:sender._id}});
    await sender.save();
    await reciver.save();
    await sender.populate({path:"following",select:"name profile"});
    res.status(201).json({friends : sender.following});
});

const followBack=expressHandler(async (req,res,next)=>{
    let sender = req.user;
    if(sender._id.toString() == req.params.id.toString()) return next(new apiError('can not follow back',400));
    let reciver = await userModel.findById(req.params.id);
    if( !sender.followers.includes(reciver._id) ){
        return next(new apiError('can not follow back user',400))
    };
    await sender.updateOne( {$push:{following:reciver._id}} );
    await reciver.updateOne( {$push:{followers:sender._id}} );
    await sender.save();
    await reciver.save();
    await sender.populate({path:"following",select:"name profile"});
    res.status(201).json({friends:sender.following});
});

const removeFollwer=expressHandler(async (req,res,next)=>{
    let sender = req.user;
    if(sender._id.toString() == req.params.id.toString()) return next(new apiError('can not remove follower',400));
    let reciver = await userModel.findById(req.params.id);
    if( !sender.followers.includes(reciver._id) ){
        return next(new apiError('can not remove follower',400))
    };
    await sender.updateOne( {$pull:{followers:reciver._id}} );
    await reciver.updateOne( {$pull:{following:sender._id}} );
    await sender.save();
    await reciver.save();
    await sender.populate({path:"followers",select:"name profile"});
    res.status(201).json({friends:sender.followers});
});

const addToSearch=expressHandler( async (req,res,next) => {
    let user=req.user;
    let index=user.search.findIndex( (ele)=> ele.user.toString() == req.params.id.toString());
    if(index > -1){
        user.search[index].searchAt=Date.now();
    }else {
        user.search.push({searchAt:Date.now(),user:req.params.id});
    };
    await user.save();
    await user.populate({path:'search.user',select:"name profile"});
    res.status(200).json({search:user.search});
} );

const removeFromSearch=expressHandler( async (req,res,next) => {
    let user=req.user;
    let index=user.search.findIndex( (ele)=> ele.user.toString() == req.params.id.toString());
    if(index > -1){
        user.search.splice(index, 1);
    };
    await user.save();
    await user.populate({path:'search.user',select:"name profile"});
    res.status(200).json({user:user});
} );

const getProfile=expressHandler( async (req,res, next) => {
    const Obj={friend:false,follower:false,following:false,request:false};
    const user=await userModel.findById(req.params.id).select('-password -requests').populate([
        {path:"following",select:"name profile"},
        {path:"followers",select:"name profile"},
        {path:"friends",select:"name profile"}
    ]);
    const posts=await postModel.find({user:user._id,userPost:true}).
    populate([
        {
            path:"user",select:"name profile",Model:"User"
        }
        // logic is true but data is not required
        // {
        //     path:"comments",select:"text images user",Model:"Comment",
        //     populate:{path:"user",select:"name profile",model:"User"},
        //     populate:{
        //         path:"likes",select:"type user",model:"Like",
        //         populate:{path:"user",select:"name profile",model:"User"},
        //     }
        // },
        // {
        //     path:"likes",select:"type user"
        // }
        ,]);
    Obj.friend= user.friends?.includes(req.user._id) ? true : false;
    Obj.following= user.followers?.includes(req.user._id) ? true : false;
    Obj.follower= user.following?.includes(req.user._id) ? true : false;
    Obj.request= user.requests?.includes(req.user._id) ? true : false;
    res.status(200).json({user,posts,Obj});
});

const savePost=expressHandler(async (req,res,next)=>{
    let user=req.user;
    const index=user.savedPosts.findIndex( 
        (el) => el.post.toString() == req.params.id.toString());
    if (index > -1) {
        user.savedPosts[index].savedAt= new Date();
    } else {
        user.savedPosts.push({ savedAt:Date.now() , post:req.params.id });
    };
    await user.save();
    await user.populate([
        { 
            path:"savedPosts.post" , 
            populate :{path:"user",select:"name profile",Model:"User"},
            populate :{path:"likes.user",select:"name profile",Model:"User"}
        }
    ]);
    res.status(201).json({savedPosts:user.savedPosts});
});

const unsavePost=expressHandler(async (req,res,next)=>{
    let user=req.user;
    const index=user.savedPosts.findIndex( 
        (el) => el.post.toString() == req.params.id.toString() );
    if(index > -1){
        user.savedPosts.splice(index, 1);
    };
    await user.save();
    await user.populate([
        { 
            path:"savedPosts.post" , 
            populate :{path:"user",select:"name profile",Model:"User"},
            populate :{path:"likes.user",select:"name profile",Model:"User"}
        }
    ]);
    res.status(201).json({savedPosts:user.savedPosts});
});

// @Route /: distance /: unit
// @ get closest people from a distance
//  one mile => 1609.344 meters

const getClosestPeople=expressHandler(async (req,res,next)=>{
    const [lat, lng]=req.user.coordinates;
    if( !lat || !lng ){
        return next(new apiError('lat lng not found',400));
    };
    const distance= req.params.distance ;
    const unit= req.params.unit ;
    const radius= unit == 'mi' ? distance / 3963.2 : distance / 6378.1 ;
    const result=await userModel.find({
        coordinates:{ $geoWithin : { $centerSphere : [ [lng , lat] , radius ] } }
    });
    if(result.length == 0){
        return res.status(200).json({ status:"not found"});
    };
    return res.status(200).json({ result });
});

//  one mile => 1609.344 meters

const getDistancePeople=expressHandler(async (req,res,next)=>{
    const [ lat , lng ]=req.user.coordinates;
    if( !lat || !lng ){
        return next(new apiError('lat lng not found',400));
    };
    const unit = req.params.unit;
    const mul = unit == 'km' ? .001 : .000621371;
    const result=await userModel.aggregate([
        {
            $geoNear : {
                near : { type:'Point' , coordinates: [ lng*1 , lat*1 ] },
                distanceField : "distance",
                distanceMultiplier : mul
            }
        }
    ]);
    if( result.length == 0 ){
        return res.status(200).json({ status:"not found"});
    };
    return res.status(200).json({ result });
});


module.exports = 
    {
        addFriend,getProfile,cancelRequest,
        deleteRequest,addToSearch,
        removeFromSearch,removeFollwer,
        followBack,unfollow,follow,
        acceptRequest,unFriend,getUsers,
        createUser,deleteUser,updateUserPassword
        ,updateUser,savePost,unsavePost,
        getClosestPeople,getDistancePeople
    };