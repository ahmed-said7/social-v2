const { check }=require('express-validator');
const bcryptjs=require('bcryptjs');
const validationResult=require('../middlewares/validationResult');
const userModel=require('../models/userModel');

const createUserValidator=[
    check('name').notEmpty().withMessage('name is required').
    isString().withMessage('name should be a string')
    .isLength({min:3}).withMessage('miimum length is 3'),
    check('email').notEmpty().withMessage('email is required').
    isEmail().withMessage('invalid email address').
    custom(async (val,{req})=>{
        const user=await userModel.findOne({email:val});
        if(user) return Promise.reject(new Error('invalid email address'));
        return true;
    }),
    check('password').notEmpty().withMessage('pass is required').
    isString().withMessage('password should be string').
    custom((val,{req})=>{
        if(req.body.passwordConfirm != val){
            throw new Error('password mismatch');
        };
        return true;
    }),
    check('passwordConfirm').notEmpty().withMessage('confirm pass is required').
    isString().withMessage('password should be string'),
    check('coordinates').optional()
    .isArray({max:2}).withMessage('coordinates should be array'),
    check('gender').optional()
    .isIn(['male','female']).withMessage('gender should be male or female'),
    check('relationship').optional()
    .isIn(["single","married","In a relationship"])
    .withMessage('relationship should be married or single or In a relationship'),
    check('birth').optional()
    .isDate().withMessage('birth should be date'),
    check('highSchool').optional()
    .isString().withMessage('highSchool should be string'),
    check('homeTown').optional()
    .isString().withMessage('homeTown should be string'),
    check('workPlace').optional()
    .isString().withMessage('workPlace should be string'),
    check('college').optional()
    .isString().withMessage('college should be string'),
    check('jop').optional()
    .isString().withMessage('jop should be string'),
    check('otherName').optional()
    .isString().withMessage('otherName should be string'),
    check('bio').optional()
    .isString().withMessage('bio should be string'),
    check('instagram').optional()
    .isString().withMessage('instagram should be string'),
    check('bio').optional()
    .isString().withMessage('bio should be string'),
    check('profile').optional()
    .isString().withMessage('profile should be string'),
    check('cover').optional()
    .isArray().withMessage('cover should be array')
    ,validationResult
];

const updateUserValidator=[
    check('id').isMongoId().withMessage('id should be mongo id'),
    check('name').optional().
    isString().withMessage('name should be a string')
    .isLength({min:3}).withMessage('minimum length is 3'),
    check('email').optional().
    isEmail().withMessage('invalid email address').
    custom(async (val,{req})=>{
        const user=await userModel.findOne({email:val});
        if(user) return Promise.reject(new Error('invalid email address'));
        return true;
    }),
    check('coordinates').optional()
    .isArray({max:2}).withMessage('coordinates should be array'),
    check('gender').optional()
    .isIn(['male','female']).withMessage('gender should be male or female'),
    check('relationship').optional()
    .isIn(["single","married","In a relationship"])
    .withMessage('relationship should be married or single or In a relationship'),
    check('birth').optional()
    .isDate().withMessage('birth should be date'),
    check('highSchool').optional()
    .isString().withMessage('highSchool should be string'),
    check('homeTown').optional()
    .isString().withMessage('homeTown should be string'),
    check('workPlace').optional()
    .isString().withMessage('workPlace should be string'),
    check('college').optional()
    .isString().withMessage('college should be string'),
    check('jop').optional()
    .isString().withMessage('jop should be string'),
    check('otherName').optional()
    .isString().withMessage('otherName should be string'),
    check('bio').optional()
    .isString().withMessage('bio should be string'),
    check('instagram').optional()
    .isString().withMessage('instagram should be string'),
    check('bio').optional()
    .isString().withMessage('bio should be string'),
    check('profile').optional()
    .isString().withMessage('profile should be string'),
    check('cover').optional()
    .isArray().withMessage('cover should be array')
    ,validationResult
];


const changeLoggedUserPasswordValidator =[
    check('password').notEmpty().withMessage('pass is required').
    isString().withMessage('password should be string'),
    check('passwordConfirm').notEmpty().withMessage('confirm pass is required').
    isString().withMessage('password should be string').
    custom((val,{req})=>{
        if( req.body.password != val ){
            throw new Error('password mismatch');
        };
        return true;
    }),
    check('currentPassword').notEmpty().withMessage('email is required').
    isString().withMessage('password should be string').
    custom(async (val,{req})=>{
        const hashedPassword = req.user.password;
        const valid=await bcryptjs.compare(val,hashedPassword);
        if(!valid) return Promise.reject(new Error('Invalid password'));
        return true;
    })
    ,validationResult
];

const changeUserPasswordValidator =[
    check('password').notEmpty().withMessage('pass is required').
    isString().withMessage('password should be string'),
    check('passwordConfirm').notEmpty().withMessage('confirm pass is required').
    isString().withMessage('password should be string').
    custom((val,{req})=>{
        if( req.body.password != val ){
            throw new Error('password mismatch');
        };
        return true;
    })
    ,validationResult
];

const ValidateIdParam=[
    check('id').isMongoId().withMessage('id should be mongo id')
    ,validationResult
];

module.exports={
    ValidateIdParam,createUserValidator,updateUserValidator,
    changeLoggedUserPasswordValidator,changeUserPasswordValidator
};