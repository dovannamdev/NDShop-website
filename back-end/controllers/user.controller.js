const UserModel = require("../models/user.model");

const putUpdateUser = async (req, res) => {
  try {
    const { userId, value } = req.body;
    const user = await UserModel.findUserWithId({
      userId: userId,
    });

    if (user?._id) {
      const response = await UserModel.updateUserData(
        { _id: userId },
        { ...value }
      );
      if (response) {
        return res.status(200).json({ message: "success" });
      }
    } else {
      return res.status(409).json({ message: "Tài khoản không tồn tại" });
    }
  } catch (err) {
    return res.status(409).json({ message: "Cập nhật thất bại" });
  }
};

const getUserWithId = async (req, res) => {
  try {
    const { userId } = req?.params;
    const userInfo = await UserModel.findUserWithId({ userId });
    if (!userInfo?._id) {
      return res.status(400).json({ message: "Lấy thông tin thất bại" });
    }
    return res.status(200).json({ user: userInfo });
  } catch (err) {
    return res.status(400).json({ message: "Cập nhật thất bại" });
  }
};

const getUserList = async (req, res) => {
  try {
    const { search } = req?.query;
    const user = await UserModel.getUserList(search);
    return res.status(200).json({ user: user });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Lấy danh sách người dùng thất bại" });
  }
};

module.exports = {
  putUpdateUser,
  getUserWithId,
  getUserList,
};
