import { Col, Row } from "antd";
import AllProduct from "./AllProduct";
import "./index.scss";
import Promotion from "./Promotion";
import Promotion2 from "./Promotion2";
import SellingProduct from "./SellingProduct";
import Slider from "./Slider";
const HomePage = () => {
  return (
    <div className="Home">
      <div className="pos-relative">
        <Slider />

        <Row className="container">
          <Col span={24} className="m-tb-32 bg-white box-sha-home bor-rad-8">
            <Promotion />
          </Col>
        </Row>

        <Row className="container">
          <Col span={24} className="m-tb-32 bg-white box-sha-home bor-rad-8">
            <SellingProduct />
          </Col>
        </Row>

        <Row className="container">
          <Col span={24} className="m-tb-32 bg-white box-sha-home bor-rad-8">
            <AllProduct />
          </Col>
        </Row>

        

        <Row className="container laptop-van-phong">
          <Promotion2/>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
