import React, { useEffect, useState } from "react";
import { Button, Card, Drawer, message, Select, Table, Tag } from "antd";
import orderApi from "../../../../apis/orderApi";
import helpers from "../../../../helpers";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import constants from "../../../../constants";

type DeliveryDrawerType = {
  visible: boolean;
  onClose: () => void;
  orderId: any;
};

const gridStyle: React.CSSProperties = {
  width: "25%",
  textAlign: "center",
};

const calTotalOrderMoney = (record: any) => {
  const totalPrdPrice = record?.orderProd?.reduce((pre: any, curr: any) => {
    return (
      pre +
      (curr?.unitPrice - curr?.unitPrice * ((curr?.promo || 0) / 100)) *
        curr?.numOfProd
    );
  }, 0);

  const totalPrice = totalPrdPrice + record?.transportFee;
  return (
    <b style={{ color: "#333" }}>{helpers.formatProductPrice(totalPrice)}</b>
  );
};

const DeliveryDrawer: React.FC<DeliveryDrawerType> = ({
  visible,
  onClose,
  orderId,
}) => {
  const [orderDetail, setOrderDetail] = useState<any>([]);
  const [orderHistoryList, setOrderHistoryList] = useState<any>([]);
  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const [statusChange, setStatusChange] = useState();

  const getOrderDetail = async () => {
    try {
      const odDetail = await orderApi.getOrderDetail(orderId);
      if (odDetail?.data?.success) {
        setOrderDetail(odDetail?.data?.list?.[0]);
      }
    } catch (error) {
      console.log("get order detail error >>> ", error);
    }
  };

  const getDeliveryHistoryList = async () => {
    try {
      if (orderDetail?.deliveryId) {
        const result = await orderApi.getListDeliveryStatus(
          orderDetail?.deliveryId
        );
        if (result?.data?.success) {
          setOrderHistoryList(result?.data?.payload);
        }
      }
    } catch (error) {
      console.log("getDeliveryHistoryList >>> ", error);
    }
  };

  useEffect(() => {
    getOrderDetail();
  }, []);

  useEffect(() => {
    getDeliveryHistoryList();
  }, [orderDetail]);

  const orderHistoryColumns = [
    {
      title: "Ngày cập nhật",
      key: "createdDate",
      dataIndex: "createdDate",
      render: (item: any) => helpers?.dateTimeConverter(item),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (item: any) =>
        (
          constants?.DELIVERY_STATUS?.find(
            (it: any) => it?.value === item
          ) as any
        )?.label,
    },
  ];

  const productColumns = [
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

  const changeOrderStatus = async () => {
    try {
      if (orderDetail?.orderStatus === 3 || orderDetail?.orderStatus === 4 || orderDetail?.orderStatus === 6){
        return message.error('Đơn hàng đã huỷ hoặc hoàn trả, không thể tiếp tục cập nhật trạng thái')
      }

      const result = await orderApi.changeOrderDeliveryStatus(
        orderDetail?.deliveryId,
        statusChange,
        orderId
      );
      if (result?.data?.success) {
        setOrderDetail({
          ...orderDetail,
          deliveryStatus: statusChange,
        });
        setIsUpdateStatus(false);
        return message.success("Cập nhật thành công");
      }
      setIsUpdateStatus(false);
      message.error("Cập nhật thất bại");
    } catch (error) {
      setIsUpdateStatus(false);
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <>
      <Drawer
        title="Thông tin giao hàng"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={1000}
      >
        <Card title="Thông tin khách hàng">
          <Card.Grid style={gridStyle}>
            <div>Tên khách hàng</div>
            <div>{orderDetail?.name}</div>
          </Card.Grid>
          <Card.Grid hoverable={false} style={gridStyle}>
            <div>Số điện thoại</div>
            <div>{orderDetail?.clientPhone}</div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div>Địa chỉ</div>
            <div>{orderDetail?.clientAddress}</div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div>Phương thức thanh toán</div>
            <div>
              {orderDetail?.paymentMethod === "DELIVERY"
                ? "Thu tiền khi lấy hàng"
                : "Chuyển khoản"}
            </div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div>Tổng đơn hàng</div>
            <div>{calTotalOrderMoney(orderDetail)}</div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div>Tiền ship</div>
            <div>{helpers.formatProductPrice(orderDetail?.transportFee)}</div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div>Trạng thái đơn hàng</div>
            <div>
              <div>
                {!isUpdateStatus ? (
                  <Tag color="green">
                    {(
                      constants?.DELIVERY_STATUS?.find(
                        (it: any) => it?.value === orderDetail?.deliveryStatus
                      ) as any
                    )?.label || "Đơn hàng chưa xử lí"}
                  </Tag>
                ) : (
                  <Select
                    style={{ width: "90%" }}
                    options={constants.DELIVERY_STATUS?.filter(
                      (it: any, index: any) =>
                        index + 1 > orderDetail?.deliveryStatus ||
                        !orderDetail?.deliveryStatus
                    ).map((item: any, index: any) => {
                      return {
                        value: item?.value,
                        label: item?.label,
                      };
                    })}
                    onChange={(value) => setStatusChange(value)}
                  />
                )}
              </div>
              <div>
                {!isUpdateStatus ? (
                  <Button
                    color="blue"
                    type="text"
                    icon={
                      <EditOutlined color="blue" style={{ color: "blue" }} />
                    }
                    onClick={() => {
                      if (Number(orderDetail?.deliveryStatus) < 3) {
                        setIsUpdateStatus(true);
                      }
                    }}
                    disabled={orderDetail?.deliveryStatus >= 3}
                  ></Button>
                ) : (
                  <Button
                    color="green"
                    type="text"
                    icon={
                      <CheckOutlined color="green" style={{ color: "green" }} />
                    }
                    onClick={() => changeOrderStatus()}
                  ></Button>
                )}
              </div>
            </div>
          </Card.Grid>
        </Card>

        <Card title="Lịch sử đơn hàng">
          <Table
            dataSource={orderHistoryList}
            columns={orderHistoryColumns}
          ></Table>
        </Card>

        <Card title="Danh sách sản phẩm">
          <Table
            dataSource={orderDetail?.orderProd || []}
            columns={productColumns}
          ></Table>
        </Card>
      </Drawer>
    </>
  );
};

export default DeliveryDrawer;
