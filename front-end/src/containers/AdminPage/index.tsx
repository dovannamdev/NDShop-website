import {
  AppstoreAddOutlined,
  DashboardOutlined,
  DropboxOutlined,
  HomeOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import Login from "./Login";
import logoUrl from "../../assets/img/logo.png";
import { Avatar, Button, Menu } from "antd";
import Dashboard from "./Dashboard";
import "./index.scss";
import { Link, Navigate } from "react-router-dom";
import ProductList from "./ProductList";
import CustomerList from "./CustomerList";
import OrderList from "./OrderList";
import BrandList from "./BrandList";
import ChatList from "./ChatList";
import helpers from "../../helpers";
import AdminList from "./AdminList";
import RoleList from "./RoleList";
import roleApi from "../../apis/roleApi";
import constants from "../../constants";
import StockList from "./StockList";
import DeliveryList from "./DeliveryList";

const MENU_COMPONENT = [
  {
    key: "d",
    roleFunction: "dashboard",
    title: "Trang chủ",
    icon: <DashboardOutlined />,
    children: [],
  },
  {
    key: "b",
    roleFunction: "brand",
    title: "Quản lí thương hiệu",
    icon: <AppstoreAddOutlined />,
    children: [],
  },
  {
    key: "p",
    roleFunction: "product",
    title: "Quản lí sản phẩm",
    icon: <ShoppingCartOutlined />,
    children: [],
  },
  {
    key: "stock",
    roleFunction: "stock",
    title: "Quản lí kho",
    icon: <DropboxOutlined />,
    children: [],
  },
  {
    key: "o",
    roleFunction: "order_list",
    title: "Quản lí đơn hàng",
    icon: <ReconciliationOutlined />,
    children: [],
  },
  {
    key: "delivery",
    roleFunction: "delivery",
    title: "Giao hàng",
    icon: <ReconciliationOutlined />,
    children: [],
  },
  {
    key: "r",
    roleFunction: "role",
    title: "Quản lí quyền",
    icon: <ProfileOutlined />,
    children: [],
  },
  {
    key: "c",
    roleFunction: "customer",
    title: "Quản lí người dùng",
    icon: <UserOutlined />,
    children: [],
  },
  {
    key: "a",
    roleFunction: "admin",
    title: "Quản lí nhân viên",
    icon: <SettingOutlined />,
    children: [],
  },
  {
    key: "uc",
    roleFunction: "chat",
    title: "Tin nhắn",
    icon: <WechatOutlined />,
    children: [],
  },
];

const { ADMIN_ROLE_KEY } = constants;

const AdminPage = () => {
  const menuList = useMemo(() => {
    const adminRole = localStorage.getItem(ADMIN_ROLE_KEY);
    const parseRole = adminRole ? JSON.parse(adminRole) : [];
    const filterRole = parseRole?.filter(
      (item: any) => item?.rolePermisstion?.indexOf("view") >= 0
    );

    const mapRoleComponent = MENU_COMPONENT?.filter((item: any) => {
      if (item?.key === "backToHome") return true;
      const roleComponent = filterRole?.findIndex(
        (it: any) => it?.roleFunction === item?.roleFunction
      );
      return roleComponent >= 0 ? true : false;
    });

    return mapRoleComponent?.length === 1 &&
      mapRoleComponent[0]?.key === "backToHome"
      ? [
        {
          key: "notPermission",
          title: "Quyền",
          icon: <ProfileOutlined />,
          children: [],
        },
      ].concat(mapRoleComponent)
      : mapRoleComponent;
    return MENU_COMPONENT;
  }, []);

  const [keyMenu, setKeyMenu] = useState<any>(menuList[0]?.key);
  const [isLogin, setIsLogin] = useState(() => {
    const isLogin = localStorage.getItem("admin");
    return isLogin ? true : false;
  });
  const [adminName, setAdminName] = useState(() => {
    const admin: any = helpers.parseJSON(
      localStorage.getItem("admin") || "",
      {}
    );
    return admin?.name ? admin?.name : "Admin";
  });

  const onLogin = async (isLogin: any, adminData: any) => {
    if (isLogin) {
      const adminRoles = await roleApi.getRoleByAdminId(adminData?._id);
      if (adminRoles?.data?.success) {
        localStorage.setItem(
          ADMIN_ROLE_KEY,
          JSON.stringify(adminRoles?.data?.payload)
        );
      }
      setIsLogin(true);
      setAdminName(adminData?.name);
      localStorage.setItem("admin", JSON.stringify(adminData));
      window.location.reload();
    }
  };

  const onLogout = () => {
    setIsLogin(false);
    localStorage.removeItem("admin");
  };

  const handleSelected = (e: any) => {
    const { key } = e;
    setKeyMenu(key);
  };

  const renderMenuItem = () => {
    // return MenuItem if children = null
    return menuList.map((item: any, index: number) => {
      const { key, title, icon } = item;
      return (
        <Menu.Item className="menu-item" key={key} icon={icon}>
          <span className="menu-item-title">{title}</span>
        </Menu.Item>
      );
    });
  };

  const renderMenuComponent = (key: any) => {
    switch (key) {
      case "d":
        return <Dashboard />;
      case "b":
        return <BrandList />;
      case "p":
        return <ProductList />;
      case "stock":
        return <StockList />;
      case "r":
        return <RoleList />;
      case "c":
        return <CustomerList />;
      case "a":
        return <AdminList />;
      case "delivery":
        return <DeliveryList />;
      case "o":
        return <OrderList />;
      case "uc":
        return <ChatList />;
      case "notPermission":
        return (
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            Bạn hiện chưa được cấp quyền truy cập
          </div>
        );
      default:
        break;
    }
  };

  return (
    <div className="Admin-Page" style={{ backgroundColor: "#e5e5e5" }}>
      {!isLogin ? (
        <div className="trans-center bg-white p-32 bor-rad-8 box-sha-home">
          <h2 className="m-b-16 t-center">Đăng nhập với quyền Admin</h2>
          <Login onLogin={onLogin} />
        </div>
      ) : (
        <>
          <div
            className="d-flex align-i-center header"
            style={{ height: "72px" }}
          >
            <div className="logo t-center" style={{ flexBasis: "200px" }}>
              <Link to="/admin">
                <img width={200} src={logoUrl} alt="logo" />
              </Link>
            </div>
            <div className="flex-grow-1 d-flex align-i-center">
              <h2 className="t-color-primary flex-grow-1 p-l-44 main-title"></h2>

              <div className="user-admin p-r-24 t-color-primary font-weight-500">
                <Avatar
                  size={40}
                  className="m-r-10"
                  style={{ backgroundColor: '#f56a00' }}
                >A</Avatar>
                <span className="user-admin-title">{adminName}</span>
              </div>
              <Button
                onClick={onLogout}
                className="m-r-44"
                type="primary"
                danger
              >
                Đăng xuất
              </Button>
            </div>
          </div>

          <div className="d-flex">
            <Menu
              className="menu p-t-24"
              theme="dark"
              onClick={handleSelected}
              style={{
                height: "inherit",
                minHeight: "93vh",
                flexBasis: "200px",
              }}
              defaultSelectedKeys={keyMenu}
              mode="inline"
            >
              {renderMenuItem()}
            </Menu>

            {/* main contents */}
            <div className="flex-grow-1">{renderMenuComponent(keyMenu)}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
