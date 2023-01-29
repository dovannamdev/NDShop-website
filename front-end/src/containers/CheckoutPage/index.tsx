import {
  Avatar,
  Button,
  Card,
  Col,
  message,
  Radio,
  Result,
  Row,
  Space,
} from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import constants, { STRIPE_KEY } from "../../constants";
import helpers from "../../helpers";
import CartPayment from "../Cart/CartPayment";
import EditDelivery from "./EditDelivery";
import Tick from "../../assets/img/tick.png";
import "./style.scss";
import { resetCart } from "../../reducers/cartSlice";
import orderApi from "../../apis/orderApi";
import { loadStripe, StripeCardElement } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const PAYMENT_METHOD = [
  { value: "DELIVERY", label: "Thanh toán tận nơi" },
  { value: "PAYMENT_ONLINE", label: "Thanh toán Visa" },
];

const stripeKey = loadStripe(STRIPE_KEY);

const CheckOutPage = () => {
  const dispatch = useDispatch();
  const carts = useSelector((state: any) => state.cartReducer);
  const user = useSelector((state: any) => state.userReducer);

  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.fullName,
    phone: user?.phone,
    address: user?.address,
  });
  const [isSelectPayment, setIsSelectPayment] = useState(false);

  const tempPrice = carts.reduce((a: any, b: any) => {
    if (b.discount) {
      return a + (b.price * b.amount);
    }
    return a + b.price;
  }, 0);

  const transportFee = tempPrice >= 1000000 ? 0 : 100000;
  // tổng khuyến mãi
  const totalDiscount = carts.reduce(
    (a: any, b: any) => a + ((b.price * b.discount) / 100) * b.amount,
    0
  );

  const showOrderInfo = (carts: any) => {
    return carts?.map((item: any, index: any) => (
      <Card key={index}>
        <Card.Meta
          avatar={
            <Avatar size={48} shape="square" src={item.avt} alt="Photo" />
          }
          title={helpers.reduceProductName(item.name, 40)}
          description={
            <>
              <span>{`Số lượng: ${item.amount}`}</span>
              <p className="font-size-16px font-weight-700">
                <span>
                  {helpers.formatProductPrice(
                    item.price - (item.price * item.discount) / 100
                  )}
                </span>
                <span style={{marginLeft: '20px', fontWeight: 500, color: 'red'}}>
                  <del>{helpers.formatProductPrice(item.price)}</del>
                </span>
              </p>
            </>
          }
        />
      </Card>
    ));
  };

  const onCheckout = async (paymentMethod: any, paymentId: any) => {
    try {
      const orderStatus = 0;
      const orderDate = new Date();
      const productList = carts.map((item: any, index: number) => {
        const { amount, name, price, discount, code } = item;
        return {
          numOfProd: amount,
          orderProd: { name, price, discount, code: code },
        };
      });
      // tổng khuyến mãi
      const totalDiscount = carts.reduce(
        (a: any, b: any) => a + ((b.price * b.discount) / 100) * b.amount,
        0
      );
      const response = await orderApi.postCreateOrder({
        owner: user._id,
        deliveryAdd: deliveryAddress,
        orderStatus,
        transportFee,
        orderDate,
        productList,
        paymentMethod,
        paymentId,
        totalPrice: tempPrice - totalDiscount + transportFee,
        totalDiscount,
      });
      
      if (response?.data?.success) {
        message.success("Đặt hàng thành công", 2);
        dispatch(resetCart(user));
        setTimeout(() => {
          setIsOrderSuccess(true);
        }, 1000);
      }
    } catch (error) {
      message.error("Đặt hàng thất bại, thử lại", 3);
    }
  };

  const onModalVisible = () => {
    setModalVisible(!isModalVisible);
  };

  const onSetDeliveryAddress = (data: any) => {
    setDeliveryAddress(data);
  };

  return (
    <>
      {carts.length <= 0 && !isOrderSuccess && (
        <Navigate to={constants.ROUTES.ACCOUNT} />
      )}
      <div className="t-center m-t-20">
        <img src={Tick} alt="" width={60} />
        <p style={{ fontWeight: "bold" }}>THANH TOÁN</p>
      </div>
      {user ? (
        !isSelectPayment ? (
          <div className="m-tb-4 container">
            {isOrderSuccess ? (
              <Result
                status="success"
                title="Đơn hàng của bạn đã đặt thành công."
                subTitle="Xem chi tiết đơn hàng vừa rồi"
                extra={[
                  <Button type="default" key="0">
                    <Link to={constants.ROUTES.ACCOUNT + "/orders"}>
                      Xem chi tiết đơn hàng
                    </Link>
                  </Button>,
                  <Button key="1" type="primary">
                    <Link to="/">Tiếp tục mua sắm</Link>
                  </Button>,
                ]}
              />
            ) : (
              <Row gutter={[16, 16]} style={{ minHeight: "65vh" }}>
                <Col span={24} md={16}>
                  <div className="p-12 bg-white bor-rad-8 m-tb-16">
                    <div className="d-flex justify-content-between">
                      <h2>Thông tin đơn hàng</h2>
                      <Button type="link" size="large">
                        <Link to={constants.ROUTES.CART}>Chỉnh sửa</Link>
                      </Button>
                    </div>
                    <div>{showOrderInfo(carts)}</div>
                  </div>
                </Col>
                <Col span={24} md={8}>
                  <div className="p-12 bg-white bor-rad-8 m-tb-16">
                    <div className="d-flex justify-content-between">
                      <h2>Thông tin giao hàng</h2>
                      <Button
                        type="link"
                        size="large"
                        onClick={() => setModalVisible(!isModalVisible)}
                      >
                        Chỉnh sửa
                      </Button>
                      <EditDelivery
                        deliveryAddress={deliveryAddress}
                        isModalVisible={isModalVisible}
                        onModalVisible={onModalVisible}
                        onSetDeliveryAddress={onSetDeliveryAddress}
                      />
                    </div>
                    <div
                      className={`bg-white bor-rad-8 box-sha-home p-tb-8 p-lr-16 m-tb-16 }`}
                    >
                      <div className=" justify-content-between m-tb-4">
                        <h3>
                          <b>Họ tên: </b>
                          {deliveryAddress.name}
                        </h3>
                        <p className="m-b-6">
                          <b>Địa chỉ:</b> {deliveryAddress.address}
                        </p>
                        <p className="m-b-6">
                          <b>Số điện thoại:</b> {deliveryAddress.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white">
                    <CartPayment
                      isLoading={isLoading}
                      carts={carts}
                      isCheckout={true}
                      transportFee={transportFee}
                      onCheckout={() => setIsSelectPayment(true)}
                    />
                  </div>
                </Col>
              </Row>
            )}
          </div>
        ) : (
          <Elements stripe={stripeKey}>
            <SelectPaymentMethod
              totalPrice={helpers.formatProductPrice(
                tempPrice - totalDiscount + transportFee
              )}
              onCheckout={onCheckout}
            />
          </Elements>
        )
      ) : (
        <Navigate to={constants.ROUTES.LOGIN} />
      )}
    </>
  );
};

