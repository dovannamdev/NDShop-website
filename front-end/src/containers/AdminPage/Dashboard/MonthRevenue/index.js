import { InputNumber, Select } from "antd";
import React, { useEffect, useImperativeHandle, useState } from "react";
import { Bar, Line } from "react-chartjs-2";

import statisticApi from "../../../../apis/statisticApi";
import GlobalLoading from "../../../../components/GlobalLoading";
import helpers from "../../../../helpers";

const MonthRevenue = React.forwardRef((props, ref) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [data, setData] = useState({ thisYear: [], lastYear: [] });
  const [isLoading, setIsLoading] = useState(true);

  function generateLabels() {
    let result = [];
    for (let i = 0; i < 12; ++i) {
      result.push(`Tháng ${i + 1}`);
    }
    return result;
  }

  async function getStaMonthRevenue(currentYear) {
    try {
      setIsLoading(true);
      const response = await statisticApi.getStaMonthRevenue(currentYear);
      if (response) {
        const { thisYear, lastYear } = response.data;
        setData({ thisYear, lastYear });
        setIsLoading(false);
      }
    } catch (e) {
      setData({ thisYear: [], lastYear: [] });
      setIsLoading(false);
    }
  }

  useImperativeHandle(ref, () => ({
    reloadData: (year) => {
      getStaMonthRevenue(year);
      setCurrentYear(year);
    },
  }));

  useEffect(() => {
    getStaMonthRevenue(currentYear);
  }, []);

  return (
    <>
      {isLoading ? (
        <GlobalLoading content={"Đang thống kê"} />
      ) : (
        <>
          <Line
            data={{
              labels: generateLabels(),
              datasets: [
                {
                  borderColor: "rgb(53, 162, 235)",
                  backgroundColor: "rgba(53, 162, 235, 0.2)",
                  data: [...data.thisYear],
                  label: `${currentYear}`,
                },
              ],
            }}
            options={{
              legend: { display: true },
              title: {
                display: true,
                text: `Doanh thu từng tháng của năm ${currentYear}`,
                fontSize: 18,
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      callback: function (value) {
                        return value >= 1000000000
                          ? `${(value / 1000000000).toFixed(1)} tỷ`
                          : value >= 1000000
                          ? `${(value / 1000000).toFixed(0)} tr`
                          : helpers.formatProductPrice(value);
                      },
                    },
                  },
                ],
              },
            }}
          />
        </>
      )}
    </>
  );
});

export default MonthRevenue;
