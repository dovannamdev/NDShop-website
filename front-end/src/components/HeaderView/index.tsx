import {
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  Input,
  Menu,
  message,
  SelectProps,
  Space,
} from "antd";
import {
  AntDesignOutlined,
  MenuOutlined,
  NotificationOutlined,
  ReconciliationOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import defaultAvt from "../../assets/img/default-avt.png";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import helpers from "../../helpers";

import "./styles.scss";
import CartView from "./CartView";
import constants from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../reducers/userSlice";
import { setCartData } from "../../reducers/cartSlice";

const HeaderView = () => {
  const dispatch = useDispatch();
  const isSmDevice = true;
  const isMdDevice = false;

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [linkSearch, setLinkSearch] = useState("");
  const locations = useLocation().pathname;
  const initLink = "/search?keyword=";

  const user = useSelector((item: any) => item.userReducer);
  const carts = useSelector((item: any) => item.cartReducer);

  function totalItemCarts(carts: any) {
    if (carts) {
      return carts.reduce((total: any, item: any) => total + item.amount, 0);
    }
  }
  useEffect(() => {
    dispatch(setCartData(user));
  }, [user]);

  const onLogout = () => {
    try {
      dispatch(logoutUser());
      message.success("Đăng xuất thành công");
    } catch (error) {
      message.error("Đăng xuất thất bại", 2);
    }
  };

  const userActionMenu = () => {
    return (
      <Menu className="m-t-24" style={{ width: 244 }}>
        <Menu.Item>
          {user ? (
            <Button
              onClick={onLogout}
              size="large"
              className="w-100"
              type="primary"
              danger={true}
            >
              <Link to={constants.ROUTES.HOME}>Đăng xuất</Link>
            </Button>
          ) : (
            <Button size="large" className="w-100" type="primary">
              <Link to={constants.ROUTES.LOGIN}>Đăng nhập</Link>
            </Button>
          )}
        </Menu.Item>
        {!user ? (
          <Menu.Item>
            <Button
              size="large"
              className="w-100 btn-secondary"
              style={{ color: "#fff" }}
            >
              <Link to={constants.ROUTES.SIGNUP}> Đăng ký</Link>
            </Button>
          </Menu.Item>
        ) : (
          <Menu.Item>
            <Button
              style={{ color: "#fff" }}
              size="large"
              className="w-100 btn-secondary"
              type="default"
            >
              <Link to={constants.ROUTES.ACCOUNT + "/"}>Quản lý Tài khoản</Link>
            </Button>
          </Menu.Item>
        )}
      </Menu>
    );
  };
  return (
    <div className="wrap-header container-fluid bg-blue w-100vw">
      <div className="header container h-100 d-flex justify-content-between align-i-center ">
        <Link to="">
          <img src={logo} alt="logo" width={230} />
        </Link>
        <div className="t-right search-bar-wrapper w-100">
          <div className="search-bar pos-relative d-flex">
            <AutoComplete
              dropdownMatchSelectWidth={252}
              className=" w-100"
              style={{ width: 300 }}
              // options={options}
              onChange={(value) =>
                setLinkSearch(helpers.formatQueryString(value))
              }
              // filterOption={(inputValue, option) =>
              //   option?.value
              //     .toUpperCase()
              //     .indexOf(inputValue.toUpperCase()) !== -1
              // }
            >
              <Input
                className="input-style"
                size="large"
                placeholder="Nhập sản phẩm cần tìm"
              />
            </AutoComplete>
            <Button
              type="primary"
              size={isSmDevice ? "middle" : "large"}
              className="ant-input-search-button"
            >
              <Link to={linkSearch === "" ? locations : initLink + linkSearch}>
                <SearchOutlined /> {isSmDevice ? "Tìm kiếm" : ""}
              </Link>
            </Button>
          </div>
        </div>

        {isMdDevice ? (
          <>
            <Drawer
              title="Menu"
              placement="right"
              closable={true}
              maskClosable={true}
              onClose={() => setDrawerVisible(false)}
              visible={drawerVisible}
            >
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Drawer>
            <MenuOutlined
              className="menu-icon"
              onClick={() => setDrawerVisible(true)}
            />
          </>
        ) : (
          <ul className="d-flex m-0">
            <li>
              <Dropdown overlay={userActionMenu} placement="bottomRight">
                <Link
                  to={
                    user
                      ? `${constants.ROUTES.ACCOUNT}/`
                      : constants.ROUTES.LOGIN
                  }
                >
                  {!user ? (
                    <div className="d-flex flex-direction-column navbar-tool-item">
                      <UserOutlined className="icon" />
                      <span className="title">Đăng nhập</span>
                    </div>
                  ) : (
                    <div className="d-flex flex-direction-column navbar-tool-item align-i-center">
                      <Avatar style={{ backgroundColor: '#f56a00' }} >U</Avatar>
                      <span className="title">
                        {helpers.reduceProductName(user.fullName, 12)}
                      </span>
                    </div>
                  )}
                </Link>
              </Dropdown>
            </li>
            <li>
              <Dropdown
                overlay={
                  user ? <CartView list={carts} /> : <CartView list={[]} />
                }
                placement="bottomRight"
                arrow
              >
                <Link
                  className="d-flex flex-direction-column navbar-tool-item"
                  to={constants.ROUTES.CART}
                >
                  <ShoppingCartOutlined className="icon" />
                  {user ? (
                    <Badge
                      className="pos-absolute"
                      size="default"
                      style={{ color: "#fff" }}
                      count={totalItemCarts(carts)}
                      overflowCount={9}
                      offset={[36, -5]}
                    />
                  ) : (
                    ""
                  )}

                  <span className="title">GIỎ HÀNG</span>
                </Link>
              </Dropdown>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default HeaderView;
