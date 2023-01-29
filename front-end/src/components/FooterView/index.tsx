import {
  FacebookFilled,
  GooglePlusSquareFilled,
  LinkedinFilled,
  PhoneOutlined,
  TwitterSquareFilled,
} from "@ant-design/icons";
import iconPhoneFooter from "../../assets/img/icon-phone-footer.png";
import registeredImg from "../../assets/img/registered.png";
import React, { useEffect } from "react";
import "./index.scss";
function FooterView() {
  return (
    <div className="container-fluid footer p-lr-0" id="footer">
      {/* Thông tin chi tiết */}
      <div className="container p-tb-32">
        <p className="t-center" style={{ color: "#fff" }}>
          <b className="font-size-18px">
            CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ NDSTORE
          </b>
          <br />
          <strong>Trụ sở:</strong>&nbsp;97 Man Thiện, phường Tăng Nhơn Phú A,
          thành phố Thủ Đức, Thành phố Hồ Chí Minh
          <br />
          <strong>Điện&nbsp;thoại:</strong>&nbsp;0343181781 |{" "}
          <strong>Email:</strong>&nbsp;n18dccn128@student.ptithcm.edu.vn&nbsp;|{" "}
          <strong>Website:</strong>&nbsp;<a href="/">ndstore.vn</a>
        </p>
        <div className="d-flex align-i-center justify-content-center">
          <img src={registeredImg} width={175} alt="" />

          <div className="d-flex m-l-30">
            <a href="https://fb.com" target="blank">
              <FacebookFilled
                className="p-lr-4 social-item"
                style={{ fontSize: 36, color: "#0C86EF" }}
              />
            </a>
            <a href="https://www.linkedin.com/">
              <LinkedinFilled
                className="p-lr-4 social-item"
                style={{ fontSize: 36, color: "#0073B1" }}
              />
            </a>
            <a href="https://mail.google.com" target="blank">
              {" "}
              <GooglePlusSquareFilled
                className="p-lr-4 social-item"
                style={{ fontSize: 36, color: "#DB5247" }}
              />
            </a>

            <a href="https://twitter.com/" target="blank">
              <TwitterSquareFilled
                className="p-lr-4 social-item"
                style={{ fontSize: 36, color: "#55ACEF" }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterView;
