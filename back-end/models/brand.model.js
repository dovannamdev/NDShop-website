const { mysql } = require("../configs/mysql.config");

const BrandModel = {
  updateBrand: async (id, brandName) => {
    try {
      const response = await mysql.query(
        `UPDATE Brands SET brandName='${brandName}' WHERE _id=${Number(id)}`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  createBrand: async (brandName) => {
    try {
      const response = await mysql.query(
        `INSERT INTO Brands(brandName, createdDate) VALUES('${brandName}', Now())`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  removeBrand: async (brandId) => {
    try {
      const response = await mysql.query(
        `DELETE FROM Brands WHERE _id=${Number(brandId)}`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  findBrandWithName: async (brandName) => {
    try {
      const response = await mysql.query(
        `SELECT * FROM Brands WHERE brandName='${brandName}'`
      );
      return response?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  getAllBrand: async (limit, offset) => {
    try {
      const limitOffset =
        limit && offset && limit !== "undefined" && offset !== "undefined" ? `LIMIT ${limit} OFFSET ${offset * limit}` : "";

      const brand = await mysql.query(
        `SELECT * FROM Brands ORDER BY _id DESC ${limitOffset}`
      );
      return brand || [];
    } catch (error) {
      return [];
    }
  },

  countAllBrand: async () => {
    try {
      const brandQuantity = await mysql.query(
        `SELECT COUNT(_id) as brand_quantity FROM Brands`
      );
      return brandQuantity?.[0]?.brand_quantity || 0;
    } catch (error) {
      return 0;
    }
  },
};

module.exports = BrandModel;
