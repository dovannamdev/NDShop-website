import { Col, Row } from "antd";
import { Link } from "react-router-dom";
import "./index.scss";

const Promotion = () => {
  return (
    <div className="promotion-bgwhite ">
      <div className="bg-head">
        <div className="bg-header">ƯU ĐÃI CỦA BẠN</div>
      </div>
      <Row className="list-promotion">
        <Col className="promotion-item p-6" span={6}>
          <Link to="">
            <img
              width="100%"
              src="//theme.hstatic.net/1000233206/1000806987/14/home_promotion_1_imec.png?v=1071"
              alt=""
            />
          </Link>
        </Col>

        <Col className="promotion-item p-6" span={6}>
          <Link to="">
            <img
              width="100%"
              src="//theme.hstatic.net/1000233206/1000806987/14/home_promotion_2_imec.png?v=1071"
              alt=""
            />
          </Link>
        </Col>

        <Col className="promotion-item p-6" span={6}>
          <Link to="">
            <img
              width="100%"
              src="//theme.hstatic.net/1000233206/1000806987/14/home_promotion_3_imec.png?v=1071"
              alt=""
            />
          </Link>
        </Col>

        <Col className="promotion-item p-6" span={6}>
          <Link to="">
            <img
              width="100%"
              src="//theme.hstatic.net/1000233206/1000806987/14/home_promotion_4_imec.png?v=1071"
              alt=""
            />
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default Promotion;
