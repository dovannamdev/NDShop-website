import { WarningOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
import React, { useState } from "react";
import roleApi from "../../../../apis/roleApi";

type ConfirmRoleModalType = {
  visible: boolean;
  onClose: () => void;
  handleDeleteRole: (id: any) => void;
  roleId: any;
};

export default function ConfirmRoleModal({
  visible,
  onClose,
  handleDeleteRole,
  roleId,
}: ConfirmRoleModalType) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteRoleData = async () => {
    setIsLoading(true);
    try {
      await roleApi.deleteRole(roleId);
      message.success("Xoá quyền thành công");
      handleDeleteRole(roleId);
      onClose();
    } catch (error) {
      message.error("Xoá quyền thất bại");
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <Modal
      title="Xác nhận xoá quyền"
      visible={visible}
      onOk={() => {
        handleDeleteRoleData();
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
