const { mysql } = require("../configs/mysql.config");

const OrderDetailModel = {
  createOrderDetail: async (
    orderId,
    orderProd,
    numOfProd,
    numericalOrder,
    priceUnit,
    stockId
  ) => {
    try {
      const response = await mysql.query(
        `INSERT INTO OrdersProduct(orderId, productsCode, numOfProd, numericalOrder, unitPrice, stockId, promo) VALUES(${Number(
          orderId
        )}, '${orderProd?.code}', ${Number(numOfProd)}, ${Number(
          numericalOrder
        )}, ${Number(priceUnit)}, ${Number(stockId)}, ${Number(orderProd?.discount)})`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  getProductByOrderId: async (orderId) => {
    try {
      const product = await mysql.query(
        `SELECT op.*, pd.name, sd.initPrice
         FROM OrdersProduct op JOIN Products pd ON op.productsCode = pd.code JOIN stockDetail sd ON sd.stockId = op.stockId AND sd.productCode = op.productsCode WHERE op.orderId=${Number(
           orderId
         )}`
      );
      return product || [];
    } catch (error) {
      return [];
    }
  },

  checkProductHaveOrder: async (code) => {
    try {
      const order = await mysql.query(
        `SELECT op.* FROM OrdersProduct op WHERE op.productsCode='${code}'`
      );
      return order?.length ? true : false;
    } catch (error) {
      return true;
    }
  },

  checkProductStockHaveOrder: async (code, stockId) => {
    try {
      const order = await mysql.query(
        `SELECT op.* FROM OrdersProduct op WHERE op.productsCode='${code}' AND op.stockId=${Number(stockId)}`
      );
      return order?.[0] || [];
    } catch (error) {
      return {};
    }
  },
};

module.exports = OrderDetailModel;
