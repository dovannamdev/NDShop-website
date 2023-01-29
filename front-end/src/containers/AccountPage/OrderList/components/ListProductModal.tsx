import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import orderApi from "../../../../apis/orderApi";
import helpers from "../../../../helpers";

type ListProductModalType = {
  visible: boolean;
  onClose: () => void;
  orderId: any;
  orderCode: any;
};

export default function ListProductModal(props: ListProductModalType) {
  const { visible, onClose, orderId, orderCode } = props;
  const [productList, setProductList] = useState([]);

  const orderColumns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (orderCode: any, records: any) => <div>{records?.name}</div>,
    },
    {
      title: "Số lượng",
      dataIndex: "numOfProd",
      key: "numOfProd",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
      render: (orderCode: any, records: any) => (
        <div>{helpers.formatProductPrice(records?.unitPrice)}</div>
      ),
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "promo",
      key: "promo",
    },
    {
      title: "Tổng",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (totalMoney: any, records: any) => (
        <div>
          {helpers.formatProductPrice(
            (Number(records?.unitPrice) -
              Number(records?.unitPrice) *
                ((Number(records?.promo) || 0) / 100)) *
              Number(records?.numOfProd)
          )}
        </div>
      ),
    },
  ];

  const getProductByOrderId = async () => {
    const product = await orderApi.getOrderProduct(orderId);
    if (product?.data?.list?.length) {
      setProductList(product?.data?.list);
    }
  };

  useEffect(() => {
    getProductByOrderId();
  }, []);

  return (
    <Modal
      title={`Sản phẩm của đơn hàng ${orderCode}`}
      visible={visible}
      onCancel={() => onClose()}
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
      width={900}
    >
      <Table
        columns={orderColumns}
        dataSource={productList}
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
          position: ["bottomRight"],
        }}
      />
    </Modal>
  );
}
