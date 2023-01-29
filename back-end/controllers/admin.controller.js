const AdminModel = require("../models/admin.model");
const ProductDescModel = require("../models/description.model");
const ProductModel = require("../models/product.model");
const cloudinary = require("../configs/cloudinary.config");
const UserModel = require("../models/user.model");
const AccountModel = require("../models/account.model");
const OrderModel = require("../models/order.model");
const DetailProductModel = require("../models/detailProduct.model");
const bcrypt = require("bcrypt");
const BrandModel = require("../models/brand.model");
const OrderDetailModel = require("../models/orderDetail.model");
const RoleModel = require("../models/role.model");
const CatalogModel = require("../models/productCatalog.model");

const uploadProductAvt = async (avtFile, productCode) => {
  try {
    const result = await cloudinary.uploader.upload(avtFile, {
      folder: `products/${productCode}`,
    });
    return result.secure_url;
  } catch (error) {
    throw error;
  }
};

const uploadProductCatalogs = async (catalogs, productCode) => {
  try {
    const urlCatalogs = [];
    for (let item of catalogs) {
      const result = await cloudinary.uploader.upload(item, {
        folder: `products/${productCode}`,
      });
      urlCatalogs.push(result.secure_url);
    }
    return urlCatalogs;
  } catch (error) {
    throw error;
  }
};

const uploadDescProductPhoto = async (desc, productCode) => {
  try {
    let result = [];
    for (let item of desc) {
      const { content, photo } = item;
      const resUpload = await cloudinary.uploader.upload(photo, {
        folder: `products/${productCode}/desc`,
      });
      result.push({ content, photo: resUpload.secure_url });
    }
    return result;
  } catch (error) {}
};

const addProduct = async (req, res) => {
  try {
    const { product, details, desc } = req.body;
    const { type, avatar, code, discount, price, stock, ...productRest } =
      product;
    const { warranty, catalogs, ...detailRest } = details;

    // kiểm tra sản phẩm đã tồn tại hay chưa
    const isExist = await ProductModel.findProductWithCode(code);
    if (isExist?.code) {
      return res.status(400).json({ message: "Mã sản phẩm đã tồn tại!" });
    }
    // upload product avatar to cloudinary
    const avtUrl = await uploadProductAvt(avatar, code);

    // upload ảnh khác của sản phẩm
    const urlCatalogs = await uploadProductCatalogs(catalogs, code);
    // upload ảnh bài viết mô tả
    const productDesc = desc
      ? await uploadDescProductPhoto(desc.detailDesList, code)
      : null;
    const newProduct = await ProductModel.createNewProduct(
      {
        code,
        discount,
        price,
        avt: avtUrl,
        ...productRest,
      },
      details,
      desc?.title
    );

    if (newProduct) {
      await ProductDescModel.createProductDesc(productDesc, code);
      await CatalogModel.createProductCatalog(urlCatalogs, code);
      return res.json({ success: true });
    }
    return res.status(400).json({ message: "Thêm sản phẩm thất bại" });
  } catch (error) {
    return res.status(400).json({ message: "Lỗi đường truyền, hãy thử lại" });
  }
};

const postLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const adminUser = await AdminModel.findAdminWithUserName({ userName });
    if (!adminUser?.userName) {
      return res.status(406).json({ message: "Tài khoản không tồn tại!" });
    }

    const adminAccount = await AccountModel.findAccountWithId(
      adminUser?.accountId
    );

    if (!adminAccount?.status) {
      return res.status(406).json({
        message:
          "Tài khoản bị khoá, vui lòng liên hệ quản trị viên để biết thêm thông tin!",
      });
    }

    if (!adminAccount?._id) {
      return res.status(406).json({ message: "Tài khoản không tồn tại!" });
    }
    const isMath = await bcrypt.compare(password, adminAccount?.password);
    if (!isMath) {
      return res.status(401).json({ message: "Mật khẩu không đúng !" });
    } else {
      return res
        .status(200)
        .json({ name: adminUser.fullName, _id: adminUser?._id });
    }
  } catch (error) {
    return res.status(400).json({ message: "failed" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = req.body;
    const result = await ProductModel.updateProduct(product);
    if (result) {
      return res.json({ success: true });
    }
    return res.status(409).json({ message: "failed" });
  } catch (error) {
    console.error(error);
    return res.status(409).json({ message: "failed" });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { code } = req.query;
    const response = await ProductModel.getProductByCode(code);
    if (response?.code) {
      const productOrder = await OrderDetailModel.checkProductHaveOrder(code);

      if (productOrder) {
        return res
          .status(400)
          .json({ message: "Sản phẩm đang có đơn hàng, không thể xoá" });
      }

      await ProductDescModel.deleteProductDesc(code);
      await CatalogModel.deleteProductCatalog(code);
      await ProductModel.deleteProductByCode(code);
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ message: "Xoá sản phẩm thất bại" });
  } catch (error) {
    return res.status(409).json({ message: "Xoá sản phẩm thất bại" });
  }
};

const getCustomerList = async (req, res) => {
  try {
    const list = await UserModel.getUserList();
    return res.status(200).json({ list });
  } catch (error) {
    return res.status(401).json({ list: [] });
  }
};

const delCustomer = async (req, res) => {
  try {
    const { userId } = req.query;
    const customer = await UserModel.findUserWithId({ userId });
    if (customer?._id) {
      const deleteUserRes = await UserModel.deleteUser(userId);
      const deleteAccountRes = await AccountModel.deleteAccount(
        customer?.accountId
      );
      if (deleteUserRes && deleteAccountRes) {
        return res.json({});
      }
    }

    return res.status(400).json({ message: "Xoá tài khoản thất bại" });
  } catch (error) {
    return res.status(400).json({ message: "Xoá tài khoản thất bại" });
  }
};

