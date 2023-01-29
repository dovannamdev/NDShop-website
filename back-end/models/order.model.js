const { mysql } = require("../configs/mysql.config");

const OrderModel = {
  createNewOrder: async ({
    owner,
    orderCode,
    name,
    clientPhone,
    clientAddress,
    orderStatus,
    transportFee,
    paymentMethod,
    totalPrice,
    totalDiscount,
    chargeId,
  }) => {
    try {
      const response =
        await mysql.query(`INSERT INTO Orders(owner, orderCode, orderDate, orderStatus, transportFee, paymentMethod, name, clientPhone, clientAddress, chargeId)
      VALUES(${Number(owner)}, '${orderCode}', Now(), ${Number(
          orderStatus
        )}, ${Number(
          transportFee
        )}, '${paymentMethod}', '${name}', '${clientPhone}', '${clientAddress}', '${chargeId}')`);

      if (response) {
        const lastOrder = await mysql.query(
          `SELECT _id FROM Orders ORDER BY _id DESC LIMIT 1 OFFSET 0`
        );
        return { _id: lastOrder?.[0]?._id };
      }
      return {};
    } catch (error) {
      return {};
    }
  },

  getOrderByUserId: async (userId) => {
    try {
      const order = await mysql.query(
        `SELECT * FROM Orders WHERE owner=${Number(userId)} ORDER BY _id DESC`
      );
      return order || [];
    } catch (error) {
      return [];
    }
  },

  getOrderById: async (orderId) => {
    try {
      const order = await mysql.query(
        `SELECT * FROM Orders WHERE _id=${Number(orderId)} ORDER BY _id DESC`
      );
      return order || [];
    } catch (error) {
      return [];
    }
  },

  getOrderById: async (orderId) => {
    try {
      const order = await mysql.query(
        `SELECT od.*, ode._id as deliveryId, ode.shipper, ad.fullName as shipperName,
          (SELECT odh.status FROM OrderDeliveryHistory odh WHERE odh.deliveryId = ode._id ORDER BY odh.createdDate DESC LIMIT 1 OFFSET 0 ) as deliveryStatus
          FROM Orders od LEFT JOIN OrderDelivery ode ON od._id = ode.orderId 
          LEFT JOIN Admins ad ON ad._id = ode.shipper
          WHERE od._id=${Number(orderId)} ORDER BY od._id DESC`
      );
      return order || [];
    } catch (error) {
      return [];
    }
  },

  getOrderByShipperId: async (shipperId, status) => {
    try {
      const queryStatus = '(SELECT odh.status FROM OrderDeliveryHistory odh WHERE odh.deliveryId = ode._id ORDER BY odh.createdDate DESC LIMIT 1 OFFSET 0 )'
      const order = await mysql.query(
        `SELECT od.*, ode._id as deliveryId, ode.shipper, ad.fullName as shipperName,
        ${queryStatus} as deliveryStatus
          FROM Orders od LEFT JOIN OrderDelivery ode ON od._id = ode.orderId 
          LEFT JOIN Admins ad ON ad._id = ode.shipper
          WHERE ode.shipper=${Number(shipperId)} AND ${
          Number(status) === 0
            ? `${queryStatus} is null`
            : `${queryStatus} = ${Number(status)}`
        } ORDER BY od._id DESC`
      );
      return order || [];
    } catch (error) {
      return [];
    }
  },

  getOrderList: async (orderType) => {
    try {
      const order = await mysql.query(
        `SELECT * FROM Orders WHERE ${
          Number(orderType) === 2 ? "orderStatus = 5" : "orderStatus != 5"
        } ORDER BY _id DESC`
      );
      return order || [];
    } catch (error) {
      return [];
    }
  },

  updateOrderStatus: async (id, orderStatus) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE Orders SET orderStatus=${Number(orderStatus)} WHERE _id=${id}`
      );
      return updateRes ? true : false;
    } catch (error) {
      return false;
    }
  },

  filterOrderByDate: async ({ firstDate, lastDate, orderStatus }) => {
    try {
      const order = await mysql.query(
        `SELECT * FROM Orders WHERE date(orderDate) >= date('${firstDate.toISOString()}') AND date(orderDate) <= date('${lastDate.toISOString()}') AND orderStatus = ${Number(
          orderStatus
        )}  ORDER BY _id DESC`
      );
      return order || [];
    } catch (error) {
      console.log('error >>> ', error);
      return [];
    }
  },

  checkUserOrderProduct: async (userId, productCode) => {
    try {
      const result = await mysql.query(
        `SELECT od.* FROM Orders od JOIN OrdersProduct odp ON od._id=odp.orderId WHERE od.owner=${Number(
          userId
        )} AND odp.productsCode='${productCode}'`
      );
      return result?.length ? true : false;
    } catch (error) {
      return false;
    }
  },

  findDeliveryWithOrderId: async (orderId) => {
    try {
      const result = await mysql.query(
        `SELECT * FROM OrderDelivery WHERE orderId = ${Number(orderId)}`
      );
      return result?.length ? result?.[0] : {};
    } catch (error) {
      return {};
    }
  },

  createDelivery: async (orderId, shipperId) => {
    try {
      const result = await mysql.query(
        `INSERT INTO OrderDelivery(orderId, shipper, createdDate) VALUES(${Number(
          orderId
        )}, ${Number(shipperId)}, Now())`
      );
      return result ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateDeliveryShipper: async (shipperId, deliveryId) => {
    try {
      const result = await mysql.query(
        `UPDATE OrderDelivery SET shipper=${Number(
          shipperId
        )} WHERE _id=${Number(deliveryId)}`
      );
      return result ? true : false;
    } catch (error) {
      return false;
    }
  },

  changeDeliveryStatus: async (deliveryId, status) => {
    try {
      const result = await mysql.query(
        `INSERT INTO OrderDeliveryHistory(deliveryId, status, createdDate) VALUES(${Number(
          deliveryId
        )}, ${Number(status)}, Now())`
      );
      return result ? true : false;
    } catch (error) {
      return false;
    }
  },

  getDeliveryListStatus: async (deliveryId) => {
    try {
      const result = await mysql.query(
        `SELECT * FROM OrderDeliveryHistory WHERE deliveryId=${Number(
          deliveryId
        )} ORDER BY createdDate DESC`
      );
      return result || [];
    } catch (error) {
      return [];
    }
  },
};

module.exports = OrderModel;
