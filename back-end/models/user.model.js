const { mysql } = require("../configs/mysql.config");

const UserModel = {
  createNewUser: async ({ accountId, fullName, address, phone }) => {
    try {
      const createRes = await mysql.query(
        `INSERT INTO Users(accountId, fullName, address, phone, createdDate) VALUES(${Number(
          accountId
        )}, '${fullName}', '${address}', '${phone}', Now())`
      );

      return createRes ? true : false;
    } catch (error) {
      return false;
    }
  },

  findUserWithId: async ({ userId }) => {
    try {
      const user = await mysql.query(
        `SELECT ur.*, acc.email FROM Users ur JOIN Accounts acc ON ur.accountId = acc._id WHERE ur._id=${Number(
          userId
        )}`
      );

      return user?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  findUserWithAccountId: async ({ accountId }) => {
    try {
      const user = await mysql.query(
        `SELECT * FROM Users WHERE accountId=${Number(accountId)}`
      );

      return user?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  updateUserData: async ({ _id }, userData) => {
    try {
      const listKey = ["fullName", "address", "gender", "birthday", "phone"];
      let stringUpdate = "";
      for (let key in userData) {
        if (listKey?.includes(key)) {
          if (stringUpdate?.length) {
            stringUpdate =
              stringUpdate +
              `, ${key} = ${
                key === "gender" ? userData[key] : `'${userData[key]}'`
              }`;
          } else {
            stringUpdate = `${key} = '${userData[key]}'`;
          }
        }
      }

      const updateRes = await mysql.query(
        `UPDATE Users SET ${stringUpdate} WHERE _id = ${Number(_id)}`
      );
      return updateRes ? true : false;
    } catch (error) {
      return false;
    }
  },

  getUserList: async (search) => {
    try {
      const user = await mysql.query(
        `SELECT ur.*, ac.email, ac.status FROM Users ur JOIN Accounts ac ON ur.accountId = ac._id WHERE ${
          search && search !== "undefined"
            ? `ur.fullName like '%${search}%'`
            : 'ur.fullName != ""'
        } ORDER BY ur._id DESC`
      );
      return user || [];
    } catch (error) {
      return [];
    }
  },

  deleteUser: async (userId) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM Users WHERE _id=${Number(userId)}`
      );
      return deleteRes ? true : false;
    } catch (error) {
      return false;
    }
  },
};

module.exports = UserModel;
