const adminApi = require("express").Router();
const adminController = require("../controllers/admin.controller");

adminApi.post("/login", adminController.postLogin);
adminApi.put("/products/update", adminController.updateProduct);
adminApi.delete("/products/remove", adminController.removeProduct);
adminApi.post("/products/add", adminController.addProduct);
adminApi.put("/brands/update", adminController.updateBrand);
adminApi.delete("/brands/remove", adminController.removeBrand);
adminApi.post("/brands/add", adminController.createBrand);
adminApi.get("/customer", adminController.getCustomerList);
adminApi.delete("/customer/del", adminController.delCustomer);
adminApi.get("/order", adminController.getOrderList);
adminApi.post("/order", adminController.postUpdateOrderStatus);
adminApi.post("/create", adminController.createNewAccount);
adminApi.get("/list", adminController.getListAdminAccount);
adminApi.delete("/:adminId/delete", adminController.deleteAdminAccount);
adminApi.put("/:adminId/update", adminController.updateAdminData);

module.exports = adminApi;
