const express = require('express');
const accountApi = express.Router();
const accountController = require('../controllers/account.controller');

accountApi.post('/signup', accountController.postSignUp);
accountApi.post('/verify/forgot', accountController.portSendCodeForgotPW);
accountApi.post('/reset-pw', accountController.postResetPassword);
accountApi.post('/login', accountController.postLogin);
accountApi.put('/:accountId/status', accountController.changeAccountStatus);

module.exports = accountApi;