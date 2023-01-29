import { Button, message, Popconfirm, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import adminApi from "../../../apis/adminApi";
import orderApi from "../../../apis/orderApi";
import GlobalLoading from "../../../components/GlobalLoading";
import helpers from "../../../helpers";
import ListProductModal from "./components/ListProductModal";

const OrderList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [orderDetails, setOrderDetails] = useState({
    isOpen: false,
    orderId: "",
  });
  const [visibleProductModal, setVisibleProductModal] = useState({
    status: false,
    orderId: -1,
    orderCode: "",
  });
  const user = useSelector((state: any) => state.userReducer);

  const handleCancelOrder = async (orderId: any) => {
    try {
      const result = await adminApi.postUpdateOrderStatus(orderId, 5);
      if (result) {
        const currOrder: any = [...orderList]?.map((item: any) => {
          if (item?._id === orderId) {
            return {
              ...item,
              orderStatus: 5,
            };
          }
          return { ...item };
        });
        setOrderList(currOrder);
        return message.success("Đơn hàng đang chờ huỷ");
      }
      return message.error("Huỷ đơn hàng thất bại");
    } catch (error) {
      message.error("Huỷ đơn hàng thất bại, vui lòng thử lại sau");
    }
  };

  function showOrderList(list: any) {
    return list && list.length === 0 ? (
      <h3 className="m-t-16 t-center" style={{ color: "#888" }}>
        Hiện tại bạn chưa có đơn hàng nào
      </h3>
    ) : (
      <Table
        scroll={{ x: 1500 }}
        columns={orderColumns}
        dataSource={list}
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
          position: ["bottomRight"],
        }}
      />
    );
  }

  const orderColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      fixed: true,
      key: "orderCode",
      render: (orderCode: any, records: any) => (
        <Button
          type="link"
          onClick={() =>
            setOrderDetails({ isOpen: true, orderId: records._id })
          }
        >
          <b>{orderCode}</b>
        </Button>
      ),
    },
    {
      title: "Người mua",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Số điện thoại",
      key: "phone",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      key: "address",
      dataIndex: "address",
    },
    {
      title: "Ngày mua",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate: any) => helpers.formatOrderDate(orderDate),
      sorter: (a: any, b: any) => {
        if (a.orderDate < b.orderDate) return -1;
        if (a.orderDate > b.orderDate) return 1;
        return 0;
      },
    },
    {
      title: "Sản phẩm",
      dataIndex: "orderProd",
      key: "orderProd",
      render: (orderProd: any, record: any) => {
        return (
          <div
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => {
              setVisibleProductModal({
                status: true,
                orderId: record?._id,
                orderCode: record?.orderCode,
              });
            }}
          >
            Xem sản phẩm
          </div>
        );
      },
    },
    {
      title: "Phí ship",
      dataIndex: "transportFee",
      key: "transportFee",
      render: (transportFee: any) => {
        return helpers.formatProductPrice(transportFee);
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (value: any, records: any) => {
        const totalPrdPrice = records?.orderProd?.reduce((pre: any, curr: any) => {
          return pre + ((curr?.unitPrice - (curr?.unitPrice * ((curr?.promo || 0) / 100))) * curr?.numOfProd)
        }, 0)
        const totalPrice = totalPrdPrice + records?.transportFee

        return helpers.formatProductPrice(totalPrice);
      },
      sorter: (item1: any, item2: any) => {
        return helpers.calTotalMoney(item1) - helpers.calTotalMoney(item2);
      },
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (paymentMethod: any) =>
        paymentMethod === "PAYMENT_ONLINE"
          ? "Thanh toán online"
          : paymentMethod === "DELIVERY"
            ? "Thanh toán tận nơi"
            : "",
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (orderStatus: any) => helpers.convertOrderStatus(orderStatus),
    },
    {
      title: "Huỷ đơn hàng",
      dataIndex: "cancelOrder",
      key: "cancelOrder",
      width: 150,
      render: (item: any, record: any) => {
        return (
          <Popconfirm
            placement="top"
            title={`Xác nhận huỷ đơn hàng`}
            onConfirm={() => handleCancelOrder(record?._id)}
            okText="Đồng ý"
            cancelText="Huỷ"
            disabled={record?.orderStatus !== 0}
          >
            <Button disabled={record?.orderStatus !== 0}>Huỷ đơn hàng</Button>
          </Popconfirm>
        );
      },
    },
  ];

  useEffect(() => {
    async function getOrderList() {
      let isSubscribe = true;
      try {
        setIsLoading(true);
        const response = await orderApi.getOrderList(user._id);
        if (response && isSubscribe) {
          const { list } = response.data;
          setOrderList(
            list.map((item: any, index: number) => {
              return {
                ...item,
                key: index,
                name: item.deliveryAdd.name,
                phone: item.deliveryAdd.phone,
                address: item.deliveryAdd.address,
              };
            })
          );
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) {
          setIsLoading(false);
          setOrderList([]);
        }
      }
    }
    if (user) getOrderList();
    return () => { };
  }, [user]);

  return (
    <>
      {isLoading ? (
        <div className="t-center m-tb-8">
          <GlobalLoading content={"Đang tải danh sách đơn hàng của bạn ..."} />
        </div>
      ) : (
        showOrderList(orderList)
      )}
      {visibleProductModal?.status && (
        <ListProductModal
          visible={visibleProductModal?.status}
          onClose={() => {
            setVisibleProductModal({
              status: false,
              orderId: -1,
              orderCode: "",
            });
          }}
          orderId={visibleProductModal?.orderId}
          orderCode={visibleProductModal?.orderCode}
        />
      )}
    </>
  );
};

export default OrderList;