const SelectPaymentMethod = ({ totalPrice, onCheckout }: any) => {
  const [selectPayment, setSelectPayment] = useState(
    PAYMENT_METHOD?.[0]?.value
  );
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: any) => state.userReducer);
  const stripe = useStripe();
  const elements = useElements();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      if (selectPayment === PAYMENT_METHOD?.[0]?.value) {
        await onCheckout(selectPayment);
      }

      if (!stripe || !elements) {
        return message.error("Cần nhập đầy đủ thông tin thanh toán");
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement) as StripeCardElement,
        billing_details: {
          email: user?.email,
          phone: user?.phone,
          name: user?.fullName,
        },
      });

      if (!error) {
        const { id } = paymentMethod;
        await onCheckout(selectPayment, id);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="select-payment-title">Lựa chọn hình thức thanh toán</div>
      <div className="payment-result">
        Số tiền thanh toán: <span>{totalPrice}</span>
      </div>
      <div className="payment-method-frame">
        <Radio.Group
          onChange={(event) => setSelectPayment(event.target.value)}
          value={selectPayment}
        >
          <Space direction="vertical">
            {PAYMENT_METHOD?.map((item: any, index: any) => {
              return <Radio value={item?.value}>{item?.label}</Radio>;
            })}
          </Space>
        </Radio.Group>
      </div>
      {selectPayment === PAYMENT_METHOD?.[1]?.value ? (
        <div className="visia-card-frame">
          <div style={{ width: "400px" }}>
            <CardElement id="card-element" />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="select-payment-button">
        <div style={{ width: "200px" }}>
          <Button
            onClick={() => handleCheckout()}
            className="m-t-16 d-block m-lr-auto w-100"
            type="primary"
            size="large"
            loading={isLoading}
            style={{ backgroundColor: "#3555c5", color: "#fff" }}
          >
            ĐẶT HÀNG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
