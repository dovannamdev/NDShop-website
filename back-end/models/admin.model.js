const { mysql } = require("../configs/mysql.config");

const AdminModel = {
  findAdminWithUserName: async ({ userName }) => {
    try {
      const result = await mysql.query(
        `SELECT _id, accountId,  userName, fullName, createdDate FROM Admins WHERE userName='${userName}'`
      );
      return result?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  createNewAdminAccount: async (accountId, userName, fullName, role) => {
    try {
      if (Number(role) > 0) {
        const result = await mysql.query(
          `INSERT INTO Admins(accountId, userName, fullName, createdDate, role, adminType) VALUES(${accountId}, '${userName}', '${fullName}', Now(), ${Number(
            role
          )}, 'admin')`
        );
        return result ? true : false;
      } else {
        const result = await mysql.query(
          `INSERT INTO Admins(accountId, userName, fullName, createdDate, adminType) VALUES(${accountId}, '${userName}', '${fullName}', Now(), 'admin')`
        );
        return result ? true : false;
      }
    } catch (error) {
      return false;
    }
  },

  getListAdminAccount: async (allType, role, status) => {
    try {
      const listRoleNotNull = await mysql.query(
        `SELECT ad.*, acc.email, acc.status, r.roleName 
        FROM Admins ad JOIN Accounts acc ON ad.accountId = acc._id 
        JOIN Roles r ON ad.role = r._id  
        WHERE ad.role > 0 AND ${
          allType === "true" || allType === true
            ? `ad.adminType is not null`
            : `ad.adminType = 'admin'`
        } 
        ${role ? ` AND r.roleName='${role}'` : ""} ${
          status && status !== "undefined" ? ` AND acc.status = ${status}` : ` `
        }`
      );

      const listRoleIsNull = await mysql.query(
        `SELECT ad.*, acc.email 
        FROM Admins ad JOIN Accounts acc ON ad.accountId = acc._id 
        JOIN Roles r ON ad.role = r._id 
        WHERE ad.role is null AND ${
          allType === "true" || allType === true
            ? `ad.adminType is not null`
            : `ad.adminType = 'admin'`
        } 
        ${role ? ` AND r.roleName='${role}'` : ""}`
      );

      const listRole = listRoleNotNull?.concat(listRoleIsNull);
      const roleComplete = [...listRole]?.map((item) => {
        if (item?.roleName) return item;
        return {
          ...item,
          roleName: "",
        };
      });
      return roleComplete || [];
    } catch (error) {
      console.log("error >> ", error);
      return [];
    }
  },

  deleteAdminData: async (adminId) => {
    try {
      const result = await mysql.query(
        `DELETE FROM Admins WHERE _id=${Number(adminId)}`
      );
      return result ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateAdminData: async (userName, fullName, role, adminId) => {
    try {
      if (Number(role) > 0) {
        const updateRes = await mysql.query(
          `UPDATE Admins SET ${
            userName?.length ? `userName='${userName}',` : ""
          } fullName='${fullName}', role=${Number(role)} WHERE _id=${adminId}`
        );
        return updateRes ? true : false;
      } else {
        const updateRes = await mysql.query(
          `UPDATE Admins SET ${
            userName?.length ? `userName='${userName}',` : ""
          } fullName='${fullName}' WHERE _id=${adminId}`
        );
        return updateRes ? true : false;
      }
    } catch (error) {
      return false;
    }
  },
};

module.exports = AdminModel;
