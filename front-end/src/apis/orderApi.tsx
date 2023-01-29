import axiosClient from "./axiosClient";

const ORDER_API_ENDPOINT = "/orders";
const orderApi = {
  postCreateOrder: (data: any) => {
    const url = ORDER_API_ENDPOINT;
    return axiosClient.post(url, data);
  },

  getOrderList: (userId: any) => {
    const url = ORDER_API_ENDPOINT + "/list";
    return axiosClient.get(url, { params: { userId } });
  },

  getOrderDetail: (orderId: any) => {
    const url = ORDER_API_ENDPOINT + `/${orderId}/info`;
    return axiosClient.get(url);
  },

  getOrderProduct: (orderId: any) => {
    const url = ORDER_API_ENDPOINT + "/product";
    return axiosClient.get(url, { params: { orderId } });
  },

  checkUserHaveOrder: (userId: any, productCode: any) => {
    const url = ORDER_API_ENDPOINT + "/check-user-product";
    return axiosClient.get(url, { params: { userId, productCode } });
  },

  cancelOrder: (orderId: any, status: any) => {
    const url = ORDER_API_ENDPOINT + `/${orderId}/cancel`;
    return axiosClient.put(url, { status });
  },

  changeOrderDeliveryShipper: (orderId: any, shipperId: any) => {
    const url = ORDER_API_ENDPOINT + `/${orderId}/delivery/shipper`;
    return axiosClient.put(url, { shipperId });
  },

  changeOrderDeliveryStatus: (deliveryId: any, status: any, orderId: any) => {
    const url = ORDER_API_ENDPOINT + `/delivery/${deliveryId}/status`;
    return axiosClient.put(url, { status, orderId });
  },

  getShipperOrder: (shipperId: any, status: any) => {
    const url = ORDER_API_ENDPOINT + `/shipper/${shipperId}?status=${status}`;
    return axiosClient.get(url);
  },

  getListDeliveryStatus: (deliveryId: any) => {
    const url = ORDER_API_ENDPOINT + `/delivery/${deliveryId}/status`;
    return axiosClient.get(url);
  }
};
export default orderApi;
