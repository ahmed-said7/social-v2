const express= require('express');
const router =express.Router({mergeParams:true});
const commentRouter = require('../routes/commentRoute');
const {protected,allowedTo} = require('../services/authServices');
const {createPost,getPost,getPosts,setFilterObject,getPostLikes,
    accessPost,deletePost,updatePost,setUserId } = require('../services/postServices');

const {createPostValidator,updatePostValidator,ValidateIdParam}
    =require('../validator/postValidator');


const {uploadMultipleImage,resizeMultipleFiles} =require('../middlewares/imageMiddleware');
// uploadMultipleImage([{name:"images",maxCount:10}])
    // ,resizeMultipleFiles('message',"images",undefined),


router.use(protected);

router.route('/').post(
    uploadMultipleImage([{name:"images",maxCount:10}])
        ,resizeMultipleFiles('post',"images",undefined),
        setUserId,createPost)
        .get(setFilterObject,getPosts);

router.route('/:id').
    get(getPost).
    patch(accessPost,
        uploadMultipleImage([{name:"images",maxCount:10}])
            ,resizeMultipleFiles('post',"images",undefined),updatePost).
    delete(accessPost,deletePost);

router.route('/likes/:id').patch(getPostLikes);
router.use('/:postId/comment',commentRouter);

module.exports=router;