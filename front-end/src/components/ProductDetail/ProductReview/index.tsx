import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Col, Input, message, Pagination, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import commentApi from "../../../apis/commentApi";
import orderApi from "../../../apis/orderApi";
import helpers from "../../../helpers";
import CommentForm from "./components/CommentForm";
import "./style.scss";
const { TextArea } = Input;

type ProductReviewType = {
  productCode: any;
};
const COMMENT_IN_PAGE = 10;

export default function ProductReview(props: ProductReviewType) {
  const { productCode } = props;
  const [listComment, setListComment] = useState([]);
  const [visibleChildComment, setVisibleChildComment] = useState({
    status: false,
    reviewId: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [userHaveOrder, setUserHaveOrder] = useState(false);
  const user = useSelector((state: any) => state.userReducer);

  const checkUserHaveOrder = async () => {
    if (user?._id) {
      const checkUser = await orderApi.checkUserHaveOrder(
        user?._id,
        productCode
      );
      if (checkUser?.data?.success) {
        setUserHaveOrder(checkUser?.data?.payload);
      }
    }
  };

  const getListComment = async (page: number) => {
    try {
      const comment = await commentApi.getCommentByProductCode(
        productCode,
        page,
        COMMENT_IN_PAGE,
        1
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
    getListComment(0);
    checkUserHaveOrder();
  }, []);

  const sendProductReview = async (
    commentText: string,
    starRaiting: number
  ) => {
    try {
      if (!userHaveOrder) {
        return message.error("Bạn chỉ được bình luận khi đã mua hàng");
      }
      const commentData = {
        owner: user?._id,
        star: starRaiting,
        comment: commentText,
        productCode,
      };
      const createRes = await commentApi.createProductComment(commentData);
      if (createRes?.status === 200) {
        message.success("Bình luận thành công");
        getListComment(currentPage);
        return true;
      }
      message.error("Bình luận thất bại");
      return false;
    } catch (error: any) {
      message.error(error.response.data.message || "Bình luận thất bại");
      return false;
    }
  };

  const sendChildrenReview = async (
    commentText: string,
    starRaiting: number,
    commentId: any
  ) => {
    try {
      const commentData = {
        commentId: commentId,
        owner: user?._id,
        review: commentText,
        ownerType: "user",
      };
      const createRes = await commentApi.createCommentChildren(commentData);
      if (createRes?.status === 200) {
        message.success("Phản hồi thành công");
        getListComment(currentPage);
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
    <Row className="Product-Desc bg-white p-8">
      <Col span={24} style={{ marginTop: "100px" }}>
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
      <Col span={24} className="comment-form">
        <CommentForm
          onSubmit={(commentText, starRaiting) =>
            sendProductReview(commentText, starRaiting)
          }
          visibleStar={true}
          type="MAIN"
        />
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
                            <div style={{ fontSize: "15px", fontWeight: 700 }}>
                              {childrenItem?.ownerType === "admin" ? (
                                <span
                                  style={{
                                    color: "black",
                                    backgroundColor: "#EDBD49",
                                    fontWeight: 500,
                                    padding: "5px",
                                  }}
                                >
                                  <span>
                                    {childrenItem?.adminName
                                      ? `${childrenItem?.adminName} - `
                                      : ""}
                                  </span>
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
                      onSubmit={(commentText, starRaiting) =>
                        sendChildrenReview(commentText, starRaiting, item?._id)
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
              onChange={(page) => getListComment(page - 1)}
              total={totalItem}
              pageSize={COMMENT_IN_PAGE}
            />
          </div>
        ) : (
          <></>
        )}
      </Col>
    </Row>
  );
}
