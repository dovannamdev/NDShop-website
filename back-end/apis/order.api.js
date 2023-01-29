const orderApi = require('express').Router();
const orderController = require('../controllers/order.controller');

orderApi.post('/', orderController.postCreateOrder);
orderApi.get('/list', orderController.getOrderList);
orderApi.get('/:orderId/info', orderController.getOrderDetail);
orderApi.get('/product', orderController.getOrderProduct);
orderApi.get('/check-user-product', orderController.checkUserOrderProduct);
orderApi.put('/:orderId/cancel', orderController.cancelOrder);
orderApi.put('/:orderId/delivery/shipper',orderController.changeDeliveryShipper);
orderApi.get('/shipper/:shipperId', orderController.getShipperOrder);
orderApi.put('/delivery/:deliveryId/status', orderController.changeDeliveryStatus);
orderApi.get('/delivery/:deliveryId/status', orderController.getListDeliveryStatus);


module.exports = orderApi;