const AccountModel = require("../models/account.model");
const UserModel = require("../models/user.model");
const helper = require("../helpers");
const constants = require("../constants");
const mailConfig = require("../configs/mail.config");
const VerifyModel = require("../models/verify.model");
const bcrypt = require("bcrypt");

const postSignUp = async (req, res) => {
  try {
    const { email, password, fullName, phone, address } = req.body.account;
    //Kiểm tra tài khoản đã tồn tại hay chưa
    const account = await AccountModel.findAccountWithEmail({ email });
    if (account?._id) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }
    // Tạo tài khoản
    const newAcc = await AccountModel.createNewAccount({
      email,
      password,
    });

    if (newAcc?.account_id) {
      const createRes = await UserModel.createNewUser({
        accountId: newAcc?.account_id,
        fullName,
        address,
        phone,
      });
      if (createRes) {
        return res.status(200).json({ message: "success" });
      }
    }

    return res.status(400).json({
      message: "Account Create Failed.",
      error: error,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Account Create Failed.",
      error: error,
    });
  }
};

const portSendCodeForgotPW = async (req, res) => {
  try {
    const { email } = req.body;
    const account = await AccountModel.findAccountWithEmail({ email });
    if (!account?._id)
      return res.status(406).json({ message: "Tài khoản không tồn tại" });

    const verifyCode = helper.generateVerifyCode(constants.NUMBER_VERIFY_CODE);
    const mail = {
      to: email,
      subject: "Thay đổi mật khẩu",
      html: mailConfig.htmlResetPassword(verifyCode),
    };

    await VerifyModel.deleteCodeByEmail({ email });
    await VerifyModel.createNewCode({
      code: verifyCode,
      email,
    });

    const result = await mailConfig.sendEmail(mail);

    if (result) {
      return res.status(200).json({ message: "success" });
    }
  } catch (error) {
    return res.status(409).json({
      message: "Gửi mã thấy bại",
      error,
    });
  }
};

const postResetPassword = async (req, res) => {
  try {
    const { email, password, verifyCode } = req.body.account;
    const isVerify = await helper.isVerifyEmail(email, verifyCode);

    if (!isVerify) {
      return res
        .status(401)
        .json({ message: "Mã xác nhận không hợp lệ hoặc đã hết hạn." });
    }

    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUND)
    );

    const response = await AccountModel.updateAccountPassword({
      email,
      password: hashPassword,
    });

    if (response) {
      //xoá mã xác nhận
      await VerifyModel.deleteCodeByEmail({ email });
      return res.status(200).json({ message: "Thay đổi mật khẩu thành công" });
    } else {
      return res.status(409).json({ message: "Thay đổi mật khẩu thất bại" });
    }
  } catch (error) {
    return res.status(409).json({ message: "Thay đổi mật khẩu thất bại" });
  }
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body.account;
    // kiểm tra tài khoản có tồn tại không?
    const account = await AccountModel.findAccountWithEmail({ email });
    if (!account?._id) {
      return res.status(406).json({ message: "Tài khoản không tồn tại!" });
    }

    if (!account?.status) {
      return res.status(406).json({
        message:
          "Tài khoản bị khoá, vui lòng liên hệ quản trị viên để biết thêm thông tin!",
      });
    }

    //kiểm tra password
    const isMath = await bcrypt.compare(password, account.password);

    if (!isMath) {
      return res.status(401).json({ message: "Mật khẩu không đúng !" });
    } else {
      const user = await UserModel.findUserWithAccountId({
        accountId: account._id,
      });
      return res.status(200).json({ message: "success", user });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Đăng nhập thất bại. Thử lại", error });
  }
};

const changeAccountStatus = async (req, res) => {
  try {
    const { accountId } = req?.params;
    const { status } = req?.body;

    const result = await AccountModel.changeAccountStatus(accountId, status);
    return res.json({ success: result });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Thay đổi trạng thái thất bại", error });
    rn;
  }
};

module.exports = {
  postSignUp,
  portSendCodeForgotPW,
  postResetPassword,
  postLogin,
  changeAccountStatus,
};
