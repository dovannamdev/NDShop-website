const brandApi = require("express").Router();
const brandController = require("../controllers/brand.controller");

brandApi.get('/list', brandController.getBrandList);

module.exports = brandApi;
