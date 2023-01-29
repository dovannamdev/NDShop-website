import constants from "constants";
import axiosClient from "./axiosClient";

const USER_API_URL = "/user";

const userApi = {
  putUpdateUser: (userId = "", value = {}) => {
    const url = USER_API_URL + "/update";
    return axiosClient.put(url, { userId, value });
  },

  getUserWithId: (userId: any) => {
    const url = USER_API_URL + `/info/${userId}`;
    return axiosClient.get(url);
  },

  getUserList: (search: string) => {
    const url = USER_API_URL + `/list?search=${search}`;
    return axiosClient.get(url);
  }
};

export default userApi;
