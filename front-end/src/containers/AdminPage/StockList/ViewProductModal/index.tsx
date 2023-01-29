import {
  Button,
  message,
  Modal,
  Popconfirm,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import stockApi from "../../../../apis/stockApi";
import { FORMAT_NUMBER } from "../../../../constants";
import helpers from "../../../../helpers";

type ViewProductModalType = {
  visible: boolean;
  onClose: () => void;
  stockId: any;
};

export default function ViewProductModal({
  visible,
  onClose,
  stockId,
}: ViewProductModalType) {
  const [stockProduct, setStockProduct] = useState([]);

  const getStockDetail = async () => {
    try {
      const stockDetail = await stockApi.getStockDetail(stockId);
      if (stockDetail?.data?.success) {
        setStockProduct(stockDetail?.data?.payload);
      }
    } catch (error) {
      console.log("get stock detail >>> ", error);
    }
  };

  useEffect(() => {
    getStockDetail();
  }, []);

  const changeProductStatus = async (productCode: any, status: any) => {
    try {
      const result = await stockApi.changeStockProductStatus(stockId, productCode, status)
      if ( result?.data?.success){
        const newPrd: any = [...stockProduct]?.map((item: any) => {
          if (item?.productCode === productCode){
            return {
              ...item,
              status
            }
          }
          return {...item}
        })
        setStockProduct(newPrd)
        return message.success('Cập nhật trạng thái thành công')
      }
      return message.error('Cập nhật trạng thái thất bại')
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại')
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (item: any, record: any, index: number) => index + 1,
    },
    {
      title: "Mã sản phẩm",
      key: "productCode",
      dataIndex: "productCode",
    },
    {
      title: "Tên sản phẩm",
      key: "productName",
      dataIndex: "productName",
    },
    {
      title: "Số lượng nhập",
      key: "initQuantity",
      dataIndex: "initQuantity",
      render: (value: any) => FORMAT_NUMBER.format(value),
      sorter: (a: any, b: any) => {
        return a.initQuantity - b.initQuantity
      },
    },
    {
      title: "Giá nhập vào",
      key: "initPrice",
      dataIndex: "initPrice",
      render: (value: any) => helpers.formatProductPrice(value),
      sorter: (a: any, b: any) => {
        return a.initPrice - b.initPrice
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (item: any, record: any) => (
        <Popconfirm
          placement="top"
          title={"Nhấn vào đây để vô hiệu hoá sản phẩm"}
          onConfirm={() =>
            changeProductStatus(record?.productCode, Number(item) === 1 ? 0 : 1)
          }
          okText="Đồng ý"
          cancelText="Huỷ"
        >
          <div style={{ whiteSpace: "nowrap", cursor: "pointer" }}>
            {Number(item) === 1 ? (
              <span style={{ color: "blue" }}>Kích hoạt</span>
            ) : (
              <span style={{ color: "gray" }}>Vô hiệu hoá</span>
            )}
          </div>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal
      className="edit-product-modal"
      visible={visible}
      footer={
        <Button onClick={()=>onClose()}>Đóng</Button>
      }
      cancelText="Huỷ bỏ"
      onCancel={() => onClose()}
      okButtonProps={{ form: "editForm", htmlType: "submit" }}
      width={900}
      maskClosable={false}

    >
      <Table columns={columns} dataSource={stockProduct} />
    </Modal>
  );
}
