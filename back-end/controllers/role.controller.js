const RoleModel = require("../models/role.model");

const createRole = async (req, res) => {
  try {
    const roleData = req?.body;
    const roleList = roleData?.role;
    const addRole = await RoleModel.createNewRole(roleData?.roleName);
    if (addRole?._id) {
      for (let rl of roleList) {
        const addPermisstion = await RoleModel.createRolePermisstion(
          addRole?._id,
          rl?.role,
          rl?.pemission?.join()
        );
      }
      return res.json({ message: "success" });
    }
    return res.status(400).json({ message: "Tạo quyền thất bại!" });
  } catch (error) {
    return res.status(400).json({ message: "Tạo quyền thất bại!" });
  }
};

const updateRoleDate = async (req, res) => {
  try {
    const { roleId } = req?.params;
    const roleData = req?.body;
    const roleList = roleData?.role;
    const roleName = roleData?.roleName;
    const updateRole = await RoleModel.updateRoleData(roleName, roleId);

    if (updateRole) {
      for (let rl of roleList) {
        await RoleModel.updateRolePermission(
          roleId,
          rl?.role,
          rl?.pemission?.join()
        );
      }
      return res.json({ message: "success" });
    }

    return res.status(400).json({ message: "Cập nhật quyền thất bại!" });
  } catch (error) {
    return res.status(400).json({ message: "Cập nhật quyền thất bại!" });
  }
};

const getRoleList = async (req, res) => {
  try {
    const roleList = await RoleModel.getRoleList();
    return res.json({ success: true, payload: roleList });
  } catch (error) {
    return res.status(400).json({ message: "Lấy danh sách quyền thất bại" });
  }
};

const deleteRoleData = async (req, res) => {
  try {
    const { roleId } = req?.params;
    const deleteRes = await RoleModel.deleteRoleData(roleId);
    if (deleteRes) {
      return res.json({ success: true });
    }
    return res.status(400).json({ message: "Xoá quyền thất bại" });
  } catch (error) {
    return res.status(400).json({ message: "Xoá quyền thất bại" });
  }
};

const getRoleDetail = async (req, res) => {
  try {
    const { roleId } = req?.params;
    const roleDatail = await RoleModel.getRoleById(roleId);
    return res.json({ success: true, payload: roleDatail });
  } catch (error) {
    return res.status(400).json({ message: "Lấy chi tiết quyền thất bại" });
  }
};

const getRoleByAdminId = async (req, res) => {
  try {
    const { adminId } = req?.params;
    const roleList = await RoleModel.getRoleByAdminId(adminId);
    return res.json({ success: true, payload: roleList });
  } catch (error) {
    return res.status(400).json({ message: "Lấy quyền của nhân viên thất bại" });
  }
};

module.exports = {
  createRole,
  getRoleList,
  deleteRoleData,
  getRoleDetail,
  updateRoleDate,
  getRoleByAdminId,
};
