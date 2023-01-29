import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
export const store = configureStore({
  reducer: {
    authReducer,
    cartReducer,
    userReducer,
  },
});
export default store;