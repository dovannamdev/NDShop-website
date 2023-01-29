import axiosClient from "./axiosClient";

const BRAND_API_ENDPOINT = "/brands";

const brandApi = {
  getBrandList: (limit?: any, offset?: any) => {
    const url = BRAND_API_ENDPOINT + "/list";
    return axiosClient.get(url, { params: { limit, offset } });
  },
};
export default brandApi;
