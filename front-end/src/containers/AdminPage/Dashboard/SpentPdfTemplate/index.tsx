import moment from "moment";
import React from "react";
import "./index.scss";

type SpentPdfTemplateType = {
  fromDate: any;
  toDate: any;
  listSpent: any;
};

export default function SpentPdfTemplate({
  fromDate,
  toDate,
  listSpent,
}: SpentPdfTemplateType) {
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
        THONG KE NHAP HANG
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
      <table id="spent-pdf-template-table">
        <tr>
          <th>STT</th>
          <th style={{ width: "200px", whiteSpace: 'nowrap' }}>NGAY NHAP HANG</th>
          <th style={{whiteSpace: 'nowrap'}}>SO TIEN NHAP</th>
        </tr>
        {listSpent?.map((item: any, index: any) => {
          return (
            <tr>
              <td>{index + 1}</td>
              <td style={{whiteSpace: 'nowrap'}}>{item?.createdDate}</td>
              <td>{Number(item?.money).toFixed(0)}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
