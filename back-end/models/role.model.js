const { mysql } = require("../configs/mysql.config");

const RoleModel = {
  createNewRole: async (roleName) => {
    try {
      const result = await mysql.query(
        `INSERT INTO Roles(roleName, createdDate) VALUES('${roleName}', Now())`
      );
      if (result) {
        const lastRole = await mysql.query(
          `SELECT _id FROM Roles ORDER BY _id DESC LIMIT 1 OFFSET 0`
        );
        return { _id: lastRole?.[0]?._id };
      }
      return {};
    } catch (error) {
      return {};
    }
  },

  updateRoleData: async (roleName, roleId) => {
    try{
      const result = await mysql.query(`UPDATE Roles SET roleName='${roleName}' WHERE _id=${Number(roleId)}`)
      return result ? true : false
    }catch (error) {
      return false;
    }
  },

  updateRolePermission: async(roleId, roleFunction, rolePermission) => {
    try{
      const result = await mysql.query(`UPDATE RoleDetail SET rolePermisstion='${rolePermission}' WHERE roleId=${Number(roleId)} AND roleFunction='${roleFunction}'`)
      return result ? true : false
    }catch (error) {
      return false;
    }
  },

  createRolePermisstion: async (roleId, roleFunction, rolePermisstion) => {
    try{
      const result = await mysql.query(`INSERT INTO RoleDetail(roleId, roleFunction, rolePermisstion) VALUES(${Number(roleId)}, '${roleFunction}', '${rolePermisstion}')`)
      return result ? true : false
    }catch (error) {
      return false;
    }
  },

  getRoleList: async() => {
    try{
      const roleList = await mysql.query(`SELECT * FROM Roles`)
      return roleList || []
    }catch (error) {
      return [];
    }
  },

  deleteRoleData: async(roleId) => {
    try{
      await mysql.query(`DELETE FROM RoleDetail WHERE roleId=${Number(roleId)}`)
      await mysql.query(`UPDATE ADMINS SET role=null WHERE role=${Number(roleId)}`);
      await mysql.query(`DELETE FROM roles WHERE _id=${Number(roleId)}`)

      return true;
    }catch (error) {
      return false;
    }
  },

  getRoleById: async(roleId) => {
    try{
      const roleDetail = await mysql.query(`SELECT * FROM RoleDetail WHERE roleId=${Number(roleId)}`)
      return roleDetail || {}
    }catch (error) {
      return {};
    }
  },

  getRoleByAdminId: async(adminId) => {
    try {
      const roleList = await mysql.query(`SELECT rd .* FROM Admins ad JOIN RoleDetail rd ON ad.role=rd.roleId WHERE ad._id=${Number(adminId)}`)
      return roleList || []
    } catch (error) {
      return []
    }
  }
};

module.exports = RoleModel;