const productApi = require('express').Router();
const productController = require('../controllers/product.controller')

productApi.get('/', productController.getProduct);
productApi.get('/all', productController.getAllProducts);
productApi.get('/search', productController.getSearchProducts);
productApi.get('/configuration/all', productController.getProductConfiguration);
productApi.get('/selling/list', productController.getSellingProduct);

module.exports = productApi;