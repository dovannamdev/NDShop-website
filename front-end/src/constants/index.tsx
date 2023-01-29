// laptop
const FILTER_BRAND_LAPTOP = [
  {
    title: "Apple",
    to: "apple",
  },
  {
    title: "Acer",
    to: "acer",
  },
  {
    title: "ASUS",
    to: "asus",
  },
  {
    title: "Dell",
    to: "dell",
  },
  {
    title: "HP",
    to: "hp",
  },
  {
    title: "Lenovo",
    to: "lenovo",
  },
  {
    title: "LG",
    to: "lg",
  },
  {
    title: "MSI",
    to: "msi",
  },
];
const FILTER_SIZE_LAPTOP = [
  {
    title: "Dưới 13 inch",
    to: `duoi_13_inch`,
  },
  {
    title: "Từ 13 đến 15 inch",
    to: `tu_13_den_15_inch`,
  },
  {
    title: "Trên 15 inch",
    to: `tren_15_inch`,
  },
];
const FILTER_PRICE_LAPTOP = [
  {
    title: "Dưới 10 triệu",
    to: `nhohon-10tr`,
  },
  {
    title: "Từ 10 - 15 triệu",
    to: `lonhon-10tr,nhohon-15tr`,
  },
  {
    title: "Từ 15 - 20 triệu",
    to: `lonhon-15tr,nhohon-20tr`,
  },
  {
    title: "Từ 20 - 30 triệu",
    to: `lonhon-20tr,nhohon-30tr`,
  },
  {
    title: "Từ 30 - 50 triệu",
    to: `lonhon-30tr,nhohon-50tr`,
  },
  {
    title: "Trên 50 triệu",
    to: `lonhon-50tr`,
  },
];
const FILTER_CHIP_LAPTOP = [
  {
    title: "Intel Core i3",
    to: "0",
  },
  {
    title: "Intel Core i5",
    to: "1",
  },
  {
    title: "Intel Core i7",
    to: "2",
  },
  {
    title: "Intel Core i9",
    to: "3",
  },
  {
    title: "AMD Ryzen 3",
    to: "4",
  },
  {
    title: "AMD Ryzen 5",
    to: "5",
  },
  {
    title: "AMD Ryzen 7",
    to: "6",
  },
  {
    title: "Pentium",
    to: "7",
  },
  {
    title: "Celeron",
    to: "8",
  },
];
const FILTER_ACCESSORY_LAPTOP = [
  {
    title: "Bàn phím",
    to: "/",
  },
  {
    title: "RAM máy tính",
    to: "/",
  },
  {
    title: "Ổ cứng",
    to: "/",
  },
  {
    title: "Chuột máy tính",
    to: "/",
  },
];

// hình thức giao hàng
const TRANSPORT_METHOD_OPTIONS = [
  { value: 0, label: "Giao hàng tiêu chuẩn", price: 40000 },
  { value: 1, label: "Giao hàng tiết kiệm", price: 20000 },
  { value: 2, label: "Giao hàng nhanh", price: 100000 },
];

// gender options
const GENDER_OPTIONS = [
  { value: 0, label: "Nam" },
  { value: 1, label: "Nữ" },
];

// product type options
const PRODUCT_TYPES = [{ type: 0, label: "Laptop" }];

const ROUTES = {
  HOME: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/login/forgot-pw",
  PRODUCT: "/product/:productCode",
  NOT_FOUND: "/not-found",
  ADMIN: "/admin",
  ACCOUNT: "/account",
  CART: "/cart",
  SEARCH: "/search",
  FILTER: "/filter",
  PAYMENT: "/payment",
};

