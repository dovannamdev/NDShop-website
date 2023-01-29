import { Col, Row } from "antd";
import { Link } from "react-router-dom";
import "./index.scss";

const Promotion2 = () => {
  return (
    <div className="promotion-bgwhite ">
      <Row className="list-promotion">
        <Col className="promotion-item p-6" span={12}>
          <Link to="">
            <img
              width="100%"
              src="https://lh3.googleusercontent.com/7RJKUCICf6o_NKcmO0XcRd6X5ltfNeVcZchhq9IpRygu6ehU7CXaoNaydhh7FlWBnieysJdtOGPlanc8ihCTiw0H_f78MBmFOg=rw-w616"
              alt=""
            />
          </Link>
        </Col>

        <Col className="promotion-item p-6" span={12}>
          <Link to="">
            <img
              width="100%"
              src="https://lh3.googleusercontent.com/Ep8HxqUcX6VtI2tClVnB9y41pvpP9Y7mDoaIHIw0YxAg2DFT2sJGlCxC-67e2tl4c2OTYfOnA_FG13QQwSeaPSTwGS6V20M4=rw-w616"
              alt=""
            />
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default Promotion2;
