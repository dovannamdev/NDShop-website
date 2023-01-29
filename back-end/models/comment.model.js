const { mysql } = require("../configs/mysql.config");

const CommentModel = {
  createProductComment: async (owner, star, comment, productCode) => {
    try {
      const response =
        await mysql.query(`INSERT INTO ProductComments(commentDate, owner, star, comment, productCode, status) 
      VALUES(Now(), ${Number(owner)}, ${Number(
          star
        )}, '${comment}', '${productCode}', 1)`);
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  getProductComment: async (productCode, limit, offset, status) => {
    try {
      const limitOffset =
        limit && offset && limit !== "undefined" && offset !== "undefined"
          ? `LIMIT ${limit} OFFSET ${offset * limit}`
          : "";

      const comment = await mysql.query(
        `SELECT pc.*, ur.fullName as ownerFullName FROM ProductComments pc JOIN users ur ON pc.owner = ur._id WHERE pc.productCode='${productCode}' AND ${
          status && status !== "undefined"
            ? `status=${Number(status)}`
            : "status >= 0"
        } ORDER BY _id DESC ${limitOffset}`
      );
      return comment || [];
    } catch (error) {
      return [];
    }
  },

  countProductComment: async (productCode) => {
    try {
      const total = await mysql.query(
        `SELECT COUNT(_id) as comment_quantity FROM ProductComments WHERE productCode='${productCode}'`
      );
      return total?.[0]?.comment_quantity;
    } catch (error) {
      return 0;
    }
  },

  createCommentChildren: async (
    commentId,
    owner,
    review,
    ownerType,
    adminOwner
  ) => {
    try {
      if (ownerType !== "admin") {
        const response = await mysql.query(
          `INSERT INTO ProductCommentChildren(commentId, owner, review, status, commentDate, ownerType) VALUES(${Number(
            commentId
          )}, ${
            ownerType === "admin" ? 0 : Number(owner)
          }, '${review}', 1, Now(), '${ownerType}')`
        );
        return response ? true : false;
      } else {
        const response = await mysql.query(
          `INSERT INTO ProductCommentChildren(commentId, review, status, commentDate, ownerType, adminOwner) VALUES(${Number(
            commentId
          )}, '${review}', 1, Now(), '${ownerType}', ${Number(adminOwner)})`
        );
        return response ? true : false;
      }
    } catch (error) {
      return false;
    }
  },

  getCommentChildren: async (commentId, status) => {
    try {
      const userComment = await mysql.query(
        `SELECT pcc.*, ur.fullName as ownerFullname FROM ProductCommentChildren pcc JOIN users ur ON pcc.owner = ur._id 
        WHERE pcc.commentId=${Number(
          commentId
        )} AND ${
          status && status !== "undefined"
            ? `pcc.status=${Number(status)}`
            : "pcc.status >= 0"
        } AND pcc.ownerType = 'user' ORDER BY pcc.commentDate DESC`
      );

      const adminComment = await mysql.query(
        `SELECT pcc.*, ad.fullName as adminName FROM ProductCommentChildren pcc LEFT JOIN Admins ad ON pcc.adminOwner = ad._id WHERE pcc.commentId=${Number(
          commentId
        )} AND ${
          status && status !== "undefined"
            ? `pcc.status=${Number(status)}`
            : "pcc.status >= 0"
        } AND pcc.ownerType = 'admin' ORDER BY pcc.commentDate DESC`
      );
      const comment = userComment.concat(adminComment);

      comment?.sort(function (x, y) {
        return y.commentDate - x.commentDate;
      });
      return comment || [];
    } catch (error) {
      return [];
    }
  },

  deleteProductComment: async (commentId) => {
    try {
      const response = await mysql.query(
        `DELETE FROM ProductComments WHERE _id=${Number(commentId)}`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteChildrenByCommentId: async (commentId) => {
    try {
      const response = await mysql.query(
        `DELETE FROM ProductCommentChildren WHERE commentId=${Number(
          commentId
        )}`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteChildrenComment: async (childrenId) => {
    try {
      const response = await mysql.query(
        `DELETE FROM ProductCommentChildren WHERE _id=${Number(childrenId)}`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  changeProductCommentstatus: async (commentId, status) => {
    try {
      const response = await mysql.query(
        `UPDATE ProductComments SET status = ${Number(
          status
        )} WHERE _id=${Number(commentId)}`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  changeChildrenCommentStatus: async (childrenId, status) => {
    try {
      const response = await mysql.query(
        `UPDATE ProductCommentChildren SET status = ${Number(
          status
        )} WHERE _id=${Number(childrenId)}`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },
};

module.exports = CommentModel;
