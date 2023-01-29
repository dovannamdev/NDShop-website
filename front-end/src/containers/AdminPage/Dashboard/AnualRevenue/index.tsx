import React, { useEffect, useImperativeHandle, useState } from "react";
import { Bar } from "react-chartjs-2";
import statisticApi from "../../../../apis/statisticApi";
import GlobalLoading from "../../../../components/GlobalLoading";
import helpers from "../../../../helpers";

const AnnualRevenue = React.forwardRef((props, ref) => {
  const [startYear, setStartYear] = useState(2012);
  const [endYear, setEndYear] = useState(new Date().getFullYear());

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function generateLabels(
    startYear = new Date().getFullYear(),
    endYear = new Date().getFullYear()
  ) {
    let result = [];
    for (let i = startYear; i <= endYear; ++i) {
      result.push(`${i}`);
    }
    return result;
  }

  async function getStaAnnualRevenue(stYear: any, edYear: any) {
    try {
      const response = await statisticApi.getStaAnnualRevenue(
        stYear,
        edYear
      );
      if (response) {
        const { data } = response.data;
        setData(data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  }

  useImperativeHandle(ref, () => ({
    reloadData: (stYear: any, edYear: any) => {
      getStaAnnualRevenue(stYear, edYear)
      setStartYear(stYear)
      setEndYear(edYear);
    },
  }));

  useEffect(() => {
    getStaAnnualRevenue(startYear, endYear);
  }, []);

  return (
    <>
      {isLoading ? (
        <GlobalLoading content={"Đang thống kê ..."} />
      ) : (
        <Bar
          data={{
            labels: generateLabels(startYear, endYear),
            datasets: [
              {
                backgroundColor: "rgba(75, 192, 192, 1)",
                data: [...data],
              },
            ],
          }}
          options={{
            legend: { display: false },
            title: {
              display: true,
              text: `Doanh thu từ năm ${startYear} đến năm ${endYear}`,
              fontSize: 18,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    callback: function (value: any) {
                      return value >= 1000000000
                        ? `${(value / 1000000000).toFixed(1)} tỷ`
                        : value >= 1000000
                        ? `${(value / 1000000).toFixed(1)} tr`
                        : helpers.formatProductPrice(value);
                    },
                  },
                },
              ],
            },
          }}
        />
      )}
    </>
  );
})

export default AnnualRevenue;
