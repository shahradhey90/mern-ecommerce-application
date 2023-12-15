const express = require('express');
const { getAllProducts, insertProduct, updateProduct, deleteProduct, getProductDetails, errorChecking, createProductReview, getProductReviews, deleteProductReviews } = require('../controller/productController');
const {isAuthenticate, isRole} = require('../middleware/authenticate');

const router = express.Router();

router.get('/products', getAllProducts)
router.post('/admin/product/new',isAuthenticate, isRole('admin'),insertProduct)
router.route('/admin/product/:id').put(isAuthenticate, isRole('admin'), updateProduct).delete(isAuthenticate, isRole('admin'),deleteProduct)
router.route('/product/:id').get(getProductDetails)
router.route('/product/createReview').post(isAuthenticate,createProductReview)
router.route('/product/review/:id').get(getProductReviews).delete(isAuthenticate,deleteProductReviews)

router.route('/error').get(errorChecking)





module.exports = router;
