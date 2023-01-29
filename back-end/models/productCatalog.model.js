const { mysql } = require("../configs/mysql.config");

const CatalogModel = {
  createProductCatalog: async(catalogLst, productCode) => {
    try {
      for(let ctl of catalogLst){
        await mysql.query(`INSERT INTO Catalogs(catalog, createdDate, productsCode) VALUES('${ctl}', Now(), '${productCode}')`)
      }
      return true
    } catch (error) {
      return false
    }
  },

  deleteProductCatalog: async(productCode) => {
    try {
      const result = await mysql.query(`DELETE FROM Catalogs WHERE productsCode='${productCode}'`)
      return result ? true : false
    } catch (error) {
      return false
    }
  },

  getCatalogByProductCode: async(code) => {
    try {
      const catalog = await mysql.query(`SELECT * FROM Catalogs WHERE productsCode='${code}'`)
      return catalog || []
    } catch (error) {
      return []
    }
  }
}

module.exports = CatalogModel;