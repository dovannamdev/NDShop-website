const { mysql } = require("../configs/mysql.config");

const ProductModel = {
  getAllProduct: async (limit, offset, search, role, priceFrom, priceTo) => {
    try {
      const limitOffset =
        limit && offset && limit !== "undefined" && offset !== "undefined"
          ? `LIMIT ${limit} OFFSET ${offset * limit}`
          : "";
      const product = await mysql.query(
        `SELECT pd.*, b.brandName, Cpu.chipBrand, Cpu.processorCount, Cpu.series as cpuSeries, Cpu.detail as cpuDetail
        FROM Products pd JOIN Brands b ON pd.brandId = b._id 
        JOIN Cpu ON pd.cpuId = Cpu._id
        WHERE ${search ? `pd.name like '%${search}%'` : "pd.name != ''"} ${
          role !== "admin"
            ? `AND pd.code in (SELECT productCode FROM stockDetail WHERE status=1 GROUP BY productCode)`
            : ""
        }  ORDER BY pd.createdDate DESC ${limitOffset}`
      );

      return product || [];
    } catch (error) {
      return [];
    }
  },

  getProductPQS: async (productCode) => {
    try {
      let productInfo = [];
      productInfo = await mysql.query(
        `SELECT * FROM stockDetail WHERE productCode='${productCode}' AND status=1 AND currentQuantity > 0 ORDER BY stockId ASC`
      );

      if (!productInfo?.length) {
        productInfo = await mysql.query(
          `SELECT * FROM stockDetail WHERE productCode='${productCode}' AND status=1 ORDER BY stockId ASC`
        );
      }

      if (productInfo?.length) {
        return productInfo[0];
      }
    } catch (error) {
      return {};
    }
  },

  getProductQuantity: async (productCode, stockId) => {
    try {
      const productInfo = await mysql.query(
        `SELECT * FROM stockDetail WHERE productCode='${productCode}' AND stockId=${Number(
          stockId
        )}`
      );
      return productInfo?.[0] || {};
    } catch (error) {
      console.log("error >> ", error);
      return {};
    }
  },

  getAllProductQuantity: async (search) => {
    try {
      const quantity = await mysql.query(
        `SELECT COUNT(code) as product_quantity FROM Products WHERE ${
          search ? `name like '%${search}%'` : "name != ''"
        } AND code in (SELECT productCode FROM stockDetail WHERE status=1 GROUP BY productCode)`
      );
      return quantity?.[0]?.product_quantity || 0;
    } catch (error) {
      return 0;
    }
  },

  getProductCodeAllQuantity: async (code) => {
    try {
      const productInStock = await mysql.query(`SELECT * FROM stockDetail WHERE productCode='${code}'`);
      let total = 0
      for (let i=0; i< productInStock?.length; i++){
        const soldQuantity = await mysql.query(`SELECT op.* FROM OrdersProduct op JOIN Orders ors ON op.orderId = ors._id WHERE op.productsCode='${code}' AND op.stockId=${Number(productInStock?.[i]?.stockId)} AND ors.orderStatus != 3 AND ors.orderStatus != 4 AND ors.orderStatus != 6`)
        const quantity = soldQuantity?.reduce((pre, curr) => { return pre + curr?.numOfProd}, 0)
        const remainingQuantity = Number(productInStock?.[i]?.initQuantity) - Number(quantity)
        total = total + remainingQuantity
      }
      return total;
    } catch (error) {
      return 0;
    }
  },

  getProductCodeInitPrice: async (code) => {
    try {
      const productInStock = await mysql.query(`SELECT * FROM stockDetail WHERE productCode='${code}'`);
      const sumPrice = productInStock?.reduce((pre, curr) => { return pre + curr.initPrice}, 0 )
      const averagePrice = sumPrice / productInStock?.length
      return averagePrice || 0
    } catch (error) {
      return 0
    }
  },

  getProductByCode: async (code) => {
    try {
      const product = await mysql.query(
        `SELECT pd.*, b.brandName, Cpu.chipBrand, Cpu.processorCount, Cpu.series as cpuSeries, Cpu.detail as cpuDetail
        FROM Products pd JOIN Brands b ON pd.brandId = b._id 
        JOIN Cpu ON pd.cpuId = Cpu._id
        WHERE pd.code='${code}'`
      );

      return product?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  findProductWithCode: async (code) => {
    try {
      const product = await mysql.query(
        `SELECT pd.*, b.brandName FROM Products pd JOIN brands b ON pd.brandId = b._id WHERE pd.code='${code}'`
      );

      return product?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  createNewProduct: async (
    { code, avt, discount, name, price, brand },
    {
      chipBrand,
      disk,
      display,
      displaySize,
      operating,
      pin,
      ram,
      warranty,
      weight,
    },
    descTitle
  ) => {
    try {
      const response =
        await mysql.query(`INSERT INTO Products(code, name, brandId, avt, description, createdDate, weight, warranty, cpuId, displaySize, disk, ram, display, pin, operating, price, discount) 
      VALUES('${code}', '${name}', ${Number(
          brand
        )}, '${avt}', '${descTitle}', Now(), '${weight}', '${warranty}', ${Number(
          chipBrand
        )}, '${displaySize}', '${disk}', '${ram}', '${display}', '${pin}', '${operating}', ${Number(
          price
        )}, ${Number(discount)})`);

      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateProduct: async ({ code, name, price, brandId, discount }) => {
    try {
      await mysql.query(
        `UPDATE Products SET code='${code}', name='${name}', brandId=${Number(
          brandId
        )}, price=${Number(price)}, discount=${Number(discount)} WHERE code='${code}'`
      );
      return true;
    } catch (error) {
      return false;
    }
  },

  deleteProductByCode: async (code) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM Products WHERE code='${code}'`
      );
      return deleteRes ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateProductQuantity: async (productCode, stock) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE Products SET stock=${Number(
          stock
        )} WHERE code='${productCode}'`
      );
      return updateRes ? true : false;
    } catch (error) {
      return false;
    }
  },

  getListCpu: async () => {
    try {
      const lstCpu = await mysql.query(`SELECT * FROM Cpu`);
      return lstCpu || [];
    } catch (error) {
      return [];
    }
  },

  getSellingProduct: async (limit, offset) => {
    try {
      const limitOffset =
        limit?.toString()?.length &&
        offset?.toString()?.length &&
        limit !== "undefined" &&
        offset !== "undefined"
          ? `LIMIT ${limit} OFFSET ${(offset - 1) * limit}`
          : "";

      const result = await mysql.query(`SELECT 
      pd.*, b.brandName, Cpu.chipBrand, Cpu.processorCount, Cpu.series as cpuSeries, Cpu.detail as cpuDetail,
        count(op.productsCode) as countOrder
      FROM OrdersProduct op JOIN Products pd ON op.productsCode = pd.code 
      JOIN Brands b ON pd.brandId = b._id 
      JOIN Cpu ON pd.cpuId = Cpu._id
      WHERE pd.code in (SELECT productCode FROM stockDetail WHERE status=1 GROUP BY productCode)
      GROUP BY op.productsCode
      ORDER BY countOrder desc ${limitOffset}`);

      return result || [];
    } catch (error) {
      return [];
    }
  },
};

module.exports = ProductModel;
