import axiosClient from "./axiosClient";

const STATISTIC_URL_ENDPOINT = "/statistic";
const statisticApi = {
  getStaMonthRevenue: (year = new Date().getFullYear()) => {
    const url = STATISTIC_URL_ENDPOINT + "/month-revenue";
    return axiosClient.get(url, { params: { year } });
  },

  getStaAnnualRevenue: (
    startYear = new Date().getFullYear(),
    endYear = new Date().getFullYear()
  ) => {
    const url = STATISTIC_URL_ENDPOINT + "/annual-revenue";
    return axiosClient.get(url, { params: { startYear, endYear } });
  },

  getReport: (dateFrom: any, dateTo: any) => {
    const url = STATISTIC_URL_ENDPOINT + "/report";
    return axiosClient.get(url, { params: { dateFrom, dateTo } });
  }
};

export default statisticApi;
