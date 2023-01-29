import { Button, Col, DatePicker, InputNumber, message, Row } from "antd";
import moment from "moment";
import { useRef, useState } from "react";
import statisticApi from "../../../apis/statisticApi";
import helpers from "../../../helpers";
import AnnualRevenue from "./AnualRevenue";
import MonthRevenue from "./MonthRevenue";
import { CSVLink } from "react-csv";
import TurnoverPdfTemplate from "./TurnoverPdfTemplate";
import jsPDF from "jspdf";
import { renderToString } from "react-dom/server";
import SpentPdfTemplate from "./SpentPdfTemplate";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [startYear, setStartYear] = useState(2012);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [filterOption, setFilterOption] = useState(1);
  const [reportTime, setReportTime] = useState([]);
  const [reportData, setReportDate] = useState({
    turnover: [],
    spent: [],
    totalTurnover: 0,
    totalSpent: 0,
    totalTurnoverSpent: 0,
  });

  const monthRef: any = useRef();
  const anualRef: any = useRef();

  const getReport = async () => {
    try {
      const timeFrom = moment(reportTime[0]).format("DD-MM-YYYY");
      const timeTo = moment(reportTime[1]).format("DD-MM-YYYY");

      const result = await statisticApi.getReport(timeFrom, timeTo);
      if (result?.data?.success) {
        const payload = result?.data?.payload || {};
        setReportDate({
          turnover: payload?.turnover,
          spent: payload?.spent,
          totalTurnover: payload?.totalTurnover,
          totalSpent: payload?.totalSpent,
          totalTurnoverSpent: payload?.totalTurnoverSpent,
        });
      }
    } catch (error) {
      return message.error("Lấy thông tin thất bại");
    }
  };

  const printTurnover = () => {
    const string = renderToString(
      <TurnoverPdfTemplate
        fromDate={reportTime?.[0]}
        toDate={reportTime?.[1]}
        listTurnover={reportData?.turnover}
      />
    );

    const pdf = new jsPDF("p", "mm", "a4");

    pdf.html(string, {
      callback: function (doc: any) {
        doc.save("BaoCaoDoanhThu.pdf");
      },
      x: 10,
      y: 10,
    });
  };

  const printSpent = () => {
    const string = renderToString(
      <SpentPdfTemplate
        fromDate={reportTime?.[0]}
        toDate={reportTime?.[1]}
        listSpent={reportData?.spent}
      />
    );

    const pdf = new jsPDF("p", "mm", "a4");

    pdf.html(string, {
      callback: function (doc: any) {
        doc.save("BaoCaoNhapHang.pdf");
      },
      x: 10,
      y: 10,
    });
  };

  return (
    <Row>
      <Col className="" span={24}>
        <Row gutter={[32, 32]} style={{ padding: "32px 32px 0 32px" }}>
          <div style={{ display: "flex", marginLeft: "20px" }}>
            <div>
              <Button
                type={filterOption !== 1 ? "default" : "primary"}
                onClick={() => {
                  if (filterOption !== 1) setFilterOption(1);
                }}
              >
                Doanh thu
              </Button>
            </div>
            <div style={{ marginLeft: "15px" }}>
              <Button
                type={filterOption !== 2 ? "default" : "primary"}
                onClick={() => {
                  if (filterOption !== 2) setFilterOption(2);
                }}
              >
                Báo cáo
              </Button>
            </div>
          </div>
        </Row>
      </Col>
      {filterOption === 2 ? (
        <Col className="" span={24}>
          <Row className="p-32" gutter={[32, 32]}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "nowrap",
                alignItems: "center",
                marginLeft: "20px",
              }}
            >
              <RangePicker
                onCalendarChange={(value: any) => setReportTime(value)}
                format="DD-MM-YYYY"
                placeholder={[
                  "Nhập vào khoảng thời gian từ",
                  "Nhập vào khoảng thời gian đến",
                ]}
              />
              <Button
                type="primary"
                onClick={() => getReport()}
                disabled={reportTime?.length < 2}
              >
                Tìm kiếm
              </Button>
            </div>
          </Row>
          <Row className="p-32" gutter={[32, 32]}>
            <Col span={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "33%",
                    // border: "1px solid gray",
                    padding: "40px 15px",
                    background: "#97DECE",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    Số tiền nhập kho
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "18px",
                    }}
                  >
                    {helpers.formatProductPrice(reportData?.totalSpent) || 0}
                  </div>
                </div>
                <div
                  style={{
                    width: "33%",
                    // border: "1px solid gray",
                    padding: "40px 15px",
                    background: "#a6edbb",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    Doanh thu
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "18px",
                    }}
                  >
                    {helpers.formatProductPrice(reportData?.totalTurnover) || 0}
                  </div>
                </div>
                <div
                  style={{
                    width: "33%",
                    // border: "1px solid gray",
                    padding: "40px 15px",
                    background: "rgb(143 192 235)",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    Lợi nhuận bán hàng
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "18px",
                    }}
                  >
                    {helpers.formatProductPrice(
                      reportData?.totalTurnover - reportData?.totalTurnoverSpent
                    ) || 0}
                  </div>
                </div>
                {/* <div
                  style={{
                    width: "48%",
                    border: "1px solid gray",
                    padding: "40px 15px",
                    background: "#97DECE",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    Số tiền thực tế
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "18px",
                    }}
                  >
                    {helpers.formatProductPrice(
                      Number(reportData?.totalTurnover) -
                        Number(reportData?.totalSpent)
                    )}{" "}
                  </div>
                </div> */}
              </div>
              <div style={{ marginTop: "20px" }}>
                <div style={{ fontSize: "20px", fontWeight: 600 }}>
                  Tải file báo cáo
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600 }}>
                  File Exel:
                </div>
                <div>
                  {reportData?.turnover?.length ? (
                    <CSVLink
                      data={reportData?.turnover?.map((item: any) => {
                        return {
                          "Ngày bán hàng": item?.orderDate,
                          "Doanh thu": Number(item?.money).toFixed(0),
                          "Giá vốn nhập": Number(item?.spentMoney).toFixed(0),
                          "Lợi nhuận": Number(
                            item?.money - item?.spentMoney
                          ).toFixed(0),
                        };
                      })}
                      filename={"so_lieu_ban_hang.csv"}
                      className="btn btn-primary"
                      target="_blank"
                    >
                      Tải file doanh thu
                    </CSVLink>
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  {reportData?.spent?.length ? (
                    <CSVLink
                      data={reportData?.spent?.map((item: any) => {
                        return {
                          "Ngày nhập hàng": item?.createdDate,
                          "Số tiền nhập hàng": item?.money,
                        };
                      })}
                      filename={"so_lieu_nhap_hang.csv"}
                      className="btn btn-primary"
                      target="_blank"
                    >
                      Tải file số liệu nhập hàng
                    </CSVLink>
                  ) : (
                    <></>
                  )}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600 }}>
                  File Pdf:
                </div>
                <div>
                  {reportData?.turnover?.length ? (
                    <div
                      style={{ color: "#1990FF", cursor: "pointer" }}
                      onClick={() => printTurnover()}
                    >
                      Tải file doanh thu
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  {reportData?.spent?.length ? (
                    <div
                      style={{ color: "#1990FF", cursor: "pointer" }}
                      onClick={() => printSpent()}
                    >
                      Tải file nhập hàng
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      ) : (
        <></>
      )}
      {filterOption === 1 ? (
        <Col className="" span={24}>
          <Row className="p-32" gutter={[32, 32]}>
            <Col className="" span={24} xl={12}>
              <div style={{ fontSize: "16px", fontWeight: 600 }}>
                Lựa chọn năm:{" "}
              </div>
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "flex-start",
                  flexWrap: "nowrap",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80%" }}>
                  <InputNumber
                    value={currentYear}
                    min={2012}
                    max={new Date().getFullYear()}
                    parser={(value: any) => value.match(/^\d+$/)}
                    defaultValue={new Date().getFullYear()}
                    onChange={(value:any) => setCurrentYear(value)}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <Button
                    type="primary"
                    onClick={() => monthRef.current.reloadData(currentYear)}
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </div>
              <div className="bg-white p-12 bor-rad-8 box-sha-home">
                <MonthRevenue ref={monthRef} />
              </div>
            </Col>
            {/* Doanh thu theo năm */}
            <Col span={24} xl={12}>
              <div style={{ fontSize: "16px", fontWeight: 600 }}>
                Lựa chọn khoảng thời gian:{" "}
              </div>
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "flex-start",
                  flexWrap: "nowrap",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "40%" }}>
                  <InputNumber
                    value={startYear}
                    min={2012}
                    max={new Date().getFullYear()}
                    parser={(value: any) => value.match(/^\d+$/)}
                    defaultValue={startYear}
                    onChange={(value:any) => {
                      if (value < endYear) {
                        setStartYear(value);
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                </div>
                -
                <div style={{ width: "40%" }}>
                  <InputNumber
                    value={endYear}
                    min={2012}
                    max={new Date().getFullYear()}
                    parser={(value: any) => value.match(/^\d+$/)}
                    defaultValue={endYear}
                    onChange={(value:any) => {
                      if (value > startYear) {
                        setEndYear(value);
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <Button
                    type="primary"
                    onClick={() =>
                      anualRef.current.reloadData(startYear, endYear)
                    }
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </div>
              <div className="bg-white p-12 bor-rad-8 box-sha-home">
                <AnnualRevenue ref={anualRef} />
              </div>
            </Col>
          </Row>
        </Col>
      ) : (
        <></>
      )}
    </Row>
  );
};

export default Dashboard;
