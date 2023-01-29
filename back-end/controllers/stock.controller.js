const OrderDetailModel = require("../models/orderDetail.model");
const ProductModel = require("../models/product.model");
const StockModel = require("../models/stock.model");

const createStockData = async (req, res) => {
  try {
    const stockData = req?.body;
    const { receiver, product } = stockData;
    const createStockResult = await StockModel.createStockData(receiver);

    if (createStockResult?.stock_id) {
      for (let i = 0; i < product?.length; i++) {
        await StockModel.createStockDetail({
          stockId: createStockResult?.stock_id,
          productCode: product[i]?.product?.code,
          initQuantity: product[i]?.initQuantity,
          initPrice: product[i]?.initPrice,
          status: 1,
        });

        const productInfo = await ProductModel.getProductByCode(
          product[i]?.product?.code
        );

        await ProductModel.updateProductQuantity(
          product[i]?.product?.code,
          productInfo?.stock + product[i]?.initQuantity
        );
      }
      return res.json({ success: true });
    }
    return res.status(400).json({ message: "Tạo đơn nhập hàng thất bại!" });
  } catch (error) {
    return res.status(400).json({ message: "Tạo đơn nhập hàng thất bại!" });
  }
};

const updateStockData = async (req, res) => {
  try {
    const stockData = req?.body;
    const { receiver, product } = stockData;
    const { stockId } = req?.params;

    const updateStock = await StockModel.updateStockData(receiver, stockId);
    if (updateStock) {
      for (let i = 0; i < product?.length; i++) {
        const findProduct = await StockModel.findProductStock(
          stockId,
          product[i]?.product?.code
        );

        if (!findProduct?.stockId) {
          const productInfo = await ProductModel.getProductByCode(
            product[i]?.product?.code
          );
          await ProductModel.updateProductQuantity(
            product[i]?.product?.code,
            productInfo?.stock + product[i]?.initQuantity
          );
        }
      }
      await StockModel.deleteStockDetail(stockId);

      for (let i = 0; i < product?.length; i++) {
        await StockModel.createStockDetail({
          stockId: stockId,
          productCode: product[i]?.product?.code,
          initQuantity: product[i]?.initQuantity,
          initPrice: product[i]?.initPrice,
          status: 1,
        });
      }
      return res.json({ success: true });
    }
    return res
      .status(400)
      .json({ message: "Cập nhật đơn nhập hàng thất bại!" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Cập nhật đơn nhập hàng thất bại!" });
  }
};

const changeStockProductStatus = async (req, res) => {
  try {
    const { stockId } = req?.params;
    const { productCode, status } = req?.body;
    await StockModel.changeStockProductStatus(stockId, productCode, status);

    const quantityAvilable = await StockModel.getStockProductQuantityAvalable(
      stockId,
      productCode
    );

    if (status === 1) {
      const productInfo = await ProductModel.getProductByCode(productCode);

      await ProductModel.updateProductQuantity(
        productCode,
        productInfo?.stock + quantityAvilable?.availableQuantity
      );
    }

    if (status === 0) {
      const productInfo = await ProductModel.getProductByCode(productCode);

      await ProductModel.updateProductQuantity(
        productCode,
        productInfo?.stock - quantityAvilable?.availableQuantity
      );
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ message: "Thay đổi trạng thái thất bại!" });
  }
};

const getStockList = async (req, res) => {
  try {
    const stockList = await StockModel.getStockData();
    return res.json({ success: true, payload: stockList });
  } catch (error) {
    return res
      .send(400)
      .json({ message: "Lấy danh sách đơn nhập hàng thất bại" });
  }
};

const getStockDetail = async (req, res) => {
  try {
    const { stockId } = req?.params;
    const stockDetail = await StockModel.getStockDetail(stockId);
    return res.json({ success: true, payload: stockDetail });
  } catch (error) {
    return res
      .send(400)
      .json({ message: "Lấy chi tiết đơn nhập hàng thất bại" });
  }
};

const deleteStockData = async (req, res) => {
  try {
    const { stockId } = req?.params;
    let valid = true;
    const stockProduct = await StockModel.getStockDetail(stockId);

    for (let i = 0; i < stockProduct?.length; i++) {
      const findProductStock =
        await OrderDetailModel.checkProductStockHaveOrder(
          stockProduct?.[i]?.productCode,
          stockId
        );
      if (findProductStock?.stockId) {
        valid = false;
        break;
      }
    }

    if (valid) {
      for (let i = 0; i < stockProduct?.length; i++) {
        const productInfo = await ProductModel.getProductByCode(
          stockProduct?.[i]?.productCode
        );
        await ProductModel.updateProductQuantity(
          stockProduct?.[i]?.productCode,
          productInfo?.stock - stockProduct[i]?.initQuantity
        );
      }
      await StockModel.deleteStockDetail(stockId);
      await StockModel.deleteStockData(stockId);
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    return res.status(400).json({ message: "Xoá sản phẩm thất bại" });
  }
};

const deleteStockProduct = async (req, res) => {
  try {
    const { stockId } = req?.params;
    const { productCode } = req?.query;
    const findProductStock = await OrderDetailModel.checkProductStockHaveOrder(
      productCode,
      stockId
    );

    if (findProductStock?.stockId) {
      return res.json({ success: false });
    }

    const quantityAvilable = await StockModel.getStockProductQuantityAvalable(
      stockId,
      productCode
    );
    const productInfo = await ProductModel.getProductByCode(productCode);

    await ProductModel.updateProductQuantity(
      productCode,
      productInfo?.stock - quantityAvilable?.availableQuantity
    );

    return res.json({ success: true});
  } catch (error) {
    return res.status(400).json({ message: "Xử lí thất bại" });
  }
};

module.exports = {
  createStockData,
  getStockList,
  getStockDetail,
  deleteStockData,
  updateStockData,
  changeStockProductStatus,
  deleteStockProduct,
};
