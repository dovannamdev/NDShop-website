import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import orderApi from "../../../../apis/orderApi";
import { FORMAT_NUMBER } from "../../../../constants";
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
      title: "Mã nhập hàng",
      dataIndex: "stockId",
      key: "stockId",
      render: (stockId: any) => <div>MNH{stockId}</div>,
    },
    {
      title: "Số lượng",
      dataIndex: "numOfProd",
      key: "numOfProd",
      render: (value: any) => FORMAT_NUMBER.format(value),
      sorter: (a: any, b: any) => {
        return a.numOfProd - b.numOfProd;
      },
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "unitPrice",
      key: "unitPrice",
      sorter: (a: any, b: any) => {
        return a.unitPrice - b.unitPrice;
      },
      render: (orderCode: any, records: any) => (
        <div>{helpers.formatProductPrice(records?.unitPrice)}</div>
      ),
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "promo",
      key: "promo",
      sorter: (a: any, b: any) => {
        return a.promo - b.promo;
      },
    },
    {
      title: "Tổng",
      dataIndex: "totalMoney",
      key: "totalMoney",
      sorter: (a: any, b: any) => {
        const calTotalMoney = (item: any) => {
          return (
            (Number(item?.unitPrice) -
              Number(item?.unitPrice) * ((Number(item?.promo) || 0) / 100)) *
            Number(item?.numOfProd)
          );
        };
        return calTotalMoney(a) - calTotalMoney(b);
      },
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
