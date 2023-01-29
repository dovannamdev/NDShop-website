import { WarningOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
import React, { useState } from "react";
import adminApi from "../../../../apis/adminApi";

type ConfirmAdminModalType = {
  visible: boolean;
  onClose: () => void;
  handleDeleteAdmin: (id: any) => void;
  admin: any;
};

export default function ConfirmAdminModal({
  visible,
  onClose,
  handleDeleteAdmin,
  admin,
}: ConfirmAdminModalType) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAdminData = async () => {
    setIsLoading(true);
    try {
      const result =  await adminApi.deleteAdminAccount(admin?._id, admin?.accountId);
      if ( result?.data?.success){
        message.success("Xoá nhân viên thành công");
        handleDeleteAdmin(admin?._id);
      }
      onClose();
    } catch (error) {
      message.error("Xoá nhân viên thất bại");
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <Modal
      title="Xác nhận xoá nhân viên"
      visible={visible}
      onOk={() => {
        handleDeleteAdminData();
      }}
      onCancel={() => onClose()}
      okButtonProps={{ danger: true, loading: isLoading }}
      okText="Xoá"
      cancelText="Huỷ bỏ"
    >
      <WarningOutlined style={{ fontSize: 28, color: "#F7B217" }} />
      <b> Không thể khôi phục được, bạn có chắc muốn xoá ?</b>
    </Modal>
  );
}
