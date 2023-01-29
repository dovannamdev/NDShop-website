const VerifyModel = require("../models/verify.model");
const constants = require("../constants");

const isVerifyEmail = async (email, verifyCode) => {
  // try{
  const res = await VerifyModel.getCodeByEmail({ email });
  if (!res?.email) return false;
  const { code, dateCreated } = res;
  if (code !== verifyCode) return false;
  const now = Date.now();
  // kiểm tra mã còn hiệu lực hay không
  if (now - dateCreated > constants.VERIFY_CODE_TIME_MILLISECONDS) return false;
  return true;
  // }catch(error){
  //     return false;
  // }
};

const generateVerifyCode = (numberOfDigits) => {
  const n = parseInt(numberOfDigits);
  const number = Math.floor(Math.random() * Math.pow(10, n)) + 1;
  let numberStr = number.toString();
  for (let i = 0; i < 6 - numberStr.length; i++) {
    numberStr = "0" + numberStr;
  }
  return numberStr;
};

// fn: xác định loại sản phẩm thông qua string
const typeOfProduct = (str = "") => {
  if (str === undefined || str === "") return [];
  let typeList = [];
  const strLow = str.toLowerCase();
  const list = constants.PRODUCT_TYPES_VN;
  for (let i = 0; i < list.length; ++i) {
    if (strLow.includes(list[i].label.toLowerCase()))
      typeList.push(list[i].type);
  }
  return typeList;
};

const calTotalMoney = (order) => {
  const orderProduct = order?.orderProd;
  const totalMoney = orderProduct?.reduce((previous, current) => {
    const { price, discount } = current;
    const numOfProd = current?.numOfProd;
    const money =
      (price - price * (Number(discount) / 100)) * Number(numOfProd);
    return previous + money;
  }, 0);
  return totalMoney;
};

module.exports = {
  isVerifyEmail,
  generateVerifyCode,
  typeOfProduct,
  calTotalMoney
};
