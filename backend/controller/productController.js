
const product = require('../model/productModel')
const {CustomError} = require('../utils/errorHandler')
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const Features = require('../utils/features')

//get all Product

const getAllProducts = asyncErrorHandler(async (req,res,next)=>{
    const allProducts = product.find();
    const productCount = await product.countDocuments();
    const findProduct = new Features(allProducts,req.query).search().filter().pagination(5);
    const allProducts1 = await findProduct.query;
    res.json({success:true,allProducts1,productCount});
})


//Insert Product
const insertProduct = asyncErrorHandler(async (req,res,next)=>{
    if(!req.user){
        next(new CustomError("Admin user not found",201));
        return;
    }
    req.body.user = req.user.id;
    const newProduct = new product(req.body);
    await newProduct.save();
    res.json({success:true,newProduct});
})


//updateProduct
const updateProduct = asyncErrorHandler(async (req,res,next)=>{
let updatedProduct = await product.findById(req.params.id);

if(!updatedProduct){

    next(new CustomError('Product not found',404));
    return;
}
else{
    updatedProduct = await product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:false});
    res.status(200).json({success:true, updatedProduct})
}
})


//Delete Product
const deleteProduct = asyncErrorHandler(async (req,res,next)=>{
    let deletedProduct = await product.findById(req.params.id);
    if(!deletedProduct){
        next(new CustomError('Product not found',404));
        return;
    }
    else{
        deletedProduct = await product.deleteOne({_id:req.params.id})
        res.status(200).json({success:true, message:'deleted'})
    }

})

//getSingleProduct
const getProductDetails = asyncErrorHandler(async (req,res,next)=>{
    console.log("Hi");
    let findProduct = await product.findById(req.params.id);
    
    if(!findProduct){
        return next(new CustomError('Product not found',404));
    }
    else{
        findProduct = await product.findById(req.params.id)
        res.status(200).json({success:true, product:findProduct})
    }

})


//Create New Review or update the review

const createProductReview = asyncErrorHandler(async (req,res,next)=>{
   

    const {rating,comment,productId} =  req.body;

    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment:comment
    };

    const productf = await product.findById(productId);
    const isReview = productf.reviews.find((rev) => {
       return rev.user.toString() === review.user.toString();
    })
    if(isReview){
     
        productf.reviews.forEach(rev => {
            if (rev.user.toString() === review.user.toString()){
                //rev.user =  review.user.toNumber();
                //rev.name = review.name;
                rev.rating = review.rating;
                rev.comment = review.comment;
            }
        })
    }

    else{
          productf.reviews.push(review);
    }
    
    let sum = 0;
    productf.reviews.forEach(rev => {
               sum = (sum + rev.rating);
        }
    )
    productf.rating  = sum/(productf.reviews.length);

    await productf.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        review:"successfully updated"

    })

    }





    
)



const getProductReviews = asyncErrorHandler(async (req,res,next)=>{
    const products = await product.find({_id:req.params.id}).populate({path:'reviews.user'});
    
    //console.log(products[0].reviews);
    res.status(200).json({
        success:true,
        reviews:products[0].reviews
    })

});

const deleteProductReviews = asyncErrorHandler(async (req,res,next)=>{
    const products = await product.find({_id:req.params.id});
    const review_id = req.body.id;

    //const newReview = products.reviews.find((rev)=>{
        
      //  if(rev.id === review_id && rev.user!=req.user._id && rev.role != 'admin'){
        //      next("Only User who created the review or Admin can delete the review.",403);
       // }
 //      return rev.id != review_id;
//})


       //const result = await product.updateOne({_id:req.params.id},{$pull: {$and: [{'review._id':review_id}, {'review.user._id':req.user._id}]}});
       //const result = await product.updateOne({_id:req.params.id},{"$pull": {"reviews.$._id":review_id}});
       const result = await product.updateMany({_id:req.params.id},
        {$pull: 
            {'reviews': {$and : 
                [{_id:review_id},{user:{_id:req.user._id}}]
            }}
        });
  
     console.log(result);
        

    

    //products.reviews = newReview;
    
    //products.save({validateBeforeSave:false});
    
    
    res.status(200).json({
        success:true,
        reviews:"Successfully delete"
    })

});



//Error Checking
const errorChecking = asyncErrorHandler((req,res,next)=>{
   
    

})
module.exports = {getAllProducts, insertProduct, updateProduct, deleteProduct, getProductDetails,errorChecking,createProductReview, getProductReviews, deleteProductReviews};