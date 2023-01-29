import { DeleteOutlined, EditOutlined, PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, message, Modal, Table, Tooltip } from "antd";
import { useState, useEffect, useMemo } from "react";
import roleApi from "../../../apis/roleApi";
import GlobalLoading from "../../../components/GlobalLoading";
import helpers from "../../../helpers";
import ConfirmRoleModal from "./ConfirmRoleModal";
import ControlRoleModal from "./ControlRoleModal";

const RoleList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [controlModal, setControlModal] = useState<any>({visible: false, role: {}, type: ''})

  const role = useMemo(() => {
    const role = helpers.getFunctionRole('role')
    return role
  }, [])

  const getRoleList = async () => {
    try {
      setIsLoading(true);
      const response = await roleApi.getRoleList();
      if (response?.data?.success) {
        const { payload } = response.data;
        setData([...payload]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRoleList();
  }, []);

  const columns = [
    {
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (item: any, record: any, index: number) => index + 1
    },
    {
      title: "Tên",
      key: "roleName",
      dataIndex: "roleName",
    },
    {
      title: "Ngày tạo",
      key: "createdDate",
      dataIndex: "createdDate",
      render: (item: any) => {
        return <>{helpers.dateTimeConverter(item)}</>
      }
    },
    {
      title: "Hành động",
      render: (item: any) => (
        <>
          <Tooltip title="Sửa quyền" placement="bottom">
            <EditOutlined
              className="m-r-8 action-btn-product font-size-18px m-r-10"
              style={{ color: "#30CFD0 " }}
              onClick={() => {
                if (role?.indexOf('update') < 0){
                  return message.error('Bạn không có quyền cập nhật dữ liệu')
                }

                setControlModal({ visible: true, role: {...item}, type: "UPDATE" })
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa quyền" placement="bottom">
            <DeleteOutlined
              className="m-r-8 action-btn-product font-size-18px"
              style={{ color: "red" }}
              onClick={() => {
                if (role?.indexOf('delete') < 0){
                  return message.error('Bạn không có quyền xoá dữ liệu')
                }

                setControlModal({ visible: true, role: {...item}, type: "DELETE" })
              }}
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
              onClick={() =>{
                if (role?.indexOf('create') < 0){
                  return message.error('Bạn không có quyền tạo dữ liệu mới')
                }
                setControlModal({ visible: true, role: {}, type: "CREATE" })
              }}
              type="primary"
              className="m-b-20 m-t-10"
              style={{ marginLeft: "auto" }}
            >
              <PlusOutlined className="action-btn-product" />
              Thêm quyền
            </Button>
          </div>
          <Table columns={columns} dataSource={data} />

          {controlModal.visible && controlModal?.type !== "DELETE" && (
            <ControlRoleModal
              visible={controlModal.visible}
              onClose={() =>
                setControlModal({ visible: false, role: {}, type: "CREATE" })
              }
              handleUpdateField={(id: any, roleName: any) => {
                const role = data?.map((item: any) => {
                  if (item?._id === id) {
                    return {
                      ...item,
                      roleName: roleName,
                    };
                  }
                  return item;
                });
                setData(role);
              }}
              reloadPage={() => getRoleList()}
              role={controlModal?.role}
              type={controlModal?.type}
            />
          )}

          {controlModal.visible && controlModal?.type === "DELETE" && (
            <ConfirmRoleModal
              visible={controlModal.visible}
              onClose={() =>
                setControlModal({ visible: false, role: {}, type: "" })
              }
              roleId={controlModal?.role?._id}
              handleDeleteRole={(id: any) => {
                const role = data?.filter((item: any) => {
                  if (item?._id !== id) return true;
                });
                setData(role)
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RoleList 
