const searchQuery=(val)=>{
    return {
        chat:{name:{$regex:val}},
        lesson:{title:{$regex:val}}
        ,group : {name:{$regex:val}},
        comment:{text:{$regex:val}},
        post:{text:{$regex:val}},
        user:{name:{$regex:val}},
        quiz:{title:{$regex:val}},
        jop:{title:{$regex:val}}
    };
};

module.exports = searchQuery;