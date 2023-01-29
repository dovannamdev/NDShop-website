import axiosClient from "./axiosClient";

const ACCOUNT_API_ENDPOINT = "/accounts";

const accountApi = {
  postSignUp: (account: any) => {
    const url = ACCOUNT_API_ENDPOINT + "/signup";
    return axiosClient.post(url, account);
  },

  postSendCodeForgotPW: (email: any) => {
    const url = ACCOUNT_API_ENDPOINT + "/verify/forgot";
    return axiosClient.post(url, email);
  },

  postResetPassword: (account: any) => {
    const url = ACCOUNT_API_ENDPOINT + "/reset-pw";
    return axiosClient.post(url, account);
  },

  postLogin: (account: any) => {
    const url = ACCOUNT_API_ENDPOINT + "/login";
    return axiosClient.post(url, account);
  },

  changeAccountStatus: (status: any, accountId: any) => {
    const url = ACCOUNT_API_ENDPOINT + `/${accountId}/status`;
    return axiosClient.put(url, { status });
  },
};

export default accountApi;
