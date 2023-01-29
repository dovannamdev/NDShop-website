import { useDispatch, useSelector } from "react-redux";
import  {
  delCartItem,
  updateCartItem,
} from "../../../reducers/cartSlice";
import CartItem from "./CartItem";

const CartOverview = (props: any) => {
  const { carts } = props;
  const dispatch = useDispatch();
  const user = useSelector((item: any) => item.userReducer);

  const onDelCartItem = (key: any) => {
    dispatch(delCartItem({key, user}));
  };

  const onUpdateNumOfProd = (key: any, value: any) => {
    dispatch(updateCartItem({ key, value, user }));
  };

  return (
    <>
      {carts && carts.map((item: any, index: any) => {
        return (
          <div key={index} >
            <CartItem
              index={index}
              {...item}
              onDelCartItem={onDelCartItem}
              onUpdateNumOfProd={onUpdateNumOfProd}
            />
          </div>
        );
      })}
    </>
  );
};
export default CartOverview;
