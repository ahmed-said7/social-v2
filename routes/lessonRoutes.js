const express= require('express');
const router =express.Router();

const {protected,allowedTo}=require('../services/authServices');
const {attendLesson,getLesson,unpublishLesson,publishLesson
    ,accessLesson,setFilterObj,deleteLesson,updateLesson,getAllLessons,
    createLesson
}=require('../services/lessonServices');
const { uploadSingleVideo } = require('../middlewares/imageMiddleware');

const {createLessonValidator,updateLessonValidator,
    ValidateIdParam}=require('../validator/lessonValidator');


router.use(protected);
router.route('/').post(uploadSingleVideo('video'),createLesson)
    .get(setFilterObj,getAllLessons);
router.route('/:id').get(getLesson)
    .patch(accessLesson,uploadSingleVideo('video'),updateLesson)
    .delete(accessLesson,deleteLesson);

router.route('/publish/:id').post(accessLesson,publishLesson);
router.route('/unpublish/:id').post(accessLesson,unpublishLesson);
router.route('/attend/:id').post(attendLesson);

module.exports = router;