class Features {
    constructor(query,querystr){
        this.query= query;
        this.querystr=querystr;
        this.keyword=this.querystr.keyword;
        //console.log(this.query);
        console.log(this.keyword);
    };

    find = ()=>{
        if(this.keyword){
        return (this.query.find({
            name:{$regex: `${this.keyword}`,$options:'i'}
        }))
    }
    else{
    return(
        this.query
    )

    }

}

}

module.exports = Features;