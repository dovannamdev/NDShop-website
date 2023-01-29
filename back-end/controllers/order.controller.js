const OrderModel = require("../models/order.model");
const ProductModel = require("../models/product.model");
const helpers = require("../helpers");
const OrderDetailModel = require("../models/orderDetail.model");
const Stripe = require("stripe");
const StockModel = require("../models/stock.model");
const stripe = new Stripe(
  "sk_test_51MCO5BEIGmI0kD65B00u1sVlkYBhbeq96TmxJ8CTgaWZflQGGxMobYtwSqDZxMtzX4ooa3ulfF32UzlVmrfxKNlI006vamkTqh"
);

const postCreateOrder = async (req, res) => {
  try {
    const {
      owner,
      deliveryAdd,
      orderStatus,
      transportFee,
      productList,
      paymentMethod,
      paymentId,
      totalPrice,
      totalDiscount,
    } = req.body;
    let chargeId = "";

    if (paymentMethod === "PAYMENT_ONLINE") {
      const payment = await stripe.paymentIntents.create({
        amount: parseInt(totalPrice),
        currency: "VND",
        description: "pay order",
        payment_method: paymentId,
        confirm: true,
      });

      if (payment) {
        chargeId = payment?.charges?.data?.[0]?.id || payment?.latest_charge;
      }
      if (!payment) {
        return res.status(400).json({ message: "Thanh toán thất bại" });
      }
    }

    const response = await OrderModel.createNewOrder({
      owner,
      orderCode: helpers.generateVerifyCode(6),
      name: deliveryAdd?.name,
      clientPhone: deliveryAdd?.phone,
      clientAddress: deliveryAdd?.address,
      orderStatus,
      transportFee,
      paymentMethod,
      totalPrice: Number(totalPrice),
      totalDiscount,
      chargeId,
    });

    if (!response?._id) {
      return res.status(400).json({ message: "Lỗi hệ thống" });
    }

    for (let i = 0; i < productList.length; ++i) {
      const { orderProd, numOfProd } = productList[i];

      const product = await ProductModel.getProductByCode(orderProd?.code);

      if (!product?.code)
        return res.status(400).json({ message: "Sản phẩm đẫ ngừng bán" });
      if (product?.stock < parseInt(numOfProd))
        return res.status(400).json({ message: "Sản phẩm tồn kho đã hết" });

      const stockList = await StockModel.getStockHaveProduct(product?.code);

      for (let i = 0; i < stockList?.length; i++) {
        let numAdd = 0;

        if (stockList?.[i]?.availableQuantity >= numOfProd) {
          await OrderDetailModel.createOrderDetail(
            response?._id,
            orderProd,
            numOfProd,
            i + 1,
            Number(product?.price),
            stockList?.[i]?.stockId
          );
          break;
        } else if (numAdd < numOfProd) {
          numAdd =
            numAdd +
            (stockList?.[i]?.availableQuantity - (numOfProd - numAdd) < 0
              ? stockList?.[i]?.availableQuantity
              : numOfProd - numAdd);

          await OrderDetailModel.createOrderDetail(
            response?._id,
            orderProd,
            numAdd,
            i + 1,
            Number(product?.price),
            stockList?.[i]?.stockId
          );
        }

        if (numAdd === numOfProd) {
          break;
        }
      }

      const productInfo = await ProductModel.getProductByCode(product?.code);

      await ProductModel.updateProductQuantity(
        product?.code,
        productInfo?.stock - Number(numOfProd)
      );
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("errrro >>>> ", error);
    return res.status(401).json({ message: "Lỗi hệ thống" });
  }
};

const getOrderList = async (req, res) => {
  try {
    const { userId } = req.query;
    const orderList = await OrderModel.getOrderByUserId(userId);
    const orderFullData = [];

    for (let i = 0; i < orderList?.length; i++) {
      const orderProduct = await OrderDetailModel.getProductByOrderId(
        orderList?.[i]?._id
      );
      const order = {
        ...orderList?.[i],
        deliveryAdd: {
          name: orderList?.[i]?.name,
          phone: orderList?.[i]?.clientPhone,
          address: orderList?.[i]?.clientAddress,
        },
        orderProd: [...orderProduct],
      };
      orderFullData?.push(order);
    }
    if (orderFullData?.length) {
      return res.status(200).json({ list: orderFullData });
    }
    return res.status(200).json({ list: [] });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ list: [] });
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderList = await OrderModel.getOrderById(orderId);
    const orderFullData = [];

    for (let i = 0; i < orderList?.length; i++) {
      const orderProduct = await OrderDetailModel.getProductByOrderId(
        orderList?.[i]?._id
      );
      const order = {
        ...orderList?.[i],
        deliveryAdd: {
          name: orderList?.[i]?.name,
          phone: orderList?.[i]?.clientPhone,
          address: orderList?.[i]?.clientAddress,
        },
        orderProd: [...orderProduct],
      };
      orderFullData?.push(order);
    }
    if (orderFullData?.length) {
      return res.status(200).json({ success: true, list: orderFullData });
    }
    return res.status(200).json({ list: [] });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ list: [] });
  }
};

