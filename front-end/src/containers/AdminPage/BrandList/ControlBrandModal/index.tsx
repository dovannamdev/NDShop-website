import { Col, Form, Input, message, Modal, Row } from "antd";
import React, { useState } from "react";
import adminApi from "../../../../apis/adminApi";

type ControlBrandModalType = {
  visible: boolean;
  onClose: () => void;
  brand?: any;
  type: "CREATE" | "UPDATE" | "DELETE";
  reloadPage: () => void;
  handleUpdateField: (id: any, brandName: any) => void;
};

export default function ControlBrandModal({
  visible,
  onClose,
  brand,
  type,
  reloadPage,
  handleUpdateField,
}: ControlBrandModalType) {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (value: any) => {
    setIsLoading(true);
    try {
      if (type === "CREATE") {
        await adminApi.postAddBrand(value);
        message.success("Thêm mới thành công");
        onClose();
        reloadPage();
      }

      if (type === "UPDATE") {
        await adminApi.updateBrand({ ...value, _id: brand?._id });
        message.success("Cập nhật thành công");
        onClose();
        handleUpdateField(brand?._id, value?.brandName);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Xử lí tác vụ thất bại");
    }
    setIsLoading(false);
  };

  return (
    <Modal
      className="edit-product-modal"
      visible={visible}
      okText={type === "CREATE" ? "Thêm mới" : "Cập nhật"}
      cancelText="Huỷ bỏ"
      onCancel={() => onClose()}
      okButtonProps={{ form: "editForm", htmlType: "submit" }}
      title={type === "CREATE" ? "Tạo mới thương hiệu" : "Cập nhập thương hiệu"}
      confirmLoading={isLoading}
      width={500}
    >
      <Form
        layout="vertical"
        initialValues={{ brandName: brand?.brandName }}
        name="editForm"
        onFinish={onFinish}
        form={form}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="brandName"
              label="Tên thương hiệu"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Nhập vào tên thương hiệu" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
