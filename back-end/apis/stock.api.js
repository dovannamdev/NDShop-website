const stockApi = require("express").Router();
const stockController = require("../controllers/stock.controller");

stockApi.post('/create', stockController.createStockData);
stockApi.put('/:stockId/update', stockController.updateStockData);
stockApi.put('/:stockId/status', stockController.changeStockProductStatus);
stockApi.get('/', stockController.getStockList);
stockApi.get('/:stockId', stockController.getStockDetail);
stockApi.delete('/:stockId', stockController.deleteStockData);
stockApi.delete('/:stockId/product/delete', stockController.deleteStockProduct);

module.exports = stockApi;
