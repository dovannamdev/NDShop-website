import axiosClient from "./axiosClient";

const ADMIN_API_ENDPOINT = "/admin";

const adminApi = {
  postLogin: (account: any) => {
    const url = ADMIN_API_ENDPOINT + "/login";
    return axiosClient.post(url, account);
  },
  updateProduct: (product: any) => {
    const url = ADMIN_API_ENDPOINT + "/products/update";
    return axiosClient.put(url, product);
  },
  removeProduct: (code: any) => {
    const url = ADMIN_API_ENDPOINT + "/products/remove";
    return axiosClient.delete(url, { params: { code } });
  },
  postAddProduct: (product: any) => {
    const url = ADMIN_API_ENDPOINT + "/products/add";
    return axiosClient.post(url, product, {});
  },

  postAddBrand: (brand: any) => {
    const url = ADMIN_API_ENDPOINT + "/brands/add";
    return axiosClient.post(url, brand, {});
  },

  updateBrand: (brand: any) => {
    const url = ADMIN_API_ENDPOINT + "/brands/update";
    return axiosClient.put(url, brand, {});
  },

  removeBrand: (id: any) => {
    const url = ADMIN_API_ENDPOINT + "/brands/remove";
    return axiosClient.delete(url, { params: { id } });
  },

  getCustomerList: (page = 1) => {
    const url = ADMIN_API_ENDPOINT + "/customer";
    return axiosClient.get(url, { params: page });
  },
  delCustomer: (userId: any) => {
    const url = ADMIN_API_ENDPOINT + "/customer/del";
    return axiosClient.delete(url, { params: { userId } });
  },
  getOrderList: (orderType?: any) => {
    const url = ADMIN_API_ENDPOINT + `/order?orderType=${orderType}`;
    return axiosClient.get(url);
  },
  postUpdateOrderStatus: (id: any, orderStatus: any) => {
    const url = ADMIN_API_ENDPOINT + "/order";
    return axiosClient.post(url, { id, orderStatus });
  },

  createNewAccount: (adminData: any) => {
    const url = ADMIN_API_ENDPOINT + "/create";
    return axiosClient.post(url, adminData);
  },

  getListAdminAccount: (allType?: any, role?: any, status?: any) => {
    const url = ADMIN_API_ENDPOINT + `/list?allType=${allType}&role=${role}&status=${status}`;
    return axiosClient.get(url);
  },

  deleteAdminAccount: (adminId: any, accountId: any) => {
    const url = ADMIN_API_ENDPOINT + `/${adminId}/delete?accountId=${accountId}`;
    return axiosClient.delete(url);
  },

  updateAdminData: (accountData: any, adminId: any) => {
    const url = ADMIN_API_ENDPOINT + `/${adminId}/update`;
    return axiosClient.put(url, accountData);
  }
};

export default adminApi;
