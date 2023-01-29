import { HomeOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";
import ProductOverview from "./ProductOverview";
import "./index.scss";
import ProductDescription from "./ProductDescription";
import helpers from "../../helpers";
import ProductReview from "./ProductReview";

const ProductDetail = (props: any) => {
  const { products } = props;
  const { productDesc } = products;

  return (
    <div className="Product-Detail-View container m-t-20">
      <Row>
        <Col span={24}>
          <ProductOverview products={products} />
        </Col>

        <Col span={24}></Col>

        <Col span={24}>
          <ProductDescription
            specification={products?.product}
            productDesc={productDesc}
          />
        </Col>
        <Col span={24}>
          <ProductReview productCode={products?.product?.code}/>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
