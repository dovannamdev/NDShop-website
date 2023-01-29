const commentApi = require("express").Router();
const commentController = require("../controllers/comment.controller");

commentApi.post('/', commentController.createProductComment);
commentApi.get('/list', commentController.getListProductComment);
commentApi.post('/children', commentController.createChildrenComment);
commentApi.delete('/', commentController.deleteProductComment);
commentApi.delete('/children', commentController.deleteChildrenComment);
commentApi.put('/status', commentController.changeProductCommentStatus);
commentApi.put('/children/status', commentController.changeCommentChildrenStatus);
module.exports = commentApi;