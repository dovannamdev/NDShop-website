import { createSlice } from "@reduxjs/toolkit";
import constants from "../constants";

const initialState: any = [];

const cartSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    setCartData: (state, action) => {
      const user = action?.payload
      const userCart = localStorage?.getItem(`${constants.CARTS}_${user?._id}`)    
      return userCart ? JSON.parse(userCart) : []
    },
    
    addToCart: (state, action) => {
      const item = action.payload;
      const {product, user} = item
      let isExist = false;

      for (let i = 0; i < state.length; i++) {
        if (state[i].code === product.code) {
          state[i].amount += product.amount;
          isExist = true;
          break;
        }
      }
      if (!isExist) state.push(product);
      localStorage.setItem(`${constants.CARTS}_${user?._id}`, JSON.stringify(state));
    },
    
    delCartItem: (state, action) => {
      const data = action.payload;
      const {key, user} = data;

      state = [
        ...state.slice(0, key),
        ...state.slice(key + 1, state.length),
      ];
      localStorage.setItem(`${constants.CARTS}_${user?._id}`, JSON.stringify(state));
      return state;
    },

    updateCartItem: (state, action) => {
      const { key, value, user } = action.payload;
      state = state.map((item: any, i: number) => {
        return i === key ? { ...item, amount: value } : { ...item };
      });
      localStorage.setItem(`${constants.CARTS}_${user?._id}`, JSON.stringify(state));
      return state;
    },
    
    resetCart: (state, action) => {
      const user = action.payload;
      localStorage.removeItem(`${constants.CARTS}_${user?._id}`);
      return [];
    },
  },
});

export const { addToCart, delCartItem, resetCart, updateCartItem, setCartData } =
  cartSlice.actions;
// export cartSlice.reducer;
export default cartSlice.reducer;
