import { Card } from "antd";
import { useEffect } from "react";
import PropTypes from "prop-types";
import helpers from "../../helpers";
import "./index.scss";

interface IProductView {
  className: any;
  name: string;
  price: number;
  stock: number;
  avtUrl: string;
  discount: number;
  height: number;
}

const ProductView = ({
  className,
  name,
  price,
  stock,
  avtUrl,
  discount,
  height,
}: IProductView) => {
  return (
    <Card
      className={`Product-View p-b-18 ${className}`}
      id="card-item"
      style={{ height, maxWidth: 280 }}
      loading={false}
      cover={
        <img className="max-w-100 max-h-100" src={avtUrl} alt="Product"></img>
      }
      hoverable
    >
      <div className="tietkiem-bg">
        <div className="tietkiem-title">TIẾT KIỆM</div>
        <div className="tietkiem-price">
          {helpers.formatProductPrice((discount * price) / 100)}
        </div>
      </div>
      {/* Tên sản phẩm */}
      <div className="font-size-16px m-b-10">
        {helpers.reduceProductName(name)}
      </div>
      {/* Giá sản phẩm */}
      <div className="Product-View-price m-b-10">
        {!price && <span className="Product-View-price--contact">Liên hệ</span>}
        <>
          <span className="Product-View-price--main font-size-20px font-weight-b">
            {helpers.formatProductPrice(price - (discount * price) / 100)}
          </span>
          {discount > 0 && (
            <div>
              <span className="Product-View-price--cancel font-weight-500">
                {helpers.formatProductPrice(price)}
              </span>
              <span className="m-l-8 Product-View-price--discount">
                {discount}%
              </span>
            </div>
          )}
        </>
      </div>
      {/* Số lượng hàng còn, chỉ hiển thị khi còn ít hơn 4 */}
      {stock <= 4 && stock > 0 && (
        <div className="Product-View-stock font-size-14px">
          chỉ còn {stock} sản phẩm
        </div>
      )}
      {stock === 0 && (
        <b className="Product-View-stock font-size-16px">Đang hết hàng</b>
      )}
    </Card>
  );
};

export default ProductView;
