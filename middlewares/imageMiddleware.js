const multer=require('multer');
const apiError = require('../utils/apiError');
const uuid=require('uuid');
const sharp=require('sharp');
const expressAsyncHandler = require('express-async-handler');

const uploadImage=()=>{
    const storage=multer.memoryStorage();
    const filter=function(req,file,cb){
        if(file.mimetype.startsWith('image')){
            return cb( null , true );
        }else{
            return cb( new apiError('Invalid file',400) , false );
        };
    };
    return multer({storage:storage,fileFilter:filter});
};

const uploadSingleImage=function(field){
    return uploadImage().single(field);
};

const uploadMultipleImage=function(field){
    return uploadImage().fields(field);
};

const resizeSingleFile=(folderName,bodyName)=> expressAsyncHandler(async (req,res,next)=>{
    if(req.file){
        let fileName=`${folderName}-${Date.now()}-${uuid.v4()}.jpeg`;
        req.body[bodyName] = fileName;
        await sharp(req.file.buffer).resize(500,500).toFormat('jpeg')
        .jpeg({quality:90}).toFile(`uploads/${folderName}/${fileName}`);
    };
    return next();
});

const resizeMultipleFiles= (folderName,multiField,singleField) => expressAsyncHandler(async (req,res,next)=>{
    let fileName;
    if(req.files){
        if(req.files[multiField]){
            req.body[multiField] = [];
            await Promise.all(req.files[multiField].map((ele)=>{
                fileName=`${folderName}-${Date.now()}-${uuid.v4()}.jpeg`;
                req.body[multiField].push(fileName);
                return sharp(ele.buffer).resize(500,500).toFormat('jpeg')
                .jpeg({quality:90}).toFile(`uploads/${folderName}/${fileName}`);
            }));
        };
        if(req.files[singleField]){
            fileName=`${folderName}-${Date.now()}-${uuid.v4()}.jpeg`;
            req.body[singleField] = fileName;
            await sharp(req.files[singleField][0].buffer)
            .resize(500,500).toFormat('jpeg')
            .jpeg({quality:90}).toFile(`uploads/${folderName}/${fileName}`);
        };
    };
    return next();
});

module.exports=
{uploadSingleImage,uploadMultipleImage,resizeSingleFile,resizeMultipleFiles}