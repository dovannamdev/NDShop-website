import axiosClient from "./axiosClient";

const STOCK_API_URL = "/stock";

const stockApi = {
  createNewStockData: (data: any) => {
    const url = STOCK_API_URL + "/create";
    return axiosClient.post(url, data);
  },

  updateStockData: (data: any, stockId: any) => {
    const url = STOCK_API_URL + `/${stockId}/update`;
    return axiosClient.put(url, data);
  },

  getStockList: () => {
    const url = STOCK_API_URL;
    return axiosClient.get(url);
  },

  getStockDetail: (stockId: any) => {
    const url = STOCK_API_URL + `/${stockId}`;
    return axiosClient.get(url);
  },

  deleteStockData: (stockId: any) => {
    const url = STOCK_API_URL + `/${stockId}`;
    return axiosClient.delete(url);
  },

  changeStockProductStatus: (stockId: any, productCode: any, status: any) => {
    const url = STOCK_API_URL + `/${stockId}/status`;
    return axiosClient.put(url, {productCode, status});
  },

  deleteStockProduct: (stockId: any, productCode: any) => {
    const url = STOCK_API_URL + `/${stockId}/product/delete?productCode=${productCode}`;
    return axiosClient.delete(url);
  }
};

export default stockApi;