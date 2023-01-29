const express = require("express");
const userApi = express.Router();
const userController = require("../controllers/user.controller");

userApi.put("/update", userController.putUpdateUser);
userApi.get("/info/:userId", userController.getUserWithId);
userApi.get('/list', userController.getUserList);
module.exports = userApi;
