const OrderModel = require("../models/order.model");
const moment = require("moment");
const StockModel = require("../models/stock.model");
const OrderDetailModel = require("../models/orderDetail.model");
const ProductModel = require("../models/product.model");

const getStaMonthRevenue = async (req, res) => {
  try {
    const { year } = req.query;
    const thisYearOrder = await OrderModel.filterOrderByDate({
      firstDate: new Date(`${year}-01-01`),
      lastDate: new Date(`${year}-12-31`),
      orderStatus: 2,
    });

    for (let i = 0; i < thisYearOrder?.length; i++) {
      const orderProduct = await OrderDetailModel.getProductByOrderId(
        thisYearOrder?.[i]?._id
      );
      thisYearOrder[i].productPrice = orderProduct?.reduce((pre, curr) => {
        return pre + ((curr?.unitPrice - (curr?.unitPrice * ((curr?.promo || 0) / 100))) * curr?.numOfProd);
      }, 0)
    }

    const lastYearOrder = await OrderModel.filterOrderByDate({
      firstDate: new Date(`${parseInt(year) - 1}-01-01`),
      lastDate: new Date(`${parseInt(year) - 1}-12-31`),
      orderStatus: 2,
    });

    for (let i = 0; i < lastYearOrder?.length; i++) {
      const orderProduct = await OrderDetailModel.getProductByOrderId(
        lastYearOrder?.[i]?._id
      );
      lastYearOrder[i].productPrice = orderProduct?.reduce((pre, curr) => {
        return pre + ((curr?.unitPrice - (curr?.unitPrice * ((curr?.promo || 0) / 100))) * curr?.numOfProd)
      }, 0)
    }


    let thisYear = [...Array(12).fill(0)],
      lastYear = [...Array(12).fill(0)];

    if (thisYearOrder?.length) {
      thisYearOrder.forEach((item) => {
        const month = new Date(item?.orderDate).getMonth();
        thisYear[month] += item?.productPrice + item?.transportFee
      });
    }

    if (lastYearOrder?.length) {
      lastYearOrder.forEach((item) => {
        const month = new Date(item?.orderDate).getMonth();
        thisYear[month] += item?.productPrice + item?.transportFee
      });
    }

    if (thisYearOrder && lastYearOrder)
      return res.status(200).json({ thisYear, lastYear });
  } catch (err) {
    console.log("err >>>> ", err);
    return res.status(400).json({});
  }
};

const getStaAnnualRevenue = async (req, res, next) => {
  try {
    const { startYear, endYear } = req.query;
    const orderList = await OrderModel.filterOrderByDate({
      firstDate: new Date(`${startYear}-01-01`),
      lastDate: new Date(`${endYear}-12-31`),
      orderStatus: 2,
    });

    for (let i = 0; i < orderList?.length; i++) {
      const orderProduct = await OrderDetailModel.getProductByOrderId(
        orderList?.[i]?._id
      );
      orderList[i].productPrice = orderProduct?.reduce((pre, curr) => {
        return pre + ((curr?.unitPrice - (curr?.unitPrice * ((curr?.promo || 0) / 100))) * curr?.numOfProd)
      }, 0)
    }

    let result = [
      ...Array(parseInt(endYear) + 1 - parseInt(startYear)).fill(0),
    ];

    if (orderList?.length) {
      orderList.forEach((item) => {
        const resIndex =
          new Date(item.orderDate).getFullYear() - parseInt(startYear);
        result[resIndex] += item?.productPrice + item?.transportFee;
      });
    }
    return res.status(200).json({ data: orderList?.length ? result : [] });
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};

const getReport = async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req?.query;
    const orderList = await OrderModel.filterOrderByDate({
      firstDate: new Date(moment(dateFrom, "DD-MM-YYYY").format("YYYY-MM-DD")),
      lastDate: new Date(moment(dateTo, "DD-MM-YYYY").format("YYYY-MM-DD")),
      orderStatus: 2,
    });

    for (let i = 0; i < orderList?.length; i++) {
      const orderProduct = await OrderDetailModel.getProductByOrderId(
        orderList?.[i]?._id
      );

      orderList[i].productPrice = orderProduct?.reduce((pre, curr) => {
        return pre + ((curr?.unitPrice - (curr?.unitPrice * ((curr?.promo || 0) / 100))) * curr?.numOfProd)
      }, 0);

      orderList[i].spentPrice = orderProduct?.reduce((pre, curr) => {
        return pre + (curr?.initPrice  * curr?.numOfProd)
      }, 0);

      
    }

    const turnoverByDate = [];
    orderList?.forEach((item) => {
      const formatDate = moment(item?.orderDate).format("DD-MM-YYYY");
      const findDate = turnoverByDate?.findIndex(
        (it) => it?.orderDate === formatDate
      );
      if (findDate >= 0) {
        turnoverByDate[findDate].money =
          Number(turnoverByDate[findDate]?.money) + item?.productPrice;
        turnoverByDate[findDate].spentMoney =
        Number(turnoverByDate[findDate]?.spentMoney) + item?.spentPrice;
      } else {
        turnoverByDate?.push({
          orderDate: formatDate,
          money: item?.productPrice,
          spentMoney: item?.spentPrice
        });
      }
    });

    const stockList = await StockModel.filterStock(
      new Date(moment(dateFrom, "DD-MM-YYYY").format("YYYY-MM-DD")),
      new Date(moment(dateTo, "DD-MM-YYYY").format("YYYY-MM-DD"))
    );

    const spentByDate = [];
    stockList?.forEach((item) => {
      const formatDate = moment(item?.createdDate).format("DD-MM-YYYY");
      const findDate = spentByDate?.findIndex(
        (it) => it?.createdDate === formatDate
      );
      if (findDate >= 0) {
        spentByDate[findDate].money =
          Number(spentByDate[findDate]?.money) +
          Number(item?.initQuantity) * Number(item?.initPrice);
      } else {
        spentByDate?.push({
          createdDate: formatDate,
          money: Number(item?.initQuantity) * Number(item?.initPrice),
        });
      }
    });

    const totalTurnover = turnoverByDate?.reduce((pre, crr) => {
      return pre + crr.money;
    }, 0);
    const totalTurnoverSpent = turnoverByDate?.reduce((pre, crr) => {
      return pre + crr.spentMoney;
    }, 0);
    const totalSpent = spentByDate?.reduce((pre, crr) => {
      return pre + crr.money;
    }, 0);

    return res.status(200).json({
      success: true,
      payload: {
        turnover: turnoverByDate || [],
        spent: spentByDate || [],
        totalTurnover: Math.round(totalTurnover) || 0,
        totalSpent:  Math.round(totalSpent) || 0,
        totalTurnoverSpent: Math.round(totalTurnoverSpent) || 0
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({});
  }
};

module.exports = { getStaAnnualRevenue, getStaMonthRevenue, getReport };
