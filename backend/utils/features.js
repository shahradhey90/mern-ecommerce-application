class Features {
    constructor(query,querystr){
        this.query= query;
        this.querystr=querystr;
        this.keyword=this.querystr.keyword;
        //console.log(this.query);
        console.log(this.keyword);
    };

    search(){
    const findOption = this.keyword?
        {
            name:{$regex: `${this.keyword}`,$options:'i'}
        }
    : {};
    
    this.query = this.query.find(findOption);

    return this;

}

filter(){
    const newQueryStr = {...this.querystr};
    const removeWord = ['page','keyword','limit'];
    removeWord.forEach(remove => {delete newQueryStr[remove]});
    console.log(newQueryStr);
    let queryStr = JSON.stringify(newQueryStr);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>{return `$${key}`})
    console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;

}

pagination(resultPerPage){
    const currentPage = Number(this.querystr.page) || 1;
    const skip = resultPerPage * (currentPage-1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;

}

}

module.exports = Features;