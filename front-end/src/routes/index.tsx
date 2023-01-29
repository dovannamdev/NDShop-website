import { lazy } from "react";
import { Route } from "react-router-dom";
import constants from "../constants";

const HomePage = lazy(() => import("../containers/HomePage"));
const ProductDetailPage = lazy(() => import("../containers/ProductDetailPage"));
const SignUp = lazy(() => import("../containers/SignUp"));
const Login = lazy(() => import("../containers/Login"));
const Cart = lazy(() => import("../containers/Cart"));
const Checkout = lazy(() => import("../containers/CheckoutPage"));
const AccountPage = lazy(() => import("../containers/AccountPage"));
const ForgotPassword = lazy(() => import("../containers/Login/ForgotPassword"));
const SearchPage = lazy(() => import("../containers/SearchFilterPage/Search"));
const AdminPage = lazy(() => import("../containers/AdminPage"));

const arrRoutes = [
  { path: constants.ROUTES.HOME, element: <HomePage /> },
  { path: constants.ROUTES.PRODUCT, element: <ProductDetailPage /> },
  { path: constants.ROUTES.SIGNUP, element: <SignUp /> },
  { path: constants.ROUTES.LOGIN, element: <Login /> },
  { path: constants.ROUTES.CART, element: <Cart /> },
  { path: constants.ROUTES.PAYMENT, element: <Checkout /> },
  { path: constants.ROUTES.ACCOUNT, element: <AccountPage /> },
  { path: constants.ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: constants.ROUTES.SEARCH, element: <SearchPage /> },
  { path: constants.ROUTES.ADMIN, element: <AdminPage /> },
  { path: "*", element: <HomePage /> },
];

const renderRoutes = (arrRoutes: any) => {
  return arrRoutes.map((item: any, index: number) => {
    const { path, element } = item;
    return <Route key={index} path={path} element={element} />;
  });
};

export { arrRoutes, renderRoutes };
