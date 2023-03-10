import React, { useEffect, useState } from "react";
import { Button, Card, Drawer, message, Select, Table, Tag } from "antd";
import orderApi from "../../../../apis/orderApi";
import helpers from "../../../../helpers";
import adminApi from "../../../../apis/adminApi";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import constants, { FORMAT_NUMBER } from "../../../../constants";

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
  const [listAdmin, setListAdmin] = useState([]);
  const [isUpdateShipper, setIsUpdateShipper] = useState(false);
  const [orderShipperChange, setOrderShipperChange] = useState("");

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

  const getListReceiver = async () => {
    try {
      const result = await adminApi.getListAdminAccount(true, "Shipper", true);
      if (result?.data?.payload) {
        setListAdmin(result?.data?.payload);
      }
    } catch (error) {
      console.log("get list receiver error >>> ", error);
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
    getDeliveryHistoryList();
  }, [orderDetail?.deliveryId]);

  useEffect(() => {
    getOrderDetail();
    getListReceiver();
  }, []);

  const orderHistoryColumns = [
    {
      title: "Ng??y c???p nh???t",
      key: "createdDate",
      dataIndex: "createdDate",
      render: (item: any) => helpers?.dateTimeConverter(item),
    },
    {
      title: "Tr???ng th??i",
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
      title: "T??n s???n ph???m",
      dataIndex: "name",
      key: "name",
      render: (orderCode: any, records: any) => <div>{records?.name}</div>,
    },
    {
      title: "S??? l?????ng",
      dataIndex: "numOfProd",
      key: "numOfProd",
      render: (value: any) => FORMAT_NUMBER.format(value),
      sorter: (a: any, b: any) => {
        return a.numOfProd - b.numOfProd;
      },
    },
    {
      title: "Gi?? s???n ph???m",
      dataIndex: "price",
      key: "price",
      sorter: (a: any, b: any) => {
        return a.unitPrice - b.unitPrice;
      },
      render: (orderCode: any, records: any) => (
        <div>{helpers.formatProductPrice(records?.unitPrice)}</div>
      ),
    },
    {
      title: "Ph???n tr??m gi???m",
      dataIndex: "promo",
      key: "promo",
      sorter: (a: any, b: any) => {
        return a.promo - b.promo;
      },
    },
    {
      title: "T???ng",
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

  const changeOrderShipper = async () => {
    try {
      if (orderShipperChange) {
        const result = await orderApi.changeOrderDeliveryShipper(
          orderId,
          orderShipperChange
        );
        if (result?.data?.success) {
          setOrderDetail({
            ...orderDetail,
            shipper: orderShipperChange,
            shipperName:
              (
                listAdmin?.find(
                  (it: any) => it?._id === orderShipperChange
                ) as any
              )?.fullName || "",
          });
          setIsUpdateShipper(false);
          return message.success("C???p nh???t th??nh c??ng");
        }
        setIsUpdateShipper(false);
        message.error("C???p nh???t th???t b???i");
      }else {
        setIsUpdateShipper(false);
      }
    } catch (error) {
      setIsUpdateShipper(false);
      message.error("C???p nh???t th???t b???i");
    }
  };

  return (
    <>
      <Drawer
        title="Th??ng tin giao h??ng"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={1000}
      >
        <Card title="Th??ng tin kh??ch h??ng">
          <Card.Grid style={gridStyle}>
            <div>T??n kh??ch h??ng</div>
            <div>{orderDetail?.name}</div>
          </Card.Grid>
          <Card.Grid hoverable={false} style={gridStyle}>
            <div>S??? ??i???n tho???i</div>
            <div>{orderDetail?.clientPhone}</div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div>?????a ch???</div>
            <div>{orderDetail?.clientAddress}</div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div>Ph????ng th???c thanh to??n</div>
            <div>
              {orderDetail?.paymentMethod === "DELIVERY"
                ? "Thu ti???n khi l???y h??ng"
                : "Chuy???n kho???n"}
            </div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div>T???ng ????n h??ng</div>
            <div>{calTotalOrderMoney(orderDetail)}</div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div>Ti???n ship</div>
            <div>{helpers.formatProductPrice(orderDetail?.transportFee)}</div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div>Tr???ng th??i ????n h??ng</div>
            <div>
              <Tag color="green">
                {(
                  constants?.DELIVERY_STATUS?.find(
                    (it: any) => it?.value === orderDetail?.deliveryStatus
                  ) as any
                )?.label || "????n h??ng ch??a x??? l??"}
              </Tag>
            </div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div>Ng?????i giao h??ng</div>
            <div>
              <div>
                {!isUpdateShipper ? (
                  orderDetail?.shipperName || "Ch??a ph??n c??ng"
                ) : (
                  <Select
                    style={{ width: "90%" }}
                    options={listAdmin?.map((item: any) => {
                      return {
                        value: item?._id,
                        label: item?.fullName,
                      };
                    })}
                    onChange={(value) => setOrderShipperChange(value)}
                  />
                )}
              </div>
              <div>
                {!isUpdateShipper ? (
                  <Button
                    color="blue"
                    type="text"
                    icon={
                      <EditOutlined color="blue" style={{ color: "blue" }} />
                    }
                    onClick={() => setIsUpdateShipper(true)}
                    disabled={
                      orderDetail?.deliveryStatus ||
                      orderDetail?.orderStatus === 6 ||
                      orderDetail?.orderStatus === 3
                    }
                  ></Button>
                ) : (
                  <Button
                    color="green"
                    type="text"
                    icon={
                      <CheckOutlined color="green" style={{ color: "green" }} />
                    }
                    onClick={() => changeOrderShipper()}
                  ></Button>
                )}
              </div>
            </div>
          </Card.Grid>
        </Card>

        <Card title="L???ch s??? ????n h??ng">
          <Table
            dataSource={orderHistoryList}
            columns={orderHistoryColumns}
          ></Table>
        </Card>

        <Card title="Danh s??ch s???n ph???m">
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
