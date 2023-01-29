const statisticApi = require('express').Router();
const statisticController = require('../controllers/statictis.controller');

// api: thống kê doanh thu theo tháng
statisticApi.get('/month-revenue', statisticController.getStaMonthRevenue);

// api: thống kê doanh thu theo năm
statisticApi.get('/annual-revenue', statisticController.getStaAnnualRevenue);

statisticApi.get('/report', statisticController.getReport);


module.exports = statisticApi;
