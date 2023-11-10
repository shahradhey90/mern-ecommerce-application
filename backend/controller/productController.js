
const product = require('../model/productModel')
const {CustomError} = require('../utils/errorHandler')
const asyncErrorHandler = require('../utils/asyncErrorHandler')

//get all Product

const getAllProducts = asyncErrorHandler(async (req,res,next)=>{
    const allProducts = await product.find();
    res.json({success:true,allProducts});
})


//Insert Product
const insertProduct = asyncErrorHandler(async (req,res,next)=>{
    const newProduct = new product(req.body);
    await newProduct.save();
    res.json({success:true,newProduct});
})


//updateProduct
const updateProduct = asyncErrorHandler(async (req,res,next)=>{
let updatedProduct = await product.findById(req.params.id);

if(!updatedProduct){

    next(new CustomError('Product not found',404));
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
    }
    else{
        deletedProduct = await product.deleteOne({_id:req.params.id})
        res.status(200).json({success:true, message:'deleted'})
    }

})

//getSingleProduct
const getProductDetails = asyncErrorHandler(async (req,res,next)=>{
    let findProduct = await product.findById(req.params.id);
    if(!findProduct){
        next(new CustomError('Product not found',404));
    }
    else{
        findProduct = await product.findById(req.params.id)
        res.status(200).json({success:true, product:findProduct})
    }

})

//Error Checking
const errorChecking = asyncErrorHandler((req,res,next)=>{
   console.log("Hi");
    

})
module.exports = {getAllProducts, insertProduct, updateProduct, deleteProduct, getProductDetails,errorChecking};