const roleApi = require("express").Router();
const roleController = require("../controllers/role.controller");

roleApi.post('/create', roleController.createRole);
roleApi.get('/list', roleController.getRoleList);
roleApi.delete('/:roleId/delete', roleController.deleteRoleData);
roleApi.put('/:roleId/update', roleController.updateRoleDate);
roleApi.get('/:roleId', roleController.getRoleDetail);
roleApi.get('/admin/:adminId', roleController.getRoleByAdminId);

module.exports = roleApi;
