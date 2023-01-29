import { WarningOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
import React, { useState } from "react";
import roleApi from "../../../../apis/roleApi";
import stockApi from "../../../../apis/stockApi";

type ConfirmStockModalType = {
  visible: boolean;
  onClose: () => void;
  handleDeleteStock: (id: any) => void;
  stockId: any;
};

export default function ConfirmStockModal({
  visible,
  onClose,
  handleDeleteStock,
  stockId,
}: ConfirmStockModalType) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteStockData = async () => {
    setIsLoading(true);
    try {
      const result = await stockApi.deleteStockData(stockId);
      if (result?.data.success) {
        message.success("Xoá đơn đặt hàng thành công");
        handleDeleteStock(stockId);
      } else {
        message.error("Đang có sản phẩm được đặt hàng");
      }
      onClose();
    } catch (error) {
      message.error(
        "Xoá đơn đặt hàng thất bại hoặc đơn đặt hàng có sản phẩm đang được đặt"
      );
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <Modal
      title="Xác nhận xoá quyền"
      visible={visible}
      onOk={() => {
        handleDeleteStockData();
      }}
      onCancel={() => onClose()}
      okButtonProps={{ danger: true, loading: isLoading }}
      okText="Xoá"
      cancelText="Huỷ bỏ"
    >
      <WarningOutlined style={{ fontSize: 28, color: "#F7B217" }} />
      <b> Không thể khôi phục được, bạn có chắc chắn muốn xoá ?</b>
    </Modal>
  );
}
