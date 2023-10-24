const socket=( io )=>{
    let online_users=[];
    io.on('connection',(socket)=>{
        socket.on('user-join',(data)=>{
            online_users.push({ socketId:socket.id , userId:data.userId });
        });
        socket.on('disconnect',()=>{
            online_users=online_users.filter( (ele)=> ele.socketId != socket.id );
        });
        socket.on('client-msg',(data)=>{
            let users=online_users.filter( (ele)=>{
                if( data.recipient.includes(ele.userId) ){
                    return ele;
                };
            });
            delete data.recipient;
            if( users.length > 0 ){
                users.forEach((ele)=>{
                    io.to(ele.socketId).emit('server-msg',data)
                });
            };
        });
        socket.on('client-post',(data)=>{ 
            let users=online_users.filter( (ele) => {
                if( data.followers.includes(ele.userId) ){
                    return ele;
                };
            });
            delete data.followers;
            if( users.length > 0 ){
                users.forEach( (ele) => {
                    io.to(ele.socketId).emit('server-post',data)
                });
            };
        });
        socket.on('client-comment',(data)=>{ 
            let users=online_users.filter( (ele) => {
                if( data.followers.includes(ele.userId) ){
                    return ele;
                };
            });
            delete data.followers;
            if( users.length > 0 ){
                users.forEach( (ele) => {
                    io.to(ele.socketId).emit('server-comment',data)
                });
            };
        });
        socket.on('client-like',(data)=>{ 
            let users=online_users.filter( (ele) => {
                if( data.followers.includes(ele.userId) ){
                    return ele;
                };
            });
            delete data.followers;
            if( users.length > 0 ){
                users.forEach( (ele) => {
                    io.to(ele.socketId).emit('server-like',data)
                });
            };
        });

        socket.on('client-follow',( data )=>{ 
            let user=online_users.find( (ele) => {
                if( data.user == ele.userId ){
                    return ele;
                };
            });
            delete data.user;
            if( user ){
                io.to(user.socketId).emit('server-follow',data)
            };
        });

        socket.on('client-request',( data )=>{ 
            let user=online_users.find( (ele) => {
                if( data.user == ele.userId ){
                    return ele;
                };
            });
            delete data.user;
            if( user ){
                io.to(user.socketId).emit( 'server-request' , data );
            };
        });

        socket.on('client-accept-request',( data )=>{ 
            let user=online_users.find( (ele) => {
                if( data.user == ele.userId ){
                    return ele;
                };
            });
            delete data.user;
            if( user ){
                io.to(user.socketId).emit( 'server-accept-request' , data );
            };
        });

        socket.on('client-like',( data )=>{ 
            let user=online_users.find( (ele) => {
                if( data.user == ele.userId ){
                    return ele;
                };
            });
            delete data.user;
            if( user ){
                io.to(user.socketId).emit( 'server-like' , data );
            };
        });

    });

};

module.exports = socket;