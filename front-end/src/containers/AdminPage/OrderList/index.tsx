import {
  Button,
  message,
  Modal,
  Popconfirm,
  Radio,
  Table,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import adminApi from "../../../apis/adminApi";
import orderApi from "../../../apis/orderApi";
import GlobalLoading from "../../../components/GlobalLoading";
import helpers from "../../../helpers";
import DeliveryDrawer from "./components/DeliveryDrawer";
import ListProductModal from "./components/ListProductModal";

const generateFilterOrder = () => {
  let result = [];
  for (let i = 1; i < 5; i++) {
    result.push({ value: i, text: helpers.convertOrderStatus(i) });
  }
  return result;
};

const filterOrder = () => {
  let result = [];
  for (let i = 0; i < 7; i++) {
    result.push({ value: i, text: helpers.convertOrderStatus(i) });
  }
  return result;
};



const OrderList = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleProductModal, setVisibleProductModal] = useState({
    status: false,
    orderId: -1,
    orderCode: "",
  });
  const orderRole = useMemo(() => {
    const role = helpers.getFunctionRole("order_list");
    return role;
  }, []);
  const [filterOrderStatus, setFilterOrderStatus] = useState(1);
  const [visibleDeliveryDrawer, setVisibleDeliveryDrawer] = useState({
    status: false,
    orderId: -1,
  });

  useEffect(() => {
    async function getOrderList() {
      try {
        setIsLoading(true);
        const response = await adminApi.getOrderList(filterOrderStatus);
        if (response) {
          const { list } = response.data;
          const newList = list.map((item: any, index: any) => {
            return {
              ...item,
              key: index,
              name: item.deliveryAdd.name,
              phone: item.deliveryAdd.phone,
              address: item.deliveryAdd.address,
              orderCode: item.orderCode,
              orderDate: helpers.formatOrderDate(item.orderDate),
              prodName: item.orderProd.name,
              totalMoney: item?.totalMoney,
              orderStatus: item.orderStatus,
              idProduct: item.orderProd.id,
              transportFee: item?.transportFee,
              discountPrice: item?.discountPrice,
              orderId: item._id,
            };
          });
          setData(newList);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
    getOrderList();
  }, [filterOrderStatus]);

  const handleCancelOrder = async (orderId: any) => {
    try {
      const cancelResult = await orderApi.cancelOrder(orderId, 5);
      if (cancelResult?.data?.success) {
        const currData = [...data]?.filter((item) => item?._id !== orderId);
        setData(currData);
        return message.success("Huỷ đơn hàng thành công");
      }
      return message.error("Huỷ đơn hàng thất bại");
    } catch (error) {
      message.error("Huỷ đơn hàng thất bại");
    }
  };

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
      key: "phone",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      key: "address",
      dataIndex: "address",
      width: "250px",
    },
    {
      title: "Ngày đặt",
      key: "orderDate",
      dataIndex: "orderDate",
      sorter: (a: any, b: any) => {
        if (a.orderDate > b.orderDate) return 1;
        if (a.orderDate < b.orderDate) return -1;
        return 0;
      },
    },
    {
      title: "Sản phẩm",
      key: "prodName",
      dataIndex: "prodName",
      width: "200px",
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
      title: "Phí vận chuyển",
      key: "transportFee",
      dataIndex: "transportFee",
      width: "150px",
      sorter: (a: any, b: any) => {
        return a.transportFee - b.transportFee
      },
      render: (value: any, record: any) => {
        return (
          <b style={{ color: "#333" }}>{helpers.formatProductPrice(value)}</b>
        );
      },
    },
    {
      title: "Tổng tiền",
      key: "totalMoney",
      dataIndex: "totalMoney",
      sorter: (a: any, b: any) => {
        const calTotalPrice = (item: any) => {
          const totalPrdPrice = item?.orderProd?.reduce(
            (pre: any, curr: any) => {
              return (
                pre +
                (curr?.unitPrice - curr?.unitPrice * ((curr?.promo || 0) / 100)) *
                curr?.numOfProd
              );
            },
            0
          );
          const totalPrice = totalPrdPrice + item?.transportFee;
          return totalPrice
        }
        

        return calTotalPrice(a) - calTotalPrice(b)
      },
      width: "150px",
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
      title: "Trạng thái đơn hàng",
      key: "orderStatus",
      dataIndex: "orderStatus",
      width: "300px",
      filters: filterOrderStatus === 1 ? filterOrder() : [],
      onFilter: (value: any, record: any) => record.orderStatus === value,
      render: (value: any) => helpers.convertOrderStatus(value),
    },
    {
      title: "Hành động",
      width: "350px",
      textAlign: "center",
      render: (record: any, allData: any) => (
        <>
          {filterOrderStatus === 1 ? (
            <>
              <Button
                disabled={
                  record.orderStatus === 2 ||
                  record.orderStatus === 3 ||
                  record.orderStatus === 4 ||
                  record.orderStatus === 6
                }
                type="primary"
                onClick={() => {
                  if (orderRole?.indexOf("update") < 0) {
                    return message.error(
                      "Bạn không có quyền cập nhật đơn hàng"
                    );
                  }

                  updateOrderStatusModal(
                    record.orderStatus,
                    record.orderCode,
                    record.orderId
                  );
                }}
              >
                Cập nhật
              </Button>
              {record.orderStatus > 0 ? (
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
                  Giao hàng
                </Button>
              ) : (
                <></>
              )}
            </>
          ) : (
            <Popconfirm
              placement="top"
              title={"Xác nhận huỷ đơn hàng"}
              onConfirm={() => handleCancelOrder(allData?._id)}
              okText="Xác nhận"
              cancelText="Huỷ"
            >
              <Button type="primary">Xác nhận huỷ</Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  const updateOrderStatusModal = (
    defaultVal = 0,
    orderCode: any,
    orderId: any
  ) => {
    let valueCurr = defaultVal;
    const modal = Modal.confirm({
      title: `Cập nhật trạng thái đơn hàng ${orderCode}`,
      okText: "Cập nhật",
      cancelText: "Hủy",
      content: (
        <Radio.Group
          defaultValue={defaultVal}
          onChange={(v) => (valueCurr = v.target.value)}
          className="m-t-12"
        >
          {generateFilterOrder().map((item: any, index: any) => (
            <Radio
              value={item.value}
              key={item.value}
              style={{ width: "100%" }}
              disabled={
                defaultVal === 3 ||
                  defaultVal === 4 ||
                  (item?.value === 4 && defaultVal === 2) ||
                  (item?.value === 4 && (defaultVal === 1 || defaultVal === 0)) ||
                  (defaultVal === 0 && item?.value > 1) ||
                  item?.value === 2
                  ? true
                  : item.value < defaultVal
              }
            >
              {item.text}
            </Radio>
          ))}
        </Radio.Group>
      ),
      okButtonProps: {
        disabled: defaultVal === 2 || defaultVal === 3 || defaultVal === 4 || defaultVal === 6,
      },
      onOk() {
        updateOrderStatus(orderId, valueCurr);
        modal.destroy();
      },
      onCancel() {
        modal.destroy();
      },
    });
  };

  const updateOrderStatus = async (id: any, orderStatus: any) => {
    try {
      let response: any = false;

      if (Number(orderStatus) === 3 || Number(orderStatus) === 4) {
        response = await orderApi.cancelOrder(id, orderStatus);
      } else {
        response = await adminApi.postUpdateOrderStatus(id, orderStatus);
      }

      if (response) {
        message.success("Cập nhật thành công");
        setData(
          data.map((item: any) =>
            item.orderId !== id ? { ...item } : { ...item, orderStatus }
          )
        );
      }
    } catch (error) {
      message.success("Cập nhật thất bại");
    }
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading content={"Đang lấy danh sách đơn hàng ..."} />
      ) : (
        <div style={{ padding: "10px" }}>
          <div style={{ margin: "15px", display: "flex" }}>
            <div>
              <Button
                type={filterOrderStatus !== 1 ? "default" : "primary"}
                onClick={() => {
                  if (filterOrderStatus !== 1) setFilterOrderStatus(1);
                }}
              >
                Đơn hàng đang hoạt động
              </Button>
            </div>
            <div style={{ marginLeft: "15px" }}>
              <Button
                type={filterOrderStatus !== 2 ? "default" : "primary"}
                onClick={() => {
                  if (filterOrderStatus !== 2) setFilterOrderStatus(2);
                }}
              >
                Đơn hàng chờ duyệt huỷ
              </Button>
            </div>
          </div>
          <div style={{ width: "calc(100vw - 250px)" }}>
            <Table
              dataSource={data}
              columns={columns}
              scroll={{ x: 2000 }}
            ></Table>
          </div>
        </div>
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

      {visibleDeliveryDrawer?.status && (
        <DeliveryDrawer
          visible={visibleDeliveryDrawer?.status}
          onClose={() =>
            setVisibleDeliveryDrawer({ status: false, orderId: -1 })
          }
          orderId={visibleDeliveryDrawer?.orderId}
        />
      )}
    </>
  );
};

export default OrderList;
