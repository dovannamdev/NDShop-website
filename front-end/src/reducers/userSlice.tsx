import { createSlice } from "@reduxjs/toolkit";
import userApi from "../apis/userApi";
import constants from "../constants";

const user = JSON.parse(localStorage.getItem("user")!);
const initialState = user ? user : null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { payload } = action;
      if (payload?.keepLogin) {
        localStorage.setItem("user", JSON.stringify(payload));
      }
      return payload;
    },

    updateInfoUser: (state, action) => {
      const { fullName, address, gender, birthday, phone } = action.payload;
      state = { ...state, fullName, gender, birthday, phone, address };
      localStorage.setItem("user", JSON.stringify(state));
      return state;
    },

    logoutUser:(state) => {
      localStorage.removeItem("user");
      localStorage.removeItem(constants.SSSTORAGE_USER);
      localStorage.removeItem('admin')
      return null;
    }
  },
});

export default userSlice.reducer;
export const { setUser, updateInfoUser, logoutUser } = userSlice.actions;
