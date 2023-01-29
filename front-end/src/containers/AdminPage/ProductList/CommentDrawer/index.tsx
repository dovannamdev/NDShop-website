import {
  DeleteFilled,
  EyeFilled,
  EyeInvisibleFilled,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import {
  Col,
  Drawer,
  Input,
  message,
  Pagination,
  Popconfirm,
  Row,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import commentApi from "../../../../apis/commentApi";
import CommentForm from "../../../../components/ProductDetail/ProductReview/components/CommentForm";
import helpers from "../../../../helpers";
import "./style.scss";

type CommentDrawerType = {
  visible: boolean;
  onClose: () => void;
  productCode: string;
};
const { TextArea } = Input;
const COMMENT_IN_PAGE = 10;

export default function CommentDrawer({
  visible,
  onClose,
  productCode,
}: CommentDrawerType) {
  const [listComment, setListComment] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [visibleChildComment, setVisibleChildComment] = useState({
    status: false,
    reviewId: "",
  });
  const adminInfo = JSON.parse(localStorage.getItem("admin") || "");

  const getProductComment = async (page: number) => {
    try {
      const comment = await commentApi.getCommentByProductCode(
        productCode,
        page,
        COMMENT_IN_PAGE
      );
      if (comment?.data?.comment) {
        setListComment(comment?.data?.comment);
        setTotalItem(comment?.data?.total);
        if (currentPage !== page) {
          setCurrentPage(page);
        }
      }
    } catch (error) {
      console.log("get list comment error ", error);
    }
  };

  useEffect(() => {
    getProductComment(0);
  }, []);

  const deleteProductComment = async (commentId: number) => {
    try {
      const response = await commentApi.deleteProductComment(commentId);
      if (response?.status === 200) {
        const comment: any = [...listComment]?.filter((item: any) => {
          if (item?._id !== commentId) return true;
        });
        setListComment(comment);
        return message.success("Xoá bình luận sản phẩm thành công");
      }
      return message.error("Xoá bình luận sản phẩm thất bại");
    } catch (error) {
      return message.error("Xoá bình luận sản phẩm thất bại");
    }
  };

  const deleteChildrenComment = async (
    commentId: number,
    childrenId: number
  ) => {
    try {
      const response = await commentApi.deleteChildrenComment(childrenId);
      if (response?.status === 200) {
        const commentIndex = listComment?.findIndex(
          (item: any) => item?._id === commentId
        );
        if (commentIndex >= 0) {
          const comment: any = [...listComment];
          comment[commentIndex].children = [
            ...comment[commentIndex]?.children,
          ]?.filter((item: any) => {
            if (item?._id !== childrenId) return true;
            return false;
          });
          setListComment(comment);
        }
        return message.success("Xoá bình luận sản phẩm thành công");
      }
      return message.error("Xoá bình luận sản phẩm thất bại");
    } catch (error) {
      return message.error("Xoá bình luận thất bại");
    }
  };

  const changeCommentStatus = async (commentId: number, status: number) => {
    try {
      const response = await commentApi.updateProductCommentStatus(
        commentId,
        status
      );
      if (response?.status === 200) {
        const comment: any = [...listComment]?.map((item: any) => {
          if (item?._id !== commentId) return item;
          else
            return {
              ...item,
              status,
            };
        });
        setListComment(comment);

        return message.success("Đổi trạng thái bình luận thành công");
      }
      return message.error("Đổi trạng thái bình luận thất bại");
    } catch (error) {
      return message.error("Đổi trạng thái bình luận thất bại");
    }
  };

  const changeChildrenCommentStatus = async (
    commentId: number,
    childrenId: number,
    status: number
  ) => {
    try {
      const response = await commentApi.updateChildrenCommentStatus(
        childrenId,
        status
      );
      if (response?.status === 200) {
        const commentIndex = listComment?.findIndex(
          (item: any) => item?._id === commentId
        );
        if (commentIndex >= 0) {
          const comment: any = [...listComment];
          comment[commentIndex].children = [
            ...comment[commentIndex]?.children,
          ]?.map((item: any) => {
            if (item?._id !== childrenId) return item;
            else
              return {
                ...item,
                status,
              };
          });
          setListComment(comment);
        }
        return message.success("Đổi trạng thái bình luận thành công");
      }
      return message.error("Đổi trạng thái bình luận thất bại");
    } catch (error) {
      return message.error("Đổi trạng thái bình luận thất bại");
    }
  };

  const sendChildrenReview = async (commentText: string, commentId: any) => {
    try {
      const commentData = {
        commentId: commentId,
        review: commentText,
        ownerType: "admin",
        adminOwner: adminInfo?._id
      };
      const createRes = await commentApi.createCommentChildren(commentData);
      if (createRes?.status === 200) {
        message.success("Phản hồi thành công");
        getProductComment(currentPage);
        return true;
      }
      message.error("Phản hồi thất bại");
      return false;
    } catch (error: any) {
      message.error(error.response.data.message || "Phản hồi thất bại");
      return false;
    }
  };

  return (
    <Drawer
      title={`Bình luận của sản phẩm ${productCode}`}
      placement="right"
      onClose={onClose}
      visible={visible}
      width={800}
    >
      <Row className="Product-Desc bg-white">
        <Col span={24}>
          <Typography.Title
            level={3}
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Bình luận sản phẩm
          </Typography.Title>
        </Col>
        <Col span={24}>
          <div
            style={{ marginLeft: "20%", marginRight: "20%", marginTop: "30px" }}
          >
            {listComment?.map((item: any, index) => {
              return (
                <div
                  key={`comment-item-${index}`}
                  style={{ marginBottom: "40px" }}
                  className="list-comment"
                >
                  <div style={{ marginBottom: "5px" }}>
                    <span
                      style={{
                        padding: "4px 7px",
                        borderRadius: "10px",
                        background: "#CCCCCC",
                        color: "#FFFFFF",
                        fontSize: "20px",
                        fontWeight: 700,
                      }}
                    >
                      {item?.ownerFullName?.charAt(0)?.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "17px",
                        color: "black",
                        marginLeft: "5px",
                      }}
                    >
                      {item?.ownerFullName}
                    </span>
                    <span style={{ marginLeft: "10px" }}>
                      {[1, 2, 3, 4, 5]?.map((itemNumber) => {
                        if (item?.star >= itemNumber)
                          return (
                            <StarFilled
                              style={{ color: "#fcba03", marginRight: "5px" }}
                            />
                          );
                        return (
                          <StarOutlined
                            style={{ color: "#fcba03", marginRight: "5px" }}
                          />
                        );
                      })}
                    </span>
                    <span style={{ marginLeft: "20px", color: "#9C9D9C" }}>
                      {helpers.dateTimeConverter(item?.commentDate)}
                    </span>
                    <span style={{ marginLeft: "20px" }}>
                      <Popconfirm
                        title="Bạn có chắc chắn muốn xoá bình luận này không?"
                        onConfirm={() => deleteProductComment(item?._id)}
                        okText="Xác nhận"
                        cancelText="Huỷ"
                      >
                        <DeleteFilled style={{ color: "red" }} />
                      </Popconfirm>
                    </span>
                    <span style={{ marginLeft: "20px" }}>
                      <Popconfirm
                        title="Bạn có chắc chắn muốn đổi trạng thái bình luận này không?"
                        onConfirm={() =>
                          changeCommentStatus(
                            item?._id,
                            item?.status === 1 ? 0 : 1
                          )
                        }
                        okText="Xác nhận"
                        cancelText="Huỷ"
                      >
                        {item?.status === 1 ? (
                          <EyeFilled style={{ color: "green" }} />
                        ) : (
                          <EyeInvisibleFilled style={{ color: "green" }} />
                        )}
                      </Popconfirm>
                    </span>
                  </div>
                  <TextArea
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    value={item?.comment || ""}
                    disabled={true}
                  />
                  {!visibleChildComment?.status ||
                  (visibleChildComment?.status &&
                    visibleChildComment?.reviewId !== item?._id) ? (
                    <div
                      style={{
                        float: "right",
                        color: "#2D8CDB",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setVisibleChildComment({
                          status: true,
                          reviewId: item?._id,
                        })
                      }
                    >
                      Phản hồi
                    </div>
                  ) : (
                    <></>
                  )}

                  {item?.children?.length ? (
                    <div style={{ marginTop: "30px" }}>
                      {item?.children?.map(
                        (childrenItem: any, childrenIndex: number) => {
                          return (
                            <div
                              key={`children-item-${childrenIndex}`}
                              style={{
                                marginLeft: "15%",
                                marginRight: "0",
                                marginTop: "20px",
                              }}
                            >
                              <div
                                style={{ fontSize: "15px", fontWeight: 700 }}
                              >
                                {childrenItem?.ownerType === "admin" ? (
                                  <span
                                    style={{
                                      color: "black",
                                      backgroundColor: "#EDBD49",
                                      fontWeight: 500,
                                      padding: "5px",
                                    }}
                                  >
                                    <span>{childrenItem?.adminName ? `${childrenItem?.adminName} - ` : ''}</span>
                                    QTV
                                  </span>
                                ) : (
                                  childrenItem?.ownerFullname
                                )}
                                <span
                                  style={{
                                    marginLeft: "20px",
                                    color: "#9C9D9C",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {helpers.dateTimeConverter(item?.commentDate)}
                                </span>
                                <span style={{ marginLeft: "20px" }}>
                                  <Popconfirm
                                    title="Bạn có chắc chắn muốn xoá phản hồi này không?"
                                    onConfirm={() =>
                                      deleteChildrenComment(
                                        item?._id,
                                        childrenItem?._id
                                      )
                                    }
                                    okText="Xác nhận"
                                    cancelText="Huỷ"
                                  >
                                    <DeleteFilled style={{ color: "red" }} />
                                  </Popconfirm>
                                </span>
                                <span style={{ marginLeft: "20px" }}>
                                  <Popconfirm
                                    title="Bạn có chắc chắn muốn đổi trạng thái phản hồi này không?"
                                    onConfirm={() =>
                                      changeChildrenCommentStatus(
                                        item?._id,
                                        childrenItem?._id,
                                        childrenItem?.status === 1 ? 0 : 1
                                      )
                                    }
                                    okText="Xác nhận"
                                    cancelText="Huỷ"
                                  >
                                    {childrenItem?.status === 1 ? (
                                      <EyeFilled style={{ color: "green" }} />
                                    ) : (
                                      <EyeInvisibleFilled
                                        style={{ color: "green" }}
                                      />
                                    )}
                                  </Popconfirm>
                                </span>
                              </div>
                              <TextArea
                                key={`comment-item-${childrenIndex}`}
                                value={childrenItem?.review || ""}
                                autoSize={{ minRows: 2, maxRows: 6 }}
                                disabled={true}
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <></>
                  )}

                  {visibleChildComment?.status &&
                  visibleChildComment?.reviewId === item?._id ? (
                    <div style={{ marginTop: "10px" }}>
                      <CommentForm
                        onSubmit={async (commentText, starRaiting) =>
                          sendChildrenReview(commentText, item?._id)
                        }
                        visibleStar={false}
                        type="CHILDREN"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </div>
          {listComment?.length ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Pagination
                current={currentPage + 1}
                onChange={(page) => getProductComment(page - 1)}
                total={totalItem}
                pageSize={COMMENT_IN_PAGE}
              />
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              Hiện chưa có bình luận cho sản phẩm
            </div>
          )}
        </Col>
      </Row>
    </Drawer>
  );
}
