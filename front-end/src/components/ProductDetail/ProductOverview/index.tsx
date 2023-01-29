import { PhoneOutlined } from "@ant-design/icons";
import { Button, Col, Image, InputNumber, message, Rate, Row } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImgLoadFailed from "../../../assets/img/loading-img-failed.png";
import constants from "../../../constants";
import helpers from "../../../helpers";
import { addToCart } from "../../../reducers/cartSlice";
import "./index.scss";

const countItemInCart = (productCode: any, carts: any) => {
  let count = 0;
  if (!carts) return count;
  carts.forEach((item: any) => {
    if (item.code === productCode) count += item.amount;
  });
  return count;
};

const ProductOverview = ({ products }: any) => {
  const dispatch = useDispatch();
  const { avt, name, brand, code, price, discount, stock } =
    products.product;
  const catalogs = products.productCatalog;
  const imgList = [avt, ...(catalogs?.map((it: any) => it?.catalog))];
  const priceBefore = price - (price * discount) / 100;
  const currentStock = stock - countItemInCart(code, "");
  const user = useSelector((item: any) => item.userReducer);

  const [avtIndex, setAvtIndex] = useState(0);
  const [numOfProduct, setNumberOfProduct] = useState(1);

  const showCatalogs = (catalog: any) => {
    return catalog.map((item: any, index: number) => {
      return (
        <Image
          key={index}
          src={item}
          width={48}
          className={`catalog-item p-8 ${index === avtIndex ? "active" : ""}`}
          onMouseEnter={() => setAvtIndex(index)}
        />
      );
    });
  };

  const addCart = () => {    
    if (user?.email) {
      let product = {
        code,
        name,
        price,
        amount: numOfProduct,
        avt,
        discount,
        stock,
      };
      setNumberOfProduct(1);
      dispatch(addToCart({product, user: user}));
      message.success("Thêm vào giỏ hàng thành công");
    }else{
      message.error('Cần đăng nhập để thực hiện chức năng này')
    }
  };

  return (
    <Row className="Product-Overview bg-white p-16">
      <Col span={24} md={10}>
        <div
          style={{ height: 268 }}
          className="d-flex align-i-center justify-content-center "
        >
          <Image
            style={{ maxHeight: "100%" }}
            fallback={ImgLoadFailed}
            src={imgList[avtIndex]}
          />
        </div>
        <div className="d-flex w-100 bg-white p-b-16 p-t-8">
          {showCatalogs(imgList)}
        </div>
      </Col>
      <Col span={24} md={14} className="p-l-16">
        <h2 className="font-size-24px ">
          {helpers.reduceProductName(name, 140)}
        </h2>
        <div className="p-tb-8">
          <Rate disabled defaultValue={5} allowHalf />
          <a href="#evaluation" className="m-l-8"></a>
        </div>
        <div
          className="font-size-16px font-weight-400"
          style={{ color: "#aaa" }}
        >
          Thương hiệu:
          <span className="product-brand font-weight-500">&nbsp;{brand}</span>
          &nbsp; | &nbsp;<span>{code}</span>
        </div>

        <h1 className="product-price font-weight-700 p-tb-8">
          {priceBefore === 0 ? "Liên hệ" : helpers.formatProductPrice(priceBefore)}
        </h1>
        <p className="price-reduce">
          {helpers.formatProductPrice(price)}
        </p>

        <div className="p-t-12 ">
          {currentStock === 0 ? (
            <h3 className="m-r-8 m-t-8 font-size-18px" style={{ color: "red" }}>
              <i>Sản phẩm hiện đang hết hàng !</i>
            </h3>
          ) : (
            <div className="d-flex align-i-center">
              <h3 className="m-r-16  font-size-16px">Chọn số lượng: </h3>
              <InputNumber
                name="numOfProduct"
                size="middle"
                parser={(value: any) => value.match(/^\d+$/)}
                value={numOfProduct}
                min={1}
                max={currentStock}
                onChange={(value:any) => setNumberOfProduct(value)}
              />
            </div>
          )}

          {price > 0 && currentStock > 0 ? (
            <div className="btn-group p-tb-16 d-flex justify-content-around">
              <Button
                onClick={addCart}
                size="large"
                type="primary"
                disabled={stock ? false : true}
                className="m-r-16 w-100 btn-group-item"
              >
                THÊM GIỎ HÀNG
              </Button>

              <Button
                size="large"
                disabled={stock ? false : true}
                className="m-r-16 w-100 btn-group-item btn-secondary"
              >
                <Link to={constants.ROUTES.CART}>ĐẾN GIỎ HÀNG</Link>
              </Button>
            </div>
          ) : (
            <Button
              size="large"
              className="m-tb-16 w-100 btn-group-item"
              style={{ backgroundColor: "#3555c5" }}
            >
              <a href="https://www.facebook.com/NDxKen/" target="blank">
                <PhoneOutlined style={{ fontSize: 18 }} className="m-r-8" />{" "}
                LIÊN HỆ
              </a>
            </Button>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default ProductOverview;
