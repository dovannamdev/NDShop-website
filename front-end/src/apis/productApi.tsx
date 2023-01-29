import axiosClient from "./axiosClient";

const PRODUCT_API_ENDPOINT = "/products";
const productApi = {
  getAllProducts: (page = 1, perPage = 12, role?: any) => {
    const url = PRODUCT_API_ENDPOINT + "/all";
    return axiosClient.get(url, { params: { page, perPage, role } });
  },

  getProduct: (code: any) => {
    const url = PRODUCT_API_ENDPOINT;
    return axiosClient.get(url, { params: { code } });
  },

  getSearchProducts: (value = "", page = 1, perPage = 8, priceFrom?: any, priceTo?: any) => {
    const url = PRODUCT_API_ENDPOINT + "/search";
    return axiosClient.get(url, { params: { value, page, perPage, priceFrom, priceTo } });
  },

  getProductConfiguration: () => {
    const url = PRODUCT_API_ENDPOINT + "/configuration/all";
    return axiosClient.get(url)
  },

  getSellingProduct: (limit: any, offset: any) => {
    const url = PRODUCT_API_ENDPOINT + "/selling/list";
    return axiosClient.get(url, { params: { limit, offset } })
  }
};

export default productApi;
