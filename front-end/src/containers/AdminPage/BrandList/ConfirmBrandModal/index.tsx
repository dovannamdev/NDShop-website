import { WarningOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
import React, { useState } from "react";
import adminApi from "../../../../apis/adminApi";
import brandApi from "../../../../apis/brandApi";

type ConfirmBrandModalType = {
  visible: boolean;
  onClose: () => void;
  handleDeleteBrand: (id: any) => void;
  brandId: any;
};

export default function ConfirmBrandModal({
  visible,
  onClose,
  handleDeleteBrand,
  brandId,
}: ConfirmBrandModalType) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteBrandData = async () => {
    setIsLoading(true);
    try {
      await adminApi.removeBrand(brandId);
      message.success("Xoá thương hiệu thành công");
      handleDeleteBrand(brandId);
      onClose();
    } catch (error) {
      message.error("Xoá thương hiệu thất bại");
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <Modal
      title="Xác nhận xoá thương hiệu"
      visible={visible}
      onOk={() => {
        handleDeleteBrandData();
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
