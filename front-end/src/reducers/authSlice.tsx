import { createSlice } from "@reduxjs/toolkit";

const isAuth = JSON.parse(localStorage.getItem("isAuth")!);
const initialState = isAuth ? isAuth : {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
      localStorage.setItem("isAuth", JSON.stringify(state));
    },
  },
});
export const { setIsAuth } = authSlice.actions;
export default authSlice.reducer;
