const chatApi = require("express").Router();
const chatController = require("../controllers/chat.controller");

chatApi.get('/user', chatController.getAllUserHaveChat);
chatApi.get('/user/:userId', chatController.getChatByUserId);
chatApi.post('/user/:userId', chatController.createUserChat);
chatApi.post('/user/reply/:userId', chatController.createUserChatReply);
module.exports = chatApi;
