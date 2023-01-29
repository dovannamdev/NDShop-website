import { Button, Col, Result, Row } from "antd";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import constants from "../../constants";
import "./index.scss";
import {
  ReconciliationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import UpdateAccountForm from "./UpdateForm";
import OrderList from "./OrderList";

const menu = [
  
  {
    Icon: <ReconciliationOutlined className="icon m-r-12 font-size-24px" />,
    title: "Quản lý đơn hàng",
    key: "orders",
  },
  {
    Icon: <UserOutlined className="icon m-r-12 font-size-24px" />,
    title: "Thông tin tài khoản",
    key: "",
  },
];

const renderComponent = (key: any) => {
  switch (key) {
    case "":
      return (
        <>
          <h2 className="m-b-16">THÔNG TIN TÀI KHOẢN</h2>
          <UpdateAccountForm />
        </>
      );
    case "orders":
      return (
        <>
          <h2 className="m-b-16 m-l-10">ĐƠN HÀNG CỦA BẠN</h2>
          <OrderList />
        </>
      );
    default:
      <>
        <h2 className="m-b-16 m-l-10">ĐƠN HÀNG CỦA BẠN</h2>
        <OrderList />
      </>;
  }
};

const Accountpage = () => {
  const user = useSelector((state: any) => state.userReducer);
  const [activeKey, setActiveKey] = useState("orders");

  return (
    <>
      {!user ? (
        <div className="" style={{ minHeight: "82vh" }}>
          <Result
            title="Đăng nhập để xem thông tin"
            extra={[
              <Button
                size="large"
                type="primary"
                key="signup"
                className="btn-secondary w-20"
              >
                <Link to={constants.ROUTES.SIGNUP}>Đăng ký</Link>
              </Button>,
              <Button size="large" type="primary" key="login" className="w-20">
                <Link to={constants.ROUTES.LOGIN}>Đăng nhập</Link>
              </Button>,
            ]}
          />
        </div>
      ) : (
        <Row className="account-page container m-tb-32">
          <Col className="p-r-16" span={24} md={4}>
            <ul className="account-page-menu m-t-12">
              {menu.map((item: any, index: number) => (
                <li
                  key={item.key}
                  className={`account-page-menu-item p-b-20 ${
                    item.key === activeKey ? "active" : ""
                  }`}
                  onClick={() => setActiveKey(item.key)}
                >
                  {item.Icon}
                  <span className="font-size-16px">{item.title}</span>
                </li>
              ))}
            </ul>
          </Col>
          <Col className="p-lr-8" span={24} md={20}>
            {renderComponent(activeKey)}
          </Col>
        </Row>
      )}
    </>
  );
};

export default Accountpage;
