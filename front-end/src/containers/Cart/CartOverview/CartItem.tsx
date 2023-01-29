import { DeleteOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Avatar, Col, InputNumber, Tooltip } from "antd";
import { Link } from "react-router-dom";
import helpers from "../../../helpers";
import "./index.scss";

const CartItem = (props: any) => {
  const {
    name,
    code,
    avt,
    stock,
    discount,
    price,
    amount,
    index,
    onDelCartItem,
    onUpdateNumOfProd,
  } = props;
  return (
    <div className="d-flex bg-white p-12 bor-rad-4 justify-content-between m-b-50">
      <Col span={12} className="t-center">
        <Avatar src={avt} alt="Photo" shape="square" size={180} />
        <div className="d-flex flex-direction-column p-10 " >
          <Link to={`/product/${code}`} className="font-size-15px" style={{color: 'Highlight'}}>
            {name}
          </Link>
        </div>
        <div className="m-b-20" style={{ flexBasis: 200 }}>
          <b className="font-size-25px m-r-10" style={{ color: "#3555C5" }}>
            {helpers.formatProductPrice(price -  Math.round(price * (discount / 100)))}
          </b>
          <span style={{ textDecoration: "line-through", color: "#aaa" }}>
            {helpers.formatProductPrice(price)}
          </span>
        </div>
        <div className="d-flex align-i-center justify-content-center">
          <span style={{ color: "#aaa" }} className="m-r-20">
            Số lượng:
          </span>
          <div>
            <InputNumber
              height={20}
              min={1}
              max={stock}
              value={amount}
              parser={(value: any) => value.match(/^\d+$/)}
              onChange={(value) => onUpdateNumOfProd(index, value)}
              size="large"
              style={{ borderColor: "#3555C5" }}
            />
          </div>
        </div>
      </Col>
      <Col span={11}>
        <div className="offer-items" id="of_IPH1264R">
          <div className="offer">
            <div className="stt">
              <label>KM1</label>
            </div>
            <div className="offer-border">
              <div className="content">
                <label className="radio-ctn">
                  <span>GIẢM THÊM TỚI 1.200.000đ khi Thu cũ - Lên đời mới</span>
                  <input
                    defaultChecked
                    className="cart-promote"
                    type="radio"
                    name={`IPH1264R_promote_g_0_428${name}`}
                    defaultValue={428}
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </div>
          </div>
          <div className="offer">
            <div className="stt">
              <label>KM2</label>
            </div>
            <div className="offer-border">
              <div className="content">
                <label className="radio-ctn">
                  <span>
                    Tặng sim data Mobifone Hera 5G (2.5GB/ngày) (Chưa bao gồm
                    tháng đầu tiên)
                  </span>
                  <input
                    defaultChecked
                    className="cart-promote"
                    type="radio"
                    name={`IPH1264R_promote_g_0_429${name}`}
                    defaultValue={445}
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </div>
          </div>
          <div className="offer">
            <div className="stt">
              <label>KM3</label>
            </div>
            <div className="offer-border">
              <div className="content">
                <label className="radio-ctn">
                  <span>Giảm thêm tới 500.000đ khi thanh toán qua VNPAY</span>
                  <input
                    defaultChecked
                    className="cart-promote"
                    type="radio"
                    name={`IPH1264R_promote_g_0_4210${name}`}
                    defaultValue={932}
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </div>
          </div>
          <div className="offer">
            <div className="stt">
              <label>KM4</label>
            </div>
            <div className="offer-border">
              <div className="content">
                <label className="radio-ctn">
                  <span>
                    Giảm thêm tới 600.000đ khi mở thẻ TP Bank EVO thành công
                  </span>
                  <input
                    defaultChecked
                    className="cart-promote"
                    type="radio"
                    name={`IPH1264R_promote_g_0_412${name}`}
                    defaultValue={1051}
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <Col span={1}>
        <div className="edit" onClick={() => onDelCartItem(index)}>
        <MinusCircleOutlined className="minus" />
        </div>
      </Col>
    </div>
  );
};

export default CartItem;