const getOrderProduct = async (req, res) => {
  try {
    const { orderId } = req.query;
    const orderProduct = await OrderDetailModel.getProductByOrderId(orderId);

    return res.status(200).json({
      list: [...orderProduct],
    });
  } catch (error) {
    return res.status(400).json({ list: [] });
  }
};

const checkUserOrderProduct = async (req, res) => {
  try {
    const { userId, productCode } = req?.query;
    const checkUser = await OrderModel.checkUserOrderProduct(
      userId,
      productCode
    );
    return res.json({ success: true, payload: checkUser });
  } catch (error) {
    return res.status(400).json({ message: "Lỗi" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req?.params;
    const { status } = req?.body;
    const orderInfo = await OrderModel.getOrderById(orderId);
    const orderDetail = await OrderDetailModel.getProductByOrderId(orderId);

    if (
      orderInfo?.[0]?.paymentMethod === "PAYMENT_ONLINE" &&
      orderInfo?.[0]?.chargeId?.length
    ) {
      await stripe.refunds.create({
        charge: orderInfo?.[0]?.chargeId,
      });
    }

    for (let i = 0; i < orderDetail.length; ++i) {
      const productInfo = await ProductModel.getProductByCode(
        orderDetail?.[i]?.productsCode
      );

      await ProductModel.updateProductQuantity(
        orderDetail?.[i]?.productsCode,
        productInfo?.stock + orderDetail?.[i]?.numOfProd
      );
    }
    
    if (Number(status) === 5) {
      await OrderModel.updateOrderStatus(orderId, 6);
    }
    if (Number(status) === 4) {
      await OrderModel.updateOrderStatus(orderId, 4);
    }
    if (Number(status) === 2 || Number(status) === 3) {
      await OrderModel.updateOrderStatus(orderId, 3);
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ message: "Lỗi" });
  }
};

const changeDeliveryShipper = async (req, res) => {
  try {
    const { orderId } = req?.params;
    const { shipperId } = req?.body;
    const delivery = await OrderModel.findDeliveryWithOrderId(orderId);
    if (delivery?._id) {
      const updateRes = await OrderModel.updateDeliveryShipper(
        shipperId,
        delivery?._id
      );
      if (updateRes) {
        return res.json({ success: true });
      }
    } else {
      const createRes = await OrderModel.createDelivery(orderId, shipperId);
      if (createRes) {
        return res.json({ success: true });
      }
    }
    return res.status(400).json({ message: "Lỗi" });
  } catch (error) {
    console.log("error >>> ", error);
    return res.status(400).json({ message: "Lỗi" });
  }
};

const getShipperOrder = async (req, res) => {
  try {
    const { shipperId } = req?.params;
    const { status } = req?.query;
    const orderList = await OrderModel.getOrderByShipperId(shipperId, status);
    const orderFullData = [];

    for (let i = 0; i < orderList?.length; i++) {
      const orderProduct = await OrderDetailModel.getProductByOrderId(
        orderList?.[i]?._id
      );
      const order = {
        ...orderList?.[i],
        deliveryAdd: {
          name: orderList?.[i]?.name,
          phone: orderList?.[i]?.clientPhone,
          address: orderList?.[i]?.clientAddress,
        },
        orderProd: [...orderProduct],
      };
      orderFullData?.push(order);
    }
    if (orderFullData?.length) {
      return res.status(200).json({ success: true, list: orderFullData });
    }
    return res.status(200).json({ list: [] });
  } catch (error) {
    console.log("error >>> ", error);
    return res.status(400).json({ message: "Lỗi" });
  }
};

const changeDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req?.params;
    const { status, orderId } = req?.body;
    const result = await OrderModel.changeDeliveryStatus(deliveryId, status);
    if (result) {
      if (status === 3) {
        await OrderModel.updateOrderStatus(orderId, 2);
      }
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ message: "Lỗi" });
  } catch (error) {
    console.log("error >>> ", error);
    return res.status(400).json({ message: "Lỗi" });
  }
};

const getListDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req?.params;
    const result = await OrderModel.getDeliveryListStatus(deliveryId);
    return res.status(200).json({ success: true, payload: result });
  } catch (error) {
    console.log("error >>> ", error);
    return res.status(400).json({ message: "Lỗi" });
  }
};

module.exports = {
  postCreateOrder,
  getOrderList,
  getOrderProduct,
  checkUserOrderProduct,
  cancelOrder,
  getOrderDetail,
  changeDeliveryShipper,
  getShipperOrder,
  changeDeliveryStatus,
  getListDeliveryStatus,
};
