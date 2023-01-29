import { Button, Table, Tabs } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import orderApi from "../../../apis/orderApi";
import helpers from "../../../helpers";
import DeliveryDrawer from "./components/DeliveryDrawer";

export default function DeliveryList() {
  const [visibleDeliveryDrawer, setVisibleDeliveryDrawer] = useState({
    status: false,
    orderId: -1,
  });
  const [listOrder, setListOrder] = useState([]);
  const [filterDeliveryStatus, setFilterDeliveryStatus] = useState(0);
  const adminInfo = helpers.parseJSON(localStorage.getItem("admin"), {});

  const getListAdminOrder = async () => {
    try {
      if (adminInfo?._id) {
        const result = await orderApi.getShipperOrder(
          adminInfo?._id,
          filterDeliveryStatus
        );
        if (result) {
          setListOrder(result?.data?.list || []);
        }
      }
    } catch (error) {
      console.log("get list admin order error >>> ", error);
    }
  };

  useEffect(() => {
    getListAdminOrder();
  }, [filterDeliveryStatus]);

  const columns = [
    {
      title: "Mã đơn hàng",
      key: "orderCode",
      dataIndex: "orderCode",
      width: "150px",
    },
    {
      title: "Khách hàng",
      key: "name",
      dataIndex: "name",
      width: "200px",
    },
    {
      title: "Số điện thoại",
      key: "clientPhone",
      dataIndex: "clientPhone",
      width: "200px",
    },
    {
      title: "Địa chỉ",
      key: "clientAddress",
      dataIndex: "clientAddress",
      width: "250px",
    },
    {
      title: "Ngày đặt",
      key: "orderDate",
      dataIndex: "orderDate",
      width: "200px",
      sorter: (a: any, b: any) => {
        if (a.orderDate > b.orderDate) return 1;
        if (a.orderDate < b.orderDate) return -1;
        return 0;
      },
      render: (item: any) => {
        return moment(item).format("DD-MM-YYYY");
      },
    },
    {
      title: "Tổng tiền",
      key: "totalMoney",
      dataIndex: "totalMoney",
      width: "150px",
      sorter: (a: any, b: any) => {
        const calTotalMoney = (item: any) => {
          const totalPrdPrice = item?.orderProd?.reduce((pre: any, curr: any) => {
            return (
              pre +
              (curr?.unitPrice - curr?.unitPrice * ((curr?.promo || 0) / 100)) *
                curr?.numOfProd
            );
          }, 0);
          const totalPrice = totalPrdPrice + item?.transportFee;
          return totalPrice;
        };
        return calTotalMoney(a) - calTotalMoney(b);
      },
      render: (value: any, record: any) => {
        const totalPrdPrice = record?.orderProd?.reduce(
          (pre: any, curr: any) => {
            return (
              pre +
              (curr?.unitPrice - curr?.unitPrice * ((curr?.promo || 0) / 100)) *
                curr?.numOfProd
            );
          },
          0
        );

        const totalPrice = totalPrdPrice + record?.transportFee;
        return (
          <b style={{ color: "#333" }}>
            {helpers.formatProductPrice(totalPrice)}
          </b>
        );
      },
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: "300px",
      render: (paymentMethod: any) =>
        paymentMethod === "PAYMENT_ONLINE"
          ? "Thanh toán online"
          : paymentMethod === "DELIVERY"
          ? "Thanh toán tận nơi"
          : "",
    },
    {
      title: "Hành động",
      width: "350px",
      textAlign: "center",
      render: (record: any, allData: any) => (
        <Button
          style={{
            marginLeft: "10px",
            color: "white",
            background: "#178038",
          }}
          color="#178038"
          onClick={() => {
            setVisibleDeliveryDrawer({
              status: true,
              orderId: record?._id,
            });
          }}
        >
          Chi tiết giao hàng
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <Tabs
          defaultActiveKey="0"
          onChange={(value: any) => setFilterDeliveryStatus(value)}
        >
          <Tabs.TabPane tab="Đơn hàng mới" key="0"></Tabs.TabPane>
          <Tabs.TabPane tab="Đã xác nhận" key="1"></Tabs.TabPane>
          <Tabs.TabPane tab="Đang giao" key="2"></Tabs.TabPane>
          <Tabs.TabPane tab="Giao thành công" key="3"></Tabs.TabPane>
          <Tabs.TabPane tab="Giao thất bại" key="4"></Tabs.TabPane>
        </Tabs>
      </div>
      <div style={{ width: "calc(100vw - 250px)" }}>
        <Table columns={columns} dataSource={listOrder} scroll={{ x: 1500 }} />
      </div>

      {visibleDeliveryDrawer?.status && (
        <DeliveryDrawer
          visible={visibleDeliveryDrawer?.status}
          onClose={() => {
            getListAdminOrder();
            setVisibleDeliveryDrawer({ status: false, orderId: -1 });
          }}
          orderId={visibleDeliveryDrawer?.orderId}
        />
      )}
    </div>
  );
}
