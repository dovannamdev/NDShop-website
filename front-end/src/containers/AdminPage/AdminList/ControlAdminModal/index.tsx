import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import adminApi from "../../../../apis/adminApi";
import roleApi from "../../../../apis/roleApi";
import helpers from "../../../../helpers";

type ControlAdminModalType = {
  visible: boolean;
  onClose: () => void;
  admin?: any;
  type: "CREATE" | "UPDATE" | "DELETE";
  reloadPage: () => void;
  handleUpdateField: (
    id: any,
    fullName: any,
    email: any,
    userName: any,
    role: any
  ) => void;
};

const { Option } = Select;

export default function ControlAdminModal({
  visible,
  onClose,
  admin,
  type,
  reloadPage,
  handleUpdateField,
}: ControlAdminModalType) {
  const [isLoading, setIsLoading] = useState(false);
  const [listRole, setListRole] = useState([]);
  const [form] = Form.useForm();

  const onFinish = async (value: any) => {
    setIsLoading(true);
    try {
      if (type === "CREATE") {
        const result = await adminApi.createNewAccount({
          ...value,
          role: value?.role || 0,
        });

        if (result?.data?.success) {
          message.success("Thêm mới thành công");
          onClose();
          reloadPage();
        }
      }
      if (type === "UPDATE") {
        await adminApi.updateAdminData(
          {
            ...value,
            accountId: admin?.accountId,
            email: value?.email !== admin?.email ? value?.email : "",
            userName:
              value?.userName !== admin?.userName ? value?.userName : "",
          },
          admin?._id
        );
        message.success("Cập nhật thành công");
        onClose();
        handleUpdateField(
          admin?._id,
          value?.fullName,
          value?.email,
          value?.userName,
          (listRole?.find((it: any) => it?._id === value?.role) as any)
            ?.roleName
        );
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Xử lí tác vụ thất bại");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      const lstRole = await roleApi.getRoleList();
      if (lstRole?.data?.payload?.length) {
        setListRole(lstRole?.data?.payload);
      }
    })();
  }, []);

  return (
    <Modal
      className="edit-product-modal"
      visible={visible}
      okText={type === "CREATE" ? "Thêm mới" : "Cập nhật"}
      cancelText="Huỷ bỏ"
      onCancel={() => onClose()}
      okButtonProps={{ form: "editForm", htmlType: "submit" }}
      title={type === "CREATE" ? "Tạo mới nhân viên" : "Cập nhập nhân viên"}
      confirmLoading={isLoading}
      width={500}
    >
      <Form
        layout="vertical"
        initialValues={{
          fullName: admin?.fullName,
          role: admin?.role,
          userName: admin?.userName,
          email: admin?.email,
        }}
        name="editForm"
        onFinish={onFinish}
        form={form}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="fullName"
              label="Tên nhân viên"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Nhập vào tên nhân viên" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="role" label="Quyền truy cập">
              <Select placeholder="Lựa chọn quyền của nhân viên" allowClear>
                {listRole?.map((roleItem: any, roleIndex: number) => {
                  return (
                    <Option
                      value={roleItem?._id}
                      key={`role-item-${roleIndex}`}
                    >
                      {roleItem?.roleName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
                {
                  validator: async (_, email) => {
                    if (email && !helpers.validateEmail(email)) {
                      return Promise.reject(new Error("Email sai định dạng"));
                    }
                  },
                },
              ]}
            >
              <Input size="large" placeholder="Nhập vào email" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="userName"
              label="Tên đăng nhập"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập vào tên đăng nhập"
                autoComplete="new-userName"
              />
            </Form.Item>
          </Col>
          {type !== "UPDATE" ? (
            <Col span={24}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Nhập vào mật khẩu",
                    whitespace: true,
                  },
                  {
                    validator: async (_, names) => {
                      if (names && names?.trim()?.length < 6) {
                        return Promise.reject(
                          new Error("Mật khẩu ít nhất 6 kí tự")
                        );
                      }
                    },
                  },
                ]}
              >
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </Form>
    </Modal>
  );
}
