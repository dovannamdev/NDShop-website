import moment from "moment";
import React from "react";
import "./index.scss";

type TurnoverPdfTemplateType = {
  fromDate: any;
  toDate: any;
  listTurnover: any;
};

export default function TurnoverPdfTemplate({
  fromDate,
  toDate,
  listTurnover,
}: TurnoverPdfTemplateType) {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          textAlign: "center",
          fontSize: "10px",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        THONG KE DOANH THU
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: "10px",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        TU {moment(fromDate).format("DD/MM/YYYY")} DEN{" "}
        {moment(toDate).format("DD/MM/YYYY")}
      </div>
      <table id="turnover-pdf-template-table">
        <tr>
          <th>STT</th>
          <th style={{ width: "200px" }}>NGAY BAN HANG</th>
          <th>DOANH THU</th>
          <th>GIA VON NHAP</th>
          <th>LOI NHUAN</th>
        </tr>
        {listTurnover?.map((item: any, index: any) => {
          return (
            <tr>
              <td>{index + 1}</td>
              <td style={{ whiteSpace: "nowrap" }}>{item?.orderDate}</td>
              <td>{Number(item?.money).toFixed(0)}</td>
              <td>{Number(item?.spentMoney).toFixed(0)}</td>
              <td>{Number(item?.money - item?.spentMoney).toFixed(0)}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