const SSSTORAGE_USER = "usrif_key";
const CHAT_HOST = "http://localhost:5001";
const DEFAULT_ROLE = [
  { label: "Trang chủ", key: "dashboard" },
  { label: "Quản lí thương hiệu", key: "brand" },
  { label: "Quản lí sản phẩm", key: "product" },
  { label: "Quản kí kho", key: "stock" },
  { label: "Quản lí đơn hàng", key: "order_list" },
  { label: "Giao hàng", key: "delivery" },
  { label: "Quản lí quyền", key: "role" },
  { label: "Quản lí khách hàng", key: "customer" },
  { label: "Quản lí nhân viên", key: "admin" },
  { label: "Tin nhắn", key: "chat" },
];
const PERMISSION = [
  { label: "Xem", key: "view" },
  { label: "Thêm", key: "create" },
  { label: "Sửa", key: "update" },
  { label: "Xoá", key: "delete" },
];

const CHAT_PERMISSION = [
  { label: "Xem", key: "view" },
  { label: "Trả lời", key: "reply" },
];

const ORDER_PERMISSION = [
  { label: "Xem", key: "view" },
  { label: "Cập nhật", key: "update" },
];

const CUSTOMER_PERMISSION = [
  { label: "Xem", key: "view" },
  { label: "Cập nhật", key: "update" },
];

const ADMIN_PERMISSION = [
  { label: "Xem", key: "view" },
  { label: "Thêm", key: "create" },
  { label: "Cập nhật", key: "update" },
];

const DELIVERY_STATUS = [
  {label: 'Xác nhận đơn hàng', value: 1},
  {label: 'Đang giao hàng', value: 2},
  {label: 'Giao hàng thành công', value: 3},
  {label: 'Giao hàng thất bại', value: 4},
]

const ADMIN_ROLE_KEY = 'admin-roles'
export const FORMAT_NUMBER = new Intl.NumberFormat();
export const STRIPE_KEY =
  "pk_test_51MCO5BEIGmI0kD65W7dezlGx2ceUqpZeShFjSSEJX15RfS1LDxSBFG0Nzav5V5Q3Jt2YDWJ5ZtxrfPzdmh32I2mW00vyAjweSE";

export default {
  REFRESH_TOKEN_KEY: "refresh_token",
  ACCESS_TOKEN_KEY: "ND_atk",
  MAX_VERIFY_CODE: 6,
  TRANSPORT_METHOD_OPTIONS,
  GENDER_OPTIONS,
  // tuổi nhỏ nhất sử dụng app
  MIN_AGE: 8,
  // thời gian delay khi chuyển trang
  DELAY_TIME: 750,
  // số lần đăng nhập sai tối đa
  MAX_FAILED_LOGIN_TIMES: 5,
  ROUTES,
  REFRESH_TOKEN: "refresh_token",
  PRODUCT_TYPES,
  // tỉ lệ nén ảnh, và nén png 2MB
  COMPRESSION_RADIO: 0.6,
  COMPRESSION_RADIO_PNG: 2000000,
  // số lượng sản phẩm liên quan tối đa cần lấy
  MAX_RELATED_PRODUCTS: 12,
  // Avatar mặc định của user
  DEFAULT_USER_AVT:
    "https://res.cloudinary.com/tuan-cloudinary/image/upload/c_scale,q_60,w_80/v1607750466/defaults/default-avatar_amkff5.jpg",
  // Số comment sản phẩm trên trang
  COMMENT_PER_PAGE: 5,
  // độ dài tối đa của cmt
  MAX_LEN_COMMENT: 1000,
  // key danh sách giỏ hàng
  CARTS: "carts",
  FILTER_ACCESSORY_LAPTOP,
  FILTER_BRAND_LAPTOP,
  FILTER_CHIP_LAPTOP,
  FILTER_PRICE_LAPTOP,
  FILTER_SIZE_LAPTOP,
  SSSTORAGE_USER,
  CHAT_HOST,
  DEFAULT_ROLE,
  PERMISSION,
  CHAT_PERMISSION,
  ADMIN_ROLE_KEY,
  ORDER_PERMISSION,
  STRIPE_KEY,
  DELIVERY_STATUS,
  CUSTOMER_PERMISSION,
  ADMIN_PERMISSION
};
