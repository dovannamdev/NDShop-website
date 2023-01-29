import { PlusOutlined } from "@ant-design/icons";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import adminApi from "../../../../apis/adminApi";
import roleApi from "../../../../apis/roleApi";
import constants from "../../../../constants";

type ControlRoleModalType = {
  visible: boolean;
  onClose: () => void;
  role?: any;
  type: "CREATE" | "UPDATE" | "DELETE";
  reloadPage: () => void;
  handleUpdateField: (id: any, brandName: any) => void;
};

const DEFAULT_ROLE = constants.DEFAULT_ROLE;
const PERMISSION = constants.PERMISSION;
const CHAT_PERMISSION = constants.CHAT_PERMISSION;
const ORDER_PERMISSION = constants.ORDER_PERMISSION;
const CUSTOMER_PERMISSION = constants.CUSTOMER_PERMISSION;
const ADMIN_PERMISSION = constants.ADMIN_PERMISSION;

export default function ControlRoleModal({
  visible,
  onClose,
  role,
  type,
  reloadPage,
  handleUpdateField,
}: ControlRoleModalType) {
  const [isLoading, setIsLoading] = useState(false);
  const [initRole, setInitRole] = useState<any>({
    roleName: "",
    role: DEFAULT_ROLE?.map((item) => {
      return {
        role: item?.key,
        pemission: [],
      };
    }),
  });
  const [form] = Form.useForm();

  const onFinish = async (value: any) => {
    setIsLoading(true);
    try {
      if (type === "CREATE") {
        const result = await roleApi.createRole({
          ...initRole,
          roleName: value?.roleName,
        });
        if (result?.data?.message === "success") {
          message.success("Thêm mới thành công");
          onClose();
          reloadPage();
        } else {
          message.error("Thêm mới thất bại");
        }
      }

      if (type === "UPDATE") {
        await roleApi.updateRole(role?._id, {
          ...initRole,
          roleName: value?.roleName,
        });
        message.success("Cập nhật thành công");
        onClose();
        handleUpdateField(role?._id, value?.roleName);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Xử lí tác vụ thất bại");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (role?._id) {
      (async () => {
        const roleDetail = await roleApi.getRoleDetail(role?._id);
        if (roleDetail?.data?.payload?.length) {
          const { payload } = roleDetail?.data;
          const currentRole = { ...initRole };
          currentRole.roleName = role?.roleName || "";
          currentRole.role = payload?.map((item: any) => {
            return {
              role: item?.roleFunction,
              pemission: item?.rolePermisstion?.length
                ? item?.rolePermisstion?.split(",")
                : [],
            };
          });
          form.setFieldsValue({ roleName: role?.roleName || "" });
          setInitRole(currentRole);
        }
      })();
    }
  }, [role]);

  return (
    <Modal
      className="edit-product-modal"
      visible={visible}
      okText={type === "CREATE" ? "Thêm mới" : "Cập nhật"}
      cancelText="Huỷ bỏ"
      onCancel={() => onClose()}
      okButtonProps={{ form: "editForm", htmlType: "submit" }}
      title={type === "CREATE" ? "Tạo mới quyền" : "Cập nhập quyền"}
      confirmLoading={isLoading}
      width={700}
    >
      <Form
        layout="vertical"
        initialValues={{ roleName: initRole?.roleName }}
        name="editForm"
        onFinish={onFinish}
        form={form}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="roleName"
              label="Tên quyền"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Nhập vào tên quyền" />
            </Form.Item>
          </Col>
        </Row>
        <div style={{ marginTop: "20px", marginBottom: "10px" }}>Cấp quyền</div>
        <Row gutter={[16, 16]}>
          {DEFAULT_ROLE?.map((item, index) => {
            return (
              <Col span={24} key={`role-item-${index}`}>
                <div>
                  <PlusOutlined style={{ color: "#36B8C4" }} />{" "}
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#36B8C4",
                    }}
                  >
                    {item?.label}
                  </span>
                </div>
                <Row>
                  {item?.key === "dashboard" || item?.key === "delivery" ? (
                    <Col span={8}>
                      <div>Xem</div>
                      <Select
                        value={
                          initRole?.role
                            ?.find((it: any) => it?.role === item?.key)
                            ?.pemission?.includes("view")
                            ? "on"
                            : "off"
                        }
                        style={{ width: "90%" }}
                        options={[
                          {
                            value: "on",
                            label: "Bật",
                          },
                          {
                            value: "off",
                            label: "Tắt",
                          },
                        ]}
                        onChange={(value) => {
                          const currentRole = [...initRole?.role];
                          const roleIsSelect = currentRole?.find(
                            (it) => it?.role === item?.key
                          );
                          if (roleIsSelect) {
                            if (value === "on") {
                              roleIsSelect?.pemission.push("view");
                            } else {
                              roleIsSelect.pemission = [
                                ...roleIsSelect?.pemission,
                              ]?.filter((it) => it !== "view");
                            }
                          } else {
                            currentRole?.push({
                              role: item?.key,
                              pemission: ["view"],
                            });
                          }

                          setInitRole({ ...initRole, role: currentRole });
                        }}
                      />
                    </Col>
                  ) : (
                    (item?.key === "chat"
                      ? CHAT_PERMISSION
                      : item?.key === "order_list"
                      ? ORDER_PERMISSION
                      : item?.key === "customer"
                      ? CUSTOMER_PERMISSION
                      : item?.key === "admin"
                      ? ADMIN_PERMISSION
                      : PERMISSION
                    )?.map((permisstionItem, permisstionIndex) => {
                      return (
                        <Col
                          span={6}
                          key={`permisstion-item-${permisstionIndex}`}
                        >
                          <div>{permisstionItem?.label}</div>
                          <Select
                            value={
                              initRole?.role
                                ?.find((it: any) => it?.role === item?.key)
                                ?.pemission?.includes(permisstionItem?.key)
                                ? "on"
                                : "off"
                            }
                            style={{ width: "90%" }}
                            options={[
                              {
                                value: "on",
                                label: "Bật",
                              },
                              {
                                value: "off",
                                label: "Tắt",
                              },
                            ]}
                            onChange={(value) => {
                              const currentRole = [...initRole?.role];
                              const roleIsSelect = currentRole?.find(
                                (it) => it?.role === item?.key
                              );
                              if (roleIsSelect) {
                                if (value === "on") {
                                  roleIsSelect?.pemission.push(
                                    permisstionItem?.key
                                  );
                                } else {
                                  roleIsSelect.pemission = [
                                    ...roleIsSelect?.pemission,
                                  ]?.filter(
                                    (it) => it !== permisstionItem?.key
                                  );
                                }
                              } else {
                                currentRole?.push({
                                  role: item?.key,
                                  pemission: [permisstionItem?.key],
                                });
                              }

                              setInitRole({ ...initRole, role: currentRole });
                            }}
                          />
                        </Col>
                      );
                    })
                  )}
                </Row>
              </Col>
            );
          })}
        </Row>
      </Form>
    </Modal>
  );
}