const getOrderList = async (req, res) => {
  try {
    const { orderType } = req?.query;
    const orderList = await OrderModel.getOrderList(orderType);
    const orderFullData = [];

    for (let i = 0; i < orderList?.length; i++) {
      const orderProduct = await OrderDetailModel.getProductByOrderId(
        orderList?.[i]?._id
      );

      const order = {
        ...orderList?.[i],
        deliveryAdd: {
          name: orderList?.[i]?.name,
          phone: orderList?.[i]?.clientPhone,
          address: orderList?.[i]?.clientAddress,
        },
        orderProd: [...orderProduct],
      };
      orderFullData?.push(order);
    }

    res.status(200).json({ list: orderFullData });
  } catch (error) {
    res.status(200).json({});
  }
};

const postUpdateOrderStatus = async (req, res) => {
  try {
    const { id, orderStatus } = req.body;
    const response = await OrderModel.updateOrderStatus(id, orderStatus);
    if (response) return res.status(200).json({});
  } catch (error) {
    return res.status(401).json({});
  }
};

const updateBrand = async (req, res) => {
  try {
    const brand = req.body;
    const { _id, brandName } = brand;
    const findBrand = await BrandModel.findBrandWithName(brandName);
    if (!findBrand?.brandName) {
      const response = await BrandModel.updateBrand(_id, brandName);
      if (response) return res.status(200).json({});
    } else {
      return res.status(400).json({ message: "Tên thương hiệu đã tồn tại" });
    }

    return res.status(400).json({});
  } catch (error) {
    return res.status(400).json({});
  }
};

const createBrand = async (req, res) => {
  try {
    const brand = req.body;
    const { brandName } = brand;
    const findBrand = await BrandModel.findBrandWithName(brandName);
    if (!findBrand?.brandName) {
      const response = await BrandModel.createBrand(brandName);
      if (response) return res.status(200).json({});
    } else {
      return res.status(400).json({ message: "Tên thương hiệu đã tồn tại" });
    }

    return res.status(400).json({});
  } catch (error) {
    return res.status(400).json({});
  }
};

const removeBrand = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await BrandModel.removeBrand(id);
    if (response) return res.status(200).json({});
    return res.status(400).json({});
  } catch (error) {
    return res.status(400).json({});
  }
};

const createNewAccount = async (req, res) => {
  try {
    const accountData = req?.body;

    const { email, fullName, role, userName, password } = accountData;

    const findAccountEmail = await AccountModel.findAccountWithEmail({ email });
    if (findAccountEmail?._id) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const findAccountUserName = await AdminModel.findAdminWithUserName({
      userName,
    });
    if (findAccountUserName?._id) {
      return res.status(400).json({ message: "Tên đăng nhập đã được sử dụng" });
    }

    const newAcc = await AccountModel.createNewAccount({
      email,
      password,
    });

    if (newAcc?.account_id) {
      const createAdminResult = await AdminModel.createNewAdminAccount(
        newAcc?.account_id,
        userName,
        fullName,
        role
      );
      if (createAdminResult) {
        return res.json({ success: true });
      }
    }

    return res.status(400).json({ message: "Tạo mới tài khoản thất bại" });
  } catch (error) {
    return res.status(400).json({ message: "Tạo mới tài khoản thất bại" });
  }
};

const getListAdminAccount = async (req, res) => {
  try {
    const { allType, role, status } = req?.query;
    const listAccount = await AdminModel.getListAdminAccount(allType, role, status);
    return res.json({ success: true, payload: listAccount });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Lấy danh sách tài khoản nhân viên thất bại" });
  }
};

const deleteAdminAccount = async (req, res) => {
  try {
    const { adminId } = req?.params;
    const { accountId } = req?.query;
    const deleteAdminresult = await AdminModel.deleteAdminData(adminId);

    if (deleteAdminresult) {
      const deleteAccount = await AccountModel.deleteAccount(accountId);
      if (deleteAccount) {
        return res.json({ success: true });
      }
    }
    return res.status(400).json({ message: "Xoá tài khoản thất bại" });
  } catch (error) {
    return res.status(400).json({ message: "Xoá tài khoản thất bại" });
  }
};

const updateAdminData = async (req, res) => {
  try {
    const { adminId } = req?.params;
    const adminData = req?.body;
    const { email, fullName, role, userName, accountId } = adminData;

    const findAccountEmail = await AccountModel.findAccountWithEmail({ email });
    if (email?.length && findAccountEmail?._id) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const findAccountUserName = await AdminModel.findAdminWithUserName({
      userName,
    });
    if (userName?.length && findAccountUserName?._id) {
      return res.status(400).json({ message: "Tên đăng nhập đã được sử dụng" });
    }

    if (email?.length) {
      await AccountModel.updateAccountEmail(email, accountId);
    }

    await AdminModel.updateAdminData(userName, fullName, role, adminId);
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ message: "Cập nhật tài khoản thất bại" });
  }
};

module.exports = {
  postLogin,
  updateProduct,
  removeProduct,
  addProduct,
  getCustomerList,
  delCustomer,
  getOrderList,
  postUpdateOrderStatus,
  updateBrand,
  createBrand,
  removeBrand,
  createNewAccount,
  getListAdminAccount,
  deleteAdminAccount,
  updateAdminData,
};
