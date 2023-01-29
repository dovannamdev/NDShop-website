import React, { useEffect, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { Button, message, Popconfirm, Switch, Table, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import GlobalLoading from "../../../components/GlobalLoading";
import ConfirmAdminModal from "./ConfirmAdminModal";
import helpers from "../../../helpers";
import ControlAdminModal from "./ControlAdminModal";
import adminApi from "../../../apis/adminApi";
import accountApi from "../../../apis/accountApi";

interface AdminItemType {
  _id: number;
  fullName: string;
}

export default function AdminList() {
  const [controlModal, setControlModal] = useState<{
    visible: boolean;
    admin: any;
    type: "CREATE" | "UPDATE" | "DELETE";
  }>({
    visible: false,
    admin: {},
    type: "CREATE",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [listAdmin, setListAdmin] = useState<any[]>([]);
  const adminRole = useMemo(() => {
    const role = helpers.getFunctionRole("admin");
    return role;
  }, []);

  const getAllAdmin = async () => {
    try {
      const admin = await adminApi.getListAdminAccount(true, "");
      if (admin?.data?.success) {
        setListAdmin(admin?.data?.payload);
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Lấy danh sách thương hiệu thất bại.");
    }
  };

  useEffect(() => {
    getAllAdmin();
  }, []);

  const handleChangeAccountStatus = async (status: any, accountId: any) => {
    try {
      const result = await accountApi.changeAccountStatus(status, accountId);
      if (result?.data?.success) {
        const admin = [...listAdmin]?.map((item) => {
          if (item?.accountId === accountId) {
            return {
              ...item,
              status,
            };
          }
          return item;
        });
        setListAdmin(admin);
        return message.success("Thay đổi trạng thái thành công");
      }
      return message.error("Thay đổi trạng thái tài khoản thất bại");
    } catch (error) {
      return message.error("Thay đổi trạng thái tài khoản thất bại");
    }
  };

  const columns: ColumnsType<AdminItemType> = [
    {
      title: "Số thứ tự",
      key: "index",
      dataIndex: "index",
      render: (code, data: any, index) => <div>{index + 1}</div>,
    },
    {
      title: "Tên nhân viên",
      key: "fullName",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Quyền",
      key: "roleName",
      dataIndex: "roleName",
      render: (item: any) => {
        return <>{item || "Chưa phân quyền"}</>;
      },
    },
    {
      title: "Ngày tạo",
      key: "createdDate",
      dataIndex: "createdDate",
      render: (item: any) => {
        return <>{helpers.dateTimeConverter(item)}</>;
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (item: any, record: any) => {
        return (
          <Popconfirm
            title="Xác nhận đổi trạng thái nhân viên"
            placement="top"
            okText="Đồng ý"
            cancelText="Huỷ"
            onConfirm={() => {
              if (adminRole?.indexOf("update") < 0) {
                return message.error("Bạn không có quyền cập nhật dữ liệu");
              }
              handleChangeAccountStatus(!!!item, record?.accountId);
            }}
          >
            <Tooltip title={!!item ? "Hoạt động" : "Không hoạt động"}>
              <Switch checked={!!item}></Switch>
            </Tooltip>
          </Popconfirm>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 150,
      align: "center",
      render: (admin) => (
        <>
          <Tooltip title="Sửa thương hiệu" placement="bottom">
            <EditOutlined
              onClick={() => {
                if (adminRole?.indexOf("update") < 0) {
                  return message.error("Bạn không có quyền cập nhật dữ liệu");
                }
                setControlModal({
                  visible: true,
                  admin: { ...admin },
                  type: "UPDATE",
                });
              }}
              className="m-r-8 action-btn-product font-size-18px m-r-10"
              style={{ color: "#30CFD0 " }}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div className="pos-relative p-8">
      {isLoading ? (
        <GlobalLoading content={"Đang tải danh sách thương hiệu ..."} />
      ) : (
        <>
          <div className="d-flex btn-add-product">
            <Button
              onClick={() => {
                if (adminRole?.indexOf("create") < 0) {
                  return message.error("Bạn không có quyền tạo dữ liệu");
                }
                setControlModal({ visible: true, admin: {}, type: "CREATE" });
              }}
              type="primary"
              className="m-b-20 m-t-10"
              style={{ marginLeft: "auto" }}
            >
              <PlusOutlined className="action-btn-product" />
              Thêm nhân viên
            </Button>
          </div>
          <Table columns={columns} dataSource={listAdmin} />

          {controlModal.visible && controlModal?.type !== "DELETE" && (
            <ControlAdminModal
              visible={controlModal.visible}
              onClose={() =>
                setControlModal({ visible: false, admin: {}, type: "CREATE" })
              }
              handleUpdateField={(
                id: any,
                fullName: any,
                email: any,
                userName: any,
                role: any
              ) => {
                const admin = listAdmin?.map((item: any) => {
                  if (item?._id === id) {
                    return {
                      ...item,
                      fullName: fullName,
                      email: email,
                      userName,
                      roleName: role,
                    };
                  }
                  return item;
                });
                setListAdmin(admin);
              }}
              reloadPage={() => getAllAdmin()}
              admin={controlModal?.admin}
              type={controlModal?.type}
            />
          )}

          {controlModal.visible && controlModal?.type === "DELETE" && (
            <ConfirmAdminModal
              visible={controlModal.visible}
              onClose={() =>
                setControlModal({ visible: false, admin: {}, type: "CREATE" })
              }
              admin={controlModal?.admin}
              handleDeleteAdmin={(id: any) => {
                const admin = listAdmin?.filter((item) => {
                  if (item?._id !== id) return true;
                });
                setListAdmin(admin);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
