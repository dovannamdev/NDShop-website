import constants from "../constants";
import moment from "moment";

const autoSearchOptions = () => {
  let result = [];
  // laptop
  result.push({ value: "Laptop" });

  constants.FILTER_BRAND_LAPTOP.map((item: any) => {
    result.push({ value: ` ${item.title}` });
  });
  constants.FILTER_CHIP_LAPTOP.map((item: any) => {
    result.push({ value: ` ${item.title}` });
  });
  constants.FILTER_SIZE_LAPTOP.map((item: any) => {
    result.push({ value: ` ${item.title}` });
  });
  return result;
};

// fn: hàm rút gọn tên sản phẩm
const reduceProductName = (name: string, length = 64) => {
  let result = name;
  if (name && name.length >= length) {
    result = name.slice(0, length) + " ...";
  }
  return result;
};

// fn: hàm format giá sản phẩm
const formatProductPrice = (price: any) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatOrderDate = (date = Date.now(), flag = 0) => {
  const newDate = new Date(date);
  const d = newDate.getDate(),
    m = newDate.getMonth() + 1,
    y = newDate.getFullYear();
  return flag === 0
    ? `${d}/${m}/${y}`
    : `${newDate.getHours()}:${newDate.getMinutes()} ${d}/${m}/${y}`;
};

const formatQueryString = (str = "") => {
  let result = str;
  // xoá tất cả ký tự đặc biệt
  result = str.replace(/[`~!@#$%^&*()_|+\-=?;:<>\{\}\[\]\\\/]/gi, "");
  // thay khoảng trắng thành dấu cộng
  result = result.replace(/[\s]/gi, "+");
  return result;
};

const convertProductKey = (key: any) => {
  switch (key) {
    case "brand":
      return "Thương hiệu";
    case "aperture":
      return "Khẩu độ";
    case "focalLength":
      return "Tiêu cự";
    case "sensor":
      return "Cảm biến";
    case "numberOfPixel":
      return "Số điểm ảnh";
    case "resolution":
      return "Độ phân giải";
    case "warranty":
      return "Bảo hành";
    case "connectionStd":
      return "Chuẩn kết nối";
    case "frameSpeed":
      return "Tốc độ khung hình";
    case "capacity":
      return "Dung lượng";
    case "size":
      return "Kích thước";
    case "type":
      return "Loại";
    case "readSpeed":
      return "Tốc độ đọc";
    case "writeSpeed":
      return "Tốc độ ghi";
    case "rpm":
      return "Tốc độ vòng quay";
    case "manufacturer":
      return "Nhà sản xuất";
    case "chipBrand":
      return "Nhãn hiệu chip";
    case "processorCount":
      return "Số lượng cpu";
    case "series":
      return "Series";
    case "detail":
      return "Chi tiết khác";
    case "displaySize":
      return "Kích thước màn hình";
    case "display":
      return "Card màn hình";
    case "operating":
      return "Hệ điều hành";
    case "disk":
      return "Ổ cứng";
    case "ram":
      return "RAM (GB)";
    case "rom":
      return "Bộ nhớ trong (GB)";
    case "pin":
      return "Dung lượng pin";
    case "weight":
      return "Khối lượng";
    case "chipset":
      return "Chip set";
    case "socketType":
      return "Loại socket";
    case "bus":
      return "Loại bus";
    case "numberOfPort":
      return "Số lượng cổng";
    case "color":
      return "Màu sắc";
    case "cpu":
      return "Cpu";
    case "before":
      return "Camera trước";
    case "after":
      return "Camera sau";
    case "voltage":
      return "Loại sạc";
    case "ledColor":
      return "Màu led";
    case "frequency":
      return "Tần số quét";
    case "port":
      return "Cổng";
    case "bgPlate":
      return "Tấm nền";
    case "isLed":
      return "Loại led";
    case "bandwidth":
      return "Băng thông";
    case "strong":
      return "Độ mạnh ăng-ten";
    case "connectionPort":
      return "Cổng kết nối";
    case "wattage":
      return "Công suất";
    default:
      return "Chi tiết khác";
  }
};

const convertProductType = (type = 0) => {
  switch (type) {
    case 0:
      return "Laptop";
    case 1:
      return "Ổ cứng";
    case 2:
      return "Card màn hình";
    case 3:
      return "Mainboard";
    case 4:
      return "RAM";
    case 5:
      return "Điện thoại";
    case 6:
      return "Sạc dự phòng";
    case 7:
      return "Tai nghe";
    case 8:
      return "Bàn phím";
    case 9:
      return "Màn hình";
    case 10:
      return "Chuột";
    case 11:
      return "Router Wifi";
    case 12:
      return "Loa";
    case 13:
      return "Camera";
    case 14:
      return "Webcam";
    default:
      return "Khác";
  }
};

const calTotalOrderFee = (order: any) => {
  const { transportFee, orderProd, numOfProd } = order;
  const total =
    transportFee +
    (orderProd.price * numOfProd -
      (orderProd.price * numOfProd * orderProd.discount) / 100);
  return total;
};

const convertOrderStatus = (orderStatus = 0) => {
  switch (orderStatus) {
    case 0:
      return "Đặt hàng thành công";
    case 1:
      return "Duyệt đơn hàng";
    case 2:
      return "Giao hàng thành công";
    case 3:
      return "Xác nhận hoàn về";
    case 4:
      return "Huỷ đơn hàng";
    case 5:
      return "Chờ duỵệt huỷ";
    case 6:
      return "Đã phê duỵệt huỷ";
    default:
      return "Đặt hàng thành công";
  }
};

const queryString = (query = "") => {
  if (!query || query === "") return [];
  let result = [];
  let q = query;
  // xoá ký tự '?' nếu có
  if (q[0] === "?") q = q.slice(1, q.length);
  // tách các cụm query ['t=0', 'key=1']
  const queryList = q.split("&");
  result = queryList.map((str) => {
    let res: any = {};
    let temp: any = str.split("=");
    if (temp.length <= 1) res[temp[0]] = "";
    else res[temp[0]] = temp[1];
    return res;
  });

  return result;
};

const dateTimeConverter = (dateTime: any) => {
  if (dateTime) {
    return moment(dateTime).format("DD-MM-YYYY");
  }
  return "";
};

const parseJSON = (inputString: any, fallback: any) => {
  if (inputString) {
    try {
      return JSON.parse(inputString);
    } catch (e) {
      return fallback;
    }
  }
};

const formatInputDate = (date: any) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const calTotalMoney = (order: any) => {
  const orderProduct = order?.orderProd;
  const totalMoney = orderProduct?.reduce((previous: number, current: any) => {
    const { price, discount } = current;
    const numOfProd = current?.numOfProd;
    const money =
      (price - price * (Number(discount) / 100)) * Number(numOfProd);
    return previous + money;
  }, 0);
  return totalMoney;
};

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const getFunctionRole = (roleFunction: string) => {
  const adminRole = localStorage.getItem(constants.ADMIN_ROLE_KEY);
  const parseRole = adminRole ? JSON.parse(adminRole) : [];
  const roleFilter = parseRole?.find(
    (item: any) => item?.roleFunction === roleFunction
  );
  return roleFilter?.rolePermisstion || "";
};

export default {
  autoSearchOptions,
  reduceProductName,
  formatProductPrice,
  convertProductKey,
  formatOrderDate,
  calTotalOrderFee,
  convertOrderStatus,
  queryString,
  formatQueryString,
  convertProductType,
  dateTimeConverter,
  parseJSON,
  formatInputDate,
  calTotalMoney,
  validateEmail,
  getFunctionRole,
};
