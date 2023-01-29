const ProductDescModel = require("../models/description.model");
const ProductModel = require("../models/product.model");
const DetailProductModel = require("../models/detailProduct.model");
const CatalogModel = require("../models/productCatalog.model");

const getAllProducts = async (req, res) => {
  try {
    let { page, perPage, role } = req.query;
    if (!page) page = 1;
    if (!perPage) perPage = 12;

    if (parseInt(page) === -1) {
      const result = await ProductModel.getAllProduct(
        undefined,
        undefined,
        "",
        role
      );
      for(let i = 0; i< result?.length; i++){
        const allQuantity = await ProductModel.getProductCodeAllQuantity(result?.[i]?.code)
        const initPrice = await ProductModel.getProductCodeInitPrice(result?.[i]?.code)
        result[i].allQuantity = allQuantity
        result[i].initPrice = initPrice.toFixed(0)
      }


      return res.status(200).json({ data: result });

    } else {
      const numOfProduct = await ProductModel.getAllProductQuantity();
      const result = await ProductModel.getAllProduct(
        perPage,
        String(parseInt(page) - 1),
        "",
        role
      );
      return res.status(200).json({ count: numOfProduct, data: result });
    }
  } catch (error) {
    res.send(400).json({ message: "Tải sản phẩm thất bại!" });
  }
};

const getProduct = async (req, res) => {
  try {
    const { code } = req.query;
    const product = await ProductModel.getProductByCode(code);

    const productDesc = await ProductDescModel.getDescByProductCode(code);
    const productCatalog = await CatalogModel.getCatalogByProductCode(code);
    return res.status(200).json({ product, productDesc, productCatalog });
  } catch (error) {
    res.status(400).json({ message: "Không thể lấy dữ liệu" });
  }
};

const getSearchProducts = async (req, res, next) => {
  try {
    let { value, page, perPage, priceFrom, priceTo } = req.query;

    if (!page) page = 1;
    if (!perPage) perPage = 12;
    const result = await ProductModel.getAllProduct(
      undefined,
      undefined,
      value,
      undefined
    );

    const filterResult = result?.filter((item) => {
      const discountPrice =
        item?.price -
        (item?.discount <= 0
          ? item?.discount
          : (item?.price * Number(item?.discount)) / 100);
      return (
        (priceFrom ? Number(discountPrice) >= priceFrom : item?.price > 0) &&
        (priceTo ? Number(discountPrice) <= priceTo : item?.price > 0)
      );
    });
    const lastResult = filterResult?.slice(
      (page - 1) * perPage,
      (page - 1) * perPage + perPage
    );

    return res
      .status(200)
      .json({ count: filterResult?.length, list: lastResult });
  } catch (error) {
    return res.status(400).json({ count: 0, list: [] });
  }
};

const getProductConfiguration = async (req, res, next) => {
  try {
    const lstCpu = await ProductModel.getListCpu();
    return res.json({
      success: true,
      payload: {
        cpu: lstCpu,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "Lấy cấu hình máy tính thất bại" });
  }
};

const getSellingProduct = async (req, res, next) => {
  try {
    const { limit, offset } = req?.query;
    const result = await ProductModel.getSellingProduct(limit, offset);

    return res.json({ success: true, payload: result });
  } catch (error) {
    return res.status(400).json({ message: "Lấy sản phẩm bán chạy thất bại" });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  getSearchProducts,
  getProductConfiguration,
  getSellingProduct,
};
