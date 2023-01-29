import { Avatar, Button, Card, List } from "antd";
import { Link } from "react-router-dom";
import constants from "../../../constants";
import helpers from "../../../helpers";
import "./styles.scss";

const CartView = ({ list }: any) => {
  const { Meta } = Card;
  const length = list.length;
  

  const totalPrice = (list: any) => {
    return list.reduce((a: any, b: any) => {
      if (b.discount) {
        return a + (b.price - b.price * (b.discount / 100)) * b.amount;
      }
      return a + b.price;
    }, 0);
  };

  return (
    <div
      className="cart-view p-8"
      style={{ backgroundColor: "#fff", height: "600" }}
    >
      <div className="cart-items p-8">
        <List
          itemLayout="vertical"
          size="large"
          dataSource={list}
          renderItem={(item: any) => (
            <Card>
              <Meta
                avatar={
                  <Avatar
                    shape="square"
                    style={{ width: 80, height: 50 }}
                    src={item.avt}
                  />
                }
                title={item.name}
                description={`Số lượng: ${item.amount}`}
              />
              <p className="product-price">
                {helpers.formatProductPrice(item?.price - item?.price * (item?.discount / 100))}
              </p>
            </Card>
          )}
        />
      </div>

      <div className="cart-additional p-8">
        <h3>Tổng tiền: {helpers.formatProductPrice(totalPrice(list))}</h3>
        <Link to={length > 0 ? constants.ROUTES.CART : "/"}>
          <Button
            className="m-tb-8 d-block m-lr-auto w-100"
            type="primary"
            size="large"
          >
            {length > 0 ? "Đến giỏ hàng" : "Mua sắm ngay"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartView;
