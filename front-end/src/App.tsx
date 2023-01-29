import React, { Suspense, useEffect, useState } from "react";
import logo from "./logo.svg";
import "antd/dist/antd.css";
import "./assets/common/utils/index.scss";
import HeaderView from "./components/HeaderView";
import { BrowserRouter, Routes } from "react-router-dom";
import FooterView from "./components/FooterView";
import { arrRoutes, renderRoutes } from "./routes";
import constants from "./constants";
import helpers from "./helpers";
import { useDispatch } from "react-redux";
import { setUser } from "./reducers/userSlice";
import ChatBox from "./components/ChatBox";

function App(props: any) {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = sessionStorage.getItem(constants.SSSTORAGE_USER);
    if (user) {
      const parseUser = helpers.parseJSON(user, {});
      if (parseUser?._id) {
        dispatch(setUser({ ...parseUser, keepLogin: false }));
      }
    }

    if (window.location.pathname?.indexOf("/admin") < 0) {
      const admin = localStorage?.getItem("admin");
      if (admin) {
        localStorage?.removeItem("admin");
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={false}>
        <HeaderView />
        <Routes>{renderRoutes(arrRoutes)}</Routes>
        <FooterView />
        <ChatBox />
      </Suspense>
    </BrowserRouter>
    // <HeaderView />
  );
}

export default App;
