const { mysql } = require("../configs/mysql.config");

const StockModel = {
  createStockData: async (receiver) => {
    try {
      const result = await mysql.query(
        `INSERT INTO stocks(createdDate, receiver) VALUES(Now(), '${receiver}')`
      );
      if (result) {
        const lastStock = await mysql.query(
          `SELECT _id FROM stocks ORDER BY _id DESC LIMIT 1 OFFSET 0`
        );
        return { stock_id: lastStock?.[0]?._id };
      }
      return {};
    } catch (error) {
      return {};
    }
  },

  updateStockData: async (receiver, stockId) => {
    try {
      const result = await mysql.query(
        `UPDATE stocks SET receiver='${receiver}' WHERE _id=${Number(stockId)}`
      );
      return result ? true : false;
    } catch (error) {
      return false;
    }
  },

  changeStockProductStatus: async (stockId, productCode, status) => {
    try {
      const result = await mysql.query(
        `UPDATE stockDetail SET status=${Number(status)} WHERE stockId=${Number(
          stockId
        )} AND productCode='${productCode}'`
      );
      return result ? true : false;
    } catch (error) {
      return false;
    }
  },

  changeStockProductQuantity: async (stockId, productCode, currentQuantity) => {
    try {
      const result = await mysql.query(
        `UPDATE stockDetail SET currentQuantity=${Number(
          currentQuantity
        )} WHERE stockId=${Number(stockId)} AND productCode='${productCode}'`
      );
      return result ? true : false;
    } catch (error) {
      return false;
    }
  },

  createStockDetail: async (stockDetail) => {
    try {
      const { stockId, productCode, initQuantity, initPrice, status } =
        stockDetail;
      const result =
        await mysql.query(`INSERT INTO stockDetail(stockId, productCode, initQuantity, initPrice, status) 
      VALUES(${Number(stockId)}, '${productCode}', ${Number(
          initQuantity
        )}, ${Number(initPrice)}, ${status})`);

      return result ? true : false;
    } catch (error) {
      return false;
    }
  },

  getStockData: async () => {
    try {
      const result = await mysql.query(
        `SELECT st.*, ad.fullName as receiverName FROM stocks st JOIN Admins ad ON st.receiver = ad._id ORDER BY _id DESC`
      );
      return result || [];
    } catch (error) {
      return [];
    }
  },

  getStockDetail: async (stockId) => {
    try {
      const result = await mysql.query(
        `SELECT sd.*, pr.name as productName FROM stockDetail sd JOIN Products pr ON sd.productCode = pr.code WHERE sd.stockId=${Number(
          stockId
        )} ORDER BY pr.createdDate DESC`
      );
      return result || [];
    } catch (error) {
      return [];
    }
  },

  deleteStockData: async (stockId) => {
    try {
      const result = await mysql.query(
        `DELETE FROM stocks WHERE _id=${Number(stockId)}`
      );
      return result ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteStockDetail: async (stockId) => {
    try {
      const result = await mysql.query(
        `DELETE FROM stockDetail WHERE stockId=${Number(stockId)}`
      );
      return result ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteStockProduct: async (stockId, productCode) => {
    try {
      const result = await mysql.query(
        `DELETE FROM stockDetail WHERE stockId=${Number(
          stockId
        )} AND productCode='${productCode}'`
      );

      return result ? true : false;
    } catch (error) {
      return false;
    }
  },

  findProductStock: async (stockId, productCode) => {
    try {
      const result = await mysql.query(
        `SELECT * FROM stockDetail WHERE stockId=${Number(
          stockId
        )} AND productCode='${productCode}'`
      );
      return result?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  getStockHaveProduct: async (productCode) => {
    try {
      const result = await mysql.query(
        `SELECT * FROM stockDetail WHERE productCode='${productCode}' AND status = 1 ORDER BY stockId ASC`
      );

      for (let i = 0; i < result?.length; i++) {
        const soldQuantity = await mysql.query(
          `SELECT * FROM OrdersProduct WHERE productsCode='${productCode}' AND stockId=${Number(
            result?.[i]?.stockId
          )}`
        );
        const quantity = soldQuantity?.reduce((pre, curr) => {
          return pre + curr?.numOfProd;
        }, 0);
        const remainingQuantity =
          Number(result?.[i]?.initQuantity) - Number(quantity);
        result[i].availableQuantity = remainingQuantity;
      }
      return result
        ? result?.filter((item) => item?.availableQuantity > 0)
        : [];
    } catch (error) {
      console.log("getStockHaveProduct error >>>> ", error);
      return [];
    }
  },

  getStockProductQuantityAvalable: async (stockId, productCode) => {
    try {
      const result = await mysql.query(
        `SELECT * FROM stockDetail WHERE productCode='${productCode}' AND stockId=${Number(
          stockId
        )}`
      );

      const soldQuantity = await mysql.query(
        `SELECT * FROM OrdersProduct WHERE productsCode='${productCode}' AND stockId=${Number(
          result?.[0]?.stockId
        )}`
      );
      const quantity = soldQuantity?.reduce((pre, curr) => {
        return pre + curr?.numOfProd;
      }, 0);
      const remainingQuantity =
        Number(result?.[0]?.initQuantity) - Number(quantity);
      result[0].availableQuantity = remainingQuantity;

      return result?.[0] || [];
    } catch (error) {
      console.log("getStockHaveProduct error >>>> ", error);
      return [];
    }
  },

  filterStock: async (dateFrom, dateTo) => {
    try {
      const result = await mysql.query(
        `SELECT sd.*, s.createdDate FROM stocks s JOIN stockDetail sd ON s._id=sd.stockId WHERE date(s.createdDate) >= date('${dateFrom.toISOString()}') AND date(s.createdDate) <= date('${dateTo.toISOString()}')`
      );
      return result || [];
    } catch (error) {
      return [];
    }
  },
};

module.exports = StockModel;
