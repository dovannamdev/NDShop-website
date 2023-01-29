const { mysql } = require("../configs/mysql.config");
const bcrypt = require("bcrypt");

const AccountModel = {
  findAccountWithEmail: async ({ email }) => {
    try {
      const account = await mysql.query(
        `SELECT * FROM Accounts WHERE email='${email}'`
      );
      return account?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  findAccountWithId: async (accountId) => {
    try {
      const account = await mysql.query(
        `SELECT * FROM Accounts WHERE _id=${Number(accountId)}`
      );
      return account?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  createNewAccount: async ({ email, password }) => {
    try {
      const saltRounds = parseInt(process.env.SALT_ROUND);
      const hashPassword = await bcrypt.hash(password, saltRounds);
      const createRes = await mysql.query(
        `INSERT INTO Accounts(email, password, status) VALUES('${email}', '${hashPassword}', true)`
      );
      if (createRes) {
        const lastAccount = await mysql.query(
          `SELECT _id FROM Accounts ORDER BY _id DESC LIMIT 1 OFFSET 0`
        );
        return { account_id: lastAccount?.[0]?._id };
      }
      return {};
    } catch (error) {
      return {};
    }
  },

  updateAccountPassword: async ({ email, password }) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE Accounts SET password='${password}' WHERE email = '${email}'`
      );
      return updateRes ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateAccountEmail: async (email, accountId) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE Accounts SET email='${email}' WHERE _id = ${Number(accountId)}`
      );
      return updateRes ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteAccount: async (accountId) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM Accounts WHERE _id=${Number(accountId)}`
      );
      return deleteRes ? true : false;
    } catch (error) {
      return false;
    }
  },

  changeAccountStatus: async (accountId, status) => {
    try {
      const result = await mysql.query(
        `UPDATE Accounts SET status=${status} WHERE _id=${Number(accountId)}`
      );
      return result ? true : false;
    } catch (error) {
      return false;
    }
  },
};

module.exports = AccountModel;
