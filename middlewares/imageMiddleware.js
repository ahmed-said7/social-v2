const multer=require('multer');
const apiError = require('../utils/apiError');
const uuid=require('uuid');
const sharp=require('sharp');
const expressAsyncHandler = require('express-async-handler');

const uploadPdf=()=>{
    const storage=multer.diskStorage(
        {
        destination:function(req,file,cb){
            cb(null,`uploads/cv`)
        },
        filename:function(req,file,cb){
            const ext=file.mimetype.split('/')[1];
            let filename=`cv-${uuid.v4()}-${Date.now()}.${ext}`;
            req.body.cv=filename;
            cb(null,filename);
        }
        });
    const filter=function(req,file,cb){
        if (file.mimetype.startsWith('file')){
            return cb( null , true );
        } else { 
            return cb( new apiError('Invalid file',400) , false );
        };
    };
    return multer({ storage:storage , fileFilter:filter });
};

const uploadSinglePdf=function(field){
    return uploadPdf().single(field);
};


const uploadVideo=()=>{
    const storage=multer.diskStorage(
        {
        destination:function(req,file,cb){
            cb(null,`uploads/videos`)
        },
        filename:function(req,file,cb){
            const ext=file.mimetype.split('/')[1];
            let filename=`video-${uuid.v4()}-${Date.now()}.${ext}`;
            req.body.video=filename;
            cb(null,filename);
        }
        });
    const filter=function(req,file,cb){
        if(file.mimetype.startsWith('video')){
            return cb( null , true );
        }else{
            return cb( new apiError('Invalid file',400) , false );
        };
    };
    return multer({ storage:storage , fileFilter:filter });
};

const uploadSingleVideo=function(field){
    return uploadVideo().single(field);
};

const uploadImage=()=>{
    const storage=multer.memoryStorage();
    const filter=function(req,file,cb){
        console.log(file);
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
    if( req.files && req.files[multiField]){
        req.body[multiField] = [];
        await Promise.all(req.files[multiField].map((ele)=>{
            fileName=`${folderName}-${Date.now()}-${uuid.v4()}.jpeg`;
            req.body[multiField].push(fileName);
            return sharp(ele.buffer).resize(500,500).toFormat('jpeg')
                .jpeg({quality:90}).toFile(`uploads/${folderName}/${fileName}`);
        }));
    };
    if( req.files && req.files[singleField]){
        fileName=`${folderName}-${Date.now()}-${uuid.v4()}.jpeg`;
        req.body[singleField] = fileName;
        await sharp(req.files[singleField][0].buffer)
            .resize(500,500).toFormat('jpeg')
            .jpeg({quality:90}).toFile(`uploads/${folderName}/${fileName}`);
    };
    return next();
});

module.exports={uploadSingleImage,uploadMultipleImage,uploadSingleVideo
    ,resizeSingleFile,resizeMultipleFiles,uploadSinglePdf};