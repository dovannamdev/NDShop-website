import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";

type CommentFormType = {
  onSubmit: (commentText: string, starRaiting: number) => Promise<boolean>;
  visibleStar: boolean;
  type: "MAIN" | "CHILDREN";
};
const { TextArea } = Input;

export default function CommentForm(props: CommentFormType) {
  const { onSubmit, visibleStar, type } = props;
  const [openSendButton, setOpenSendButton] = useState<boolean>(false);
  const [starRating, setStarRating] = useState<number>(0);
  const [form] = Form.useForm();
  const user = useSelector((state: any) => state.userReducer);

  return (
    <Form
      onFinish={async () => {
        if (!user?._id) {
          return message.error("Bạn cần đăng nhập để thực hiện chức năng này");
        }
        if (starRating === 0 && type === "MAIN") {
          return message.error("Số sao đánh giá không được bỏ trống");
        }
        const response = await onSubmit(
          form.getFieldValue("comment"),
          starRating
        );
        if (response) {
          form.resetFields();
          setStarRating(0);
        }
      }}
      form={form}
    >
      <Form.Item
        name="comment"
        rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
      >
        <div
          style={{
            paddingLeft: type === "CHILDREN" ? "15%" : "25%",
            paddingRight: type === "CHILDREN" ? "0" : "25%",
          }}
        >
          <TextArea
            placeholder={
              type === "CHILDREN" ? "Nhập phản hồi" : "Nhập bình luận"
            }
            autoSize={{ minRows: 3, maxRows: 5 }}
            onClick={() => {
              if (!openSendButton) setOpenSendButton(true);
            }}
          />
          {openSendButton ? (
            <div className="send-comment-frame">
              {visibleStar ? (
                <div className="star-raiting-frame">
                  <div>Đánh giá: &nbsp; &nbsp;</div>
                  <div>
                    {[1, 2, 3, 4, 5]?.map((item) => {
                      if (starRating >= item)
                        return (
                          <StarFilled
                            style={{ color: "#fcba03", marginRight: "5px" }}
                            onClick={() => {
                              if (item <= starRating) setStarRating(item - 1);
                              else setStarRating(item);
                            }}
                          />
                        );
                      return (
                        <StarOutlined
                          style={{ color: "#fcba03", marginRight: "5px" }}
                          onClick={() => {
                            if (item <= starRating) setStarRating(item - 1);
                            else setStarRating(item);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <></>
              )}
              {type === "CHILDREN" ? <div>&nbsp;</div> : <></>}
              <Form.Item>
                <Button type="primary" htmlType="submit" size="small">
                  Gửi
                </Button>
              </Form.Item>
            </div>
          ) : (
            ""
          )}
        </div>
      </Form.Item>
    </Form>
  );
}
