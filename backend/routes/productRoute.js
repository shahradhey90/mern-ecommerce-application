const express = require('express');
const { getAllProducts, insertProduct, updateProduct, deleteProduct, getProductDetails, errorChecking } = require('../controller/productController');

const router = express.Router();

router.get('/products', getAllProducts)
router.post('/product/new',insertProduct)
router.route('/product/:id').put(updateProduct).delete(deleteProduct).get(getProductDetails)
router.route('/error').get(errorChecking)





module.exports = router;
