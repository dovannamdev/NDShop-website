const CommentModel = require("../models/comment.model");

const createProductComment = async (req, res) => {
  try {
    const { owner, star, comment, productCode } = req?.body;
    const response = await CommentModel.createProductComment(
      owner,
      star,
      comment,
      productCode
    );
    if (response) return res.send({ message: "Tạp bình luận thành công" });
    res.status(400).json({ message: "Tạo bình luận thất bại" });
  } catch (error) {
    res.status(400).json({ message: "Tạo bình luận thất bại" });
  }
};

const getListProductComment = async (req, res) => {
  try {
    const { productCode, limit, offset, status } = req.query;
    const comment = await CommentModel.getProductComment(
      productCode,
      limit,
      offset, 
      status
    );
    if (comment) {
      const commentFullData = [];
      for (let i = 0; i < comment?.length; i++) {
        const commentChildren = await CommentModel.getCommentChildren(
          comment?.[i]?._id, status
        );
        commentFullData?.push({
          ...comment?.[i],
          children: [...commentChildren],
        });
      }
      const totalComment = await CommentModel.countProductComment(productCode);
      return res
        .status(200)
        .json({ comment: commentFullData, total: totalComment });
    }
    res.status(400).json({ message: "Không thể lấy dữ liệu" });
  } catch (error) {
    res.status(400).json({ message: "Không thể lấy dữ liệu" });
  }
};

const createChildrenComment = async (req, res) => {
  try {
    const { commentId, owner, review, ownerType, adminOwner } = req?.body;
    const response = await CommentModel.createCommentChildren(
      commentId,
      owner,
      review,
      ownerType,
      adminOwner
    );
    if (response) return res.send({ message: "Tạp phản hồi thành công" });
    res.status(400).json({ message: "Tạo phản hồi thất bại" });
  } catch (error) {
    res.status(400).json({ message: "Tạo phản hồi thất bại" });
  }
};

const deleteProductComment = async (req, res) => {
  try {
    const { commentId } = req.query;
    const deleteRes = await CommentModel.deleteChildrenByCommentId(commentId);
    if (deleteRes) {
      const response = await CommentModel.deleteProductComment(commentId);
      if (response) return res.send({ message: "Xoá bình luận thành công" });
    }
    res.status(400).json({ message: "Xoá bình luận thất bại" });
  } catch (error) {
    res.status(400).json({ message: "Xoá bình luận thất bại" });
  }
};

const deleteChildrenComment = async (req, res) => {
  try {
    const { childrenId } = req.query;
    const response = await CommentModel.deleteChildrenComment(childrenId);
    if (response) return res.send({ message: "Xoá phản hồi thành công" });
    res.status(400).json({ message: "Xoá phản hồi thất bại" });
  } catch (error) {
    res.status(400).json({ message: "Xoá phản hồi thất bại" });
  }
};

const changeProductCommentStatus = async (req, res) => {
  try {
    const { commentId, status } = req.body;
    const response = await CommentModel.changeProductCommentstatus(
      commentId,
      status
    );
    if (response) return res.send({ message: "Đổi trạng thái thành công" });
    res.status(400).json({ message: "Đổi trạng thái thất bại" });
  } catch (error) {
    res.status(400).json({ message: "Đổi trạng thái thất bại" });
  }
};

const changeCommentChildrenStatus = async (req, res) => {
  try {
    const { childrenId, status } = req.body;
    const response = await CommentModel.changeChildrenCommentStatus(
      childrenId,
      status
    );
    if (response) return res.send({ message: "Đổi trạng thái thành công" });
    res.status(400).json({ message: "Đổi trạng thái thất bại" });
  } catch (error) {
    res.status(400).json({ message: "Đổi trạng thái thất bại" });
  }
};

module.exports = {
  createProductComment,
  getListProductComment,
  createChildrenComment,
  deleteProductComment,
  deleteChildrenComment,
  changeProductCommentStatus,
  changeCommentChildrenStatus,
};
