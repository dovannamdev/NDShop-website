const { mysql } = require("../configs/mysql.config");

const DetailProductModel = {
  getDetailByProductId: async (productId) => {
    try {
      const productDetail = await mysql.query(
        `SELECT * FROM detailProducts WHERE idProduct=${productId}`
      );
      return productDetail?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  createProductDetail: async ({
    idProduct,
    warranty,
    catalogs,
    ...detailRest
  }) => {
    try {
      const {
        chipBrand,
        processorCount,
        series,
        detail,
        displaySize,
        display,
        operating,
        disk,
        ram,
        pin,
        weight,
      } = detailRest;
      
      const response =
        await mysql.query(`INSERT INTO detailProducts(idProduct, chipBrand, processorCount, series, detail, displaySize, display, operating, disk, ram, pin, weight, warranty, catalogs) VALUES(
        ${Number(idProduct)}, '${chipBrand}', ${Number(
          processorCount
        )}, ${Number(
          series
        )}, '${detail}', '${displaySize}', '${display}', '${operating}', '${disk}', '${ram}', '${pin}', '${weight}', ${Number(
          warranty
        )}, '${JSON.stringify(catalogs)}'
      )`);

      return response ? true : false;
    } catch (error) {
      return {};
    }
  },

  deleteProductDetail: async (productId) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM detailProducts WHERE idProduct=${Number(productId)}`
      );
      return deleteRes ? true : false;
    } catch (error) {
      return false;
    }
  },
};

module.exports = DetailProductModel;
