import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import "./index.scss";
import Tick from "../../assets/img/tick.png";
import CartOverview from "./CartOverview";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartPayment from "./CartPayment";

const Cart = () => {
  const carts = useSelector((state: any) => state.cartReducer);
  
  return (
    <div
      className="Cart-Detail-View container m-t-20"
      style={{ minHeight: "80vh" }}
    >
      <Row>
        {carts && carts.length !== 0 ? (
          <>
            <Col
              span={24}
              className="d-flex justify-content-between d-flex justify-content-center align-i-center flex-direction-column"
            >
              <img src={Tick} alt="" width={60} />
              <p style={{ fontWeight: "bold" }}>Giỏ hàng</p>
            </Col>
            <Col span={24} md={15}>
              <CartOverview carts={carts} />
            </Col>
            <Col md={1}>
              
            </Col>
            <Col span={24} md={8}>
              <CartPayment carts={carts} />
            </Col>
          </>
        ) : (
          <Col
            span={24}
            className="t-center m-t-50"
            style={{ minHeight: "90vh" }}
          >
            <h2 className="m-tb-16" style={{ color: "#888" }}>
              Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng
            </h2>
            <Link to="/">
              <Button type="primary" size="large">
                Mua sắm ngay nào
              </Button>
            </Link>
          </Col>
        )}
      </Row>
    </div>
  );
};
export default Cart;
