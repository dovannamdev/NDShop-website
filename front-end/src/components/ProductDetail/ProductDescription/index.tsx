import { Col, Row } from "antd";
import Contents from "./Contents";
import "./index.scss";
import Specification from "./Specification";

const ProductDescription = ({ specification, productDesc }: any) => {
  return (
    <Row className="Product-Desc bg-white p-8" id="descId">
      <Col span={24} md={16}>
        <h2 className="font-weight-700">Mô tả sản phẩm</h2>
        {productDesc?.length ? (
          <Contents
            productDesc={productDesc}
            desTitle={specification?.description}
          />
        ) : (
          <></>
        )}
      </Col>

      <Col span={24} md={8} className={`p-8 `}>
        <h2 className="font-weight-700">Thông số kỹ thuật</h2>
        <Specification specification={specification} />
      </Col>
    </Row>
  );
};

export default ProductDescription;
