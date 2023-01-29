const { mysql } = require("../configs/mysql.config");

const VerifyModel = {
  deleteCodeByEmail: async ({ email }) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM Verifycode WHERE email='${email}'`
      );
      return deleteRes ? true : false;
    } catch (error) {
      return false;
    }
  },

  createNewCode: async ({ code, email }) => {
    try {
      const insertRes = await mysql.query(
        `INSERT INTO Verifycode(code, email, dateCreated) VALUES('${code}', '${email}', Now())`
      );
      return insertRes ? true : false;
    } catch (error) {
      return false;
    }
  },

  getCodeByEmail: async({email}) => {
    try{
      const code = await mysql.query(`SELECT * FROM Verifycode WHERE email='${email}'`)
      return code?.[0] || {}
    }catch (error) {
      return {};
    }
  }
};

module.exports = VerifyModel;
