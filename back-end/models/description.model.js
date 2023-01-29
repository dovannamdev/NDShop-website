const { mysql } = require("../configs/mysql.config");

const ProductDescModel = {
  getDescByProductCode: async (productsCode) => {
    try {
      const prdDesc = await mysql.query(
        `SELECT * FROM DescriptionsDetail WHERE productsCode='${productsCode}'`
      );
      return prdDesc || {};
    } catch (error) {
      return {};
    }
  },

  createProductDesc: async (productDesc, productCode) => {
    try {
      for (let i = 0; i < productDesc?.length; i++) {
        await mysql.query(
          `INSERT INTO DescriptionsDetail(content, photo, createdDate, productsCode) VALUES('${productDesc[i]?.content}', '${productDesc[i]?.photo}', Now(), '${productCode}')`
        );
      }
      return true
    } catch (error) {
      return false;
    }
  },

  deleteProductDesc: async (productCode) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM DescriptionsDetail WHERE productsCode='${productCode}'`
      );
      return deleteRes ? true : false;
    } catch (error) {
      return false;
    }
  },
};

module.exports = ProductDescModel;
