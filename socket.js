const userModel=require('./models/userModel');
const chatModel=require('./models/chatModel');
const postModel=require('./models/postModel');
const commentModel = require('./models/commentModel');
const lessonModel = require('./models/lessonModel');
const quizModel = require('./models/quizModel');
const storyModel = require('./models/storyModel');
const jopModel = require('./models/jopModel');
const groupModel = require('./models/groupModel');

const socket=( io )=>{

    let connectedUsers=[];
    const Obj={};
    const onChat={};

    io.on('connection',(socket)=>{

        socket.on('goOnline',({userId})=>{
            connectedUsers.push({ socketId:socket.id , userId });
            Obj[userId]=true;
            console.log(connectedUsers);
        });
        

        socket.on('disconnect',()=>{
            const Index=connectedUsers.findIndex
            (  ({ socketId }) => socketId == socket.id  );
            if(Index > -1){
                const userId=connectedUsers[Index].userId;
                Obj[ userId ]=false;
                connectedUsers.splice( Index , 1 );
            };
        });

        socket.on('join-chat',( { chatId } )=>{
            socket.join(chatId);
            if( onChat[chatId] ){
                onChat[chatId].add( socket.id  );
            } else {
                onChat[chatId]=new Set();
                onChat[chatId].add( socket.id );
            };
            socket.on('disconnect',()=>{
                onChat[chatId].delete( socket.id );
            });
        });

        socket.on('leave-chat',( { chatId } )=>{
            onChat[chatId].delete( socket.id );
            console.log(onChat);
        });

        socket.on('send-msg', async ( { chatId , senderId , text , imgs } ) => {
            const members=(await chatModel.findById(chatId))?.members ;
            if(!members) return 1;
            socket.to(chatId).emit('newMsg' , { chatId , senderId , text , imgs } );
            const users= connectedUsers.filter( ( { userId , socketId } ) => {
                const valid = 
                    !onChat[chatId]?.has( socketId ) &&
                    userId !== senderId && 
                    members.includes(userId);
                return valid;
            } ); 
            if( users.length > 0 ){
                users.forEach( ({ socketId }) => {
                    io.to(socketId).emit( 'server-notify' , { text , senderId,chatId } );
                } );
            };
        });
        

        socket.on('client-post',async( { userId , text } )=>{
            const friends=(await userModel.findById(userId))?.friends;
            if( !friends || friends.length == 0 ) return 1;
            const users=connectedUsers.filter( ( {userId} ) => {
                const valid=friends.includes( userId );
                return valid; 
            });
            // console.log( users);
            if( users.length > 0 ){
                users.forEach( ( { socketId } ) => {
                    io.to( socketId ).emit( 'server-post' , { userId , text } );
                });
            };
        });

        socket.on('client-comment',async( { postId , commentOwnerId , text , img } )=>{ 
            const postOwnerId=( await postModel.findById( postId ) )?.user;
            if( ! postOwnerId) return 1;
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == postOwnerId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-comment' , { postId , commentOwnerId , text ,img } );
            };
        });

        socket.on('client-post-like',async ( { postId , likeOwnerId , text } )=>{ 
            const postOwnerId=( await postModel.findById( postId ) )?.user;
            if( ! postOwnerId) return 1;
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == postOwnerId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-post-like' , { postId , likeOwnerId , text } );
            };
        });

        socket.on('client-comment-like',async( { commentId , likeOwnerId , text } )=>{ 
            const commentOwnerId=( await commentModel.findById( commentId ) )?.user;
            if( !commentOwnerId ) return 1;
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == commentOwnerId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-comment-like' , { commentId , likeOwnerId , text } );
            };
        });

        socket.on('client-follow',( { senderId , recipientId , text } )=>{ 
            const user=connectedUsers.find( ({ userId }) => {
                return userId == recipientId;
            });
            if( user ){
                io.to( user.socketId ).
                emit('server-follow',{ senderId , text });
            };
        });

        socket.on('client-request',( { senderId , recipientId , text } )=>{ 
            const user=connectedUsers.find( ({ userId }) => {
                return userId == recipientId;
            });
            if( user ){
                io.to(user.socketId).
                emit('server-request' , { senderId , text });
            };
        });

        socket.on('client-accept-request',( { senderId , recipientId , text } )=>{ 
            const user=connectedUsers.find( ({ userId }) => {
                return userId == recipientId;
            });
            if( user ){
                io.to(user.socketId).
                emit('server-accept-request', { senderId , text });
            };
        });

        socket.on('client-lesson-review',async( {lessonId,reviewOwnerId,text,stars})=>{ 
            const lessonOwnerId=( await lessonModel.findById( lessonId ) )?.admin;
            if( !lessonOwnerId) return 1;
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == lessonOwnerId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-lesson-review' , { lessonId,reviewOwnerId,text,stars });
            };
        });

        socket.on('client-quiz-review',async( {quizId,reviewOwnerId,text,stars})=>{ 
            const quizOwnerId=( await quizModel.findById( quizId ) )?.admin;
            if(!quizOwnerId) return 1;
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == quizOwnerId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-quiz-review' , { quizId,reviewOwnerId,text,stars });
            };
        });

        socket.on('client-attend-lesson',async( {lessonId,senderId,text})=>{ 
            const lessonOwnerId=( await lessonModel.findById( lessonId ))?.admin;
            if( !lessonOwnerId ) return 1;
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == lessonOwnerId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-attend-lesson' , { lessonId,senderId,text });
            };
        });

        socket.on('client-take-quiz',async( {quizId,senderId,text})=>{ 
            const quizOwnerId=( await quizModel.findById( quizId ))?.admin;
            if(!quizOwnerId) return 1;
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == quizOwnerId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-take-quiz' , { quizId,senderId,text });
            };
        });

        socket.on('client-vote-story',async( {storyId,senderId,text})=>{ 
            const storyOwnerId=( await storyModel.findById( quizId ))?.user;
            if(!storyOwnerId) return 1;
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == storyOwnerId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-vote-story' , { storyId,senderId,text });
            };
        });

        socket.on('client-like-reel',async( {reelId,senderId,text})=>{ 
            const reelOwnerId=( await storyModel.findById( reelId ))?.user;
            if( !reelOwnerId ) return 1;
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == reelOwnerId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-like-reel' , { reelId,senderId,text });
            };
        });

        socket.on('client-apply-jop',async( {jopId,senderId,text})=>{ 
            const jopOwnerId=( await jopModel.findById( jopId ))?.admin;
            if( !jopOwnerId) return 1;
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == jopOwnerId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-apply-jop' , { jopId,senderId,text });
            };
        });

        socket.on('client-request-join-group',async( {groupId,senderId,text})=>{ 
            const groupOwnerId=( await groupModel.findById( groupId ))?.admin;
            if( !groupOwnerId) return 1;
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == groupOwnerId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-request-join-group' , { groupId , senderId ,text });
            };
        });

        socket.on('client-accept-join-group',async( { groupId,recipientId,text })=>{ 
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == recipientId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-accept-join-group' ,  { groupId,recipientId,text } );
            };
        });

        socket.on('client-admin-group',async( {groupId,recipientId,text})=>{ 
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == recipientId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-admin-group' , { groupId , recipientId ,text });
            };
        });

        socket.on('client-added-to-chat',async( { chatId,recipientId,text })=>{ 
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == recipientId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-added-to-chat' , { chatId , recipientId ,text });
            };
        });

        socket.on('client-leave-chat',async( { chatId,senderId,text })=>{ 
            const members = (await chatModel.findById(chatId))?.members ;
            if( !members ) return 1;
            const users= connectedUsers.filter( ( { userId , socketId } ) => {
                const valid= members.includes ( userId );
                return valid;
            } ); 
            if( users.length > 0 ){
                users.forEach( ({socketId}) => {
                    io.to(socketId).emit( 'server-leave-chat' ,
                        { text,senderId,chatId} );
                } );
            };
        });

        socket.on('client-admin-chat',async( {chatId,recipientId,text})=>{ 
            const user=connectedUsers.find( ( { userId } ) => {
                return userId == recipientId;
            });
            if( user ){
                io.to( user.socketId )
                .emit( 'server-admin-chat' , { chatId , recipientId ,text });
            };
        });
    });
    };



module.exports = socket;