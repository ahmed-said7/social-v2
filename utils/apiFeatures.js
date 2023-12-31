const searchQuery = require("./search");

class apiFeatures {
    constructor(query,queryObj){
        this.query = query;
        this.queryObj = queryObj;
    };
    filter(filter){
        let queryFilter={...this.queryObj};
        const excludedFields=['sort','select','limit','page','keyword'];
        excludedFields.forEach ((ele) => delete queryFilter[ele]);
        let queryString = JSON.stringify(queryFilter);
        queryString=queryString.replace( /gt|gte|lte|lt/ig , (val)=> `$${val}`);
        queryFilter=JSON.parse(queryString);
        queryFilter={ ...queryFilter , ...filter };
        this.query=this.query.find(queryFilter);
        return this;
    };
    sort(){
        if(this.queryObj.sort){
            const sort=this.queryObj.sort.split(',').join(' ');
            this.query=this.query.select(sort);
        };
        return this;
    };
    select(){
        if(this.queryObj.select){
            const select=this.queryObj.select.split(',').join(' ');
            this.query=this.query.select(select);
        };
        return this;
    };
    search(name){
        if(this.queryObj.keyword && name){
            const obj=searchQuery(this.queryObj.keyword);
            const keys=Object.keys(obj);
            if( keys.includes(name) ){
                this.query =this.query.find(obj[name]);
            };
        };
        return this;
    };
    pagination(endIndex){
        const Obj={};
        let page=this.queryObj.page*1 || 1;
        let limit=this.queryObj.limit*1 || 10;
        Obj.numOfPages=Math.ceil(endIndex / limit);
        if(endIndex > page*limit){
            Obj.nextPage=page+1;
        };
        if(page>1){
            Obj.previousPage=page-1;
        };
        let skip=(page-1)*limit;
        Obj.currentPage=page;
        Obj.limit=limit;
        Obj.numOfDocs=endIndex;
        this.Obj=Obj;
        this.query=this.query.skip(skip).limit(limit);
        return this;
    };
    population(options){
        if(options){
            this.query=this.query.populate(options);
        };
        return this;
    };
};

module.exports=apiFeatures;