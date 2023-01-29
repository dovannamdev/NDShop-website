import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import adminApi from "../../../../apis/adminApi";
import roleApi from "../../../../apis/roleApi";
import stockApi from "../../../../apis/stockApi";
import constants, { FORMAT_NUMBER } from "../../../../constants";
import helpers from "../../../../helpers";
import CruProductModal from "../CruProductModal";

type ControlStockModalType = {
  visible: boolean;
  onClose: () => void;
  role?: any;
  type: "CREATE" | "UPDATE" | "DELETE";
  reloadPage: () => void;
  handleUpdateField: (id: any, receiver: any, receiverName: any) => void;
  stockData: any;
};

export default function ControlStockModal({
  visible,
  onClose,
  role,
  type,
  reloadPage,
  handleUpdateField,
  stockData,
}: ControlStockModalType) {
  const [isLoading, setIsLoading] = useState(false);
  const [listAdmin, setListAdmin] = useState([]);
  const [visibleCruProductModal, setVisibleCruProductModal] = useState({
    visible: false,
    product: {},
    type: "",
  });
  const [stockProduct, setStockProduct] = useState([]);
  const [allAccount, setAllAccount] = useState([]);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (item: any, record: any, index: number) => index + 1,
    },
    {
      title: "Mã sản phẩm",
      key: "code",
      dataIndex: "code",
      render: (item: any, record: any) => record?.product?.code,
    },
    {
      title: "Tên sản phẩm",
      key: "productName",
      dataIndex: "productName",
      render: (item: any, record: any) => record?.product?.name,
    },
    {
      title: "Số lượng nhập",
      key: "initQuantity",
      dataIndex: "initQuantity",
      render: (value: any) => FORMAT_NUMBER.format(value),
      sorter: (a: any, b: any) => {
        return a.initQuantity - b.initQuantity;
      },
    },
    {
      title: "Giá nhập vào",
      key: "initPrice",
      dataIndex: "initPrice",
      render: (value: any) => helpers.formatProductPrice(value),
      sorter: (a: any, b: any) => {
        return a.initPrice - b.initPrice;
      },
    },
    {
      title: "Hành động",
      render: (item: any, record: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {!record?.canNotEdit ? (
            <Tooltip title="Sửa sản phẩm" placement="bottom">
              <EditOutlined
                className="m-r-8 action-btn-product font-size-18px m-r-10"
                style={{ color: "#30CFD0 " }}
                onClick={() => {
                  setVisibleCruProductModal({
                    visible: true,
                    product: { ...record },
                    type: "UPDATE",
                  });
                }}
              />
            </Tooltip>
          ) : (
            <></>
          )}
          <Tooltip title="Xóa sản phẩm" placement="bottom">
            <DeleteOutlined
              className="m-r-8 action-btn-product font-size-18px"
              style={{ color: "red" }}
              onClick={async () => {
                if (type === "UPDATE") {
                  try {
                    const stockPrd = await stockApi.deleteStockProduct(
                      stockData?._id,
                      record?.product?.code
                    );

                    if (stockPrd?.data?.success) {
                      const currPrd = [...stockProduct];
                      const newPrd = [...currPrd]?.filter(
                        (item: any) =>
                          item?.product?.code !== record?.product?.code
                      );
                      return setStockProduct(newPrd);
                    }
                    return message.error(
                      "Sản phẩm đang có đơn đặt hàng, không thể xoá"
                    );
                  } catch (error) {
                    return message.error(
                      "Sản phẩm đang có đơn đặt hàng, không thể xoá"
                    );
                  }
                } else {
                  const currPrd = [...stockProduct];
                  const newPrd = [...currPrd]?.filter(
                    (item: any) => item?.product?.code !== record?.product?.code
                  );
                  setStockProduct(newPrd);
                }
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const getListReceiver = async () => {
    try {
      const result = await adminApi.getListAdminAccount(true, "Manager");
      if (result?.data?.payload) {
        setListAdmin(
          result?.data?.payload?.filter((item: any) => item?.status)
        );
        setAllAccount(result?.data?.payload);
      }
    } catch (error) {
      console.log("get list receiver error >>> ", error);
    }
  };

  useEffect(() => {
    getListReceiver();
  }, []);

  useEffect(() => {
    if (type === "UPDATE" && stockData?._id) {
      (async () => {
        const result = await stockApi.getStockDetail(stockData?._id);
        if (result?.data?.success) {
          setStockProduct(
            result?.data?.payload?.map((item: any) => {
              return {
                ...item,
                product: {
                  code: item?.productCode,
                  name: item?.productName,
                },
                canNotEdit: true,
              };
            })
          );
        }
        form.setFieldsValue({
          receiver:
            (
              allAccount?.find(
                (item: any) => item?._id === stockData?.receiver
              ) as any
            )?.fullName || stockData?.receiver,
        });
      })();
    }
  }, [allAccount]);

  const onFinish = async (value: any) => {
    await form.validateFields();
    setIsLoading(true);
    try {
      const receiver =
        typeof form.getFieldValue("receiver") === "string"
          ? stockData?.receiver
          : form.getFieldValue("receiver");

      if (type === "CREATE") {
        const result = await stockApi.createNewStockData({
          receiver: receiver,
          product: stockProduct,
        });
        if (result?.data?.success) {
          message.success("Thêm mới thành công");
          onClose();
          reloadPage();
        } else {
          message.error("Thêm mới thất bại");
        }
      }

      if (type === "UPDATE") {
        await stockApi.updateStockData(
          {
            receiver: receiver,
            product: stockProduct,
          },
          stockData?._id
        );
        message.success("Cập nhật thành công");
        onClose();
        handleUpdateField(
          stockData?._id,
          receiver,
          (allAccount?.find((item: any) => item?._id === receiver) as any)
            ?.fullName
        );
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Xử lí tác vụ thất bại");
    }
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        className="edit-product-modal"
        visible={visible}
        okText={type === "CREATE" ? "Thêm mới" : "Cập nhật"}
        cancelText="Huỷ bỏ"
        onCancel={() => onClose()}
        okButtonProps={{ form: "editForm", htmlType: "submit" }}
        title={
          type === "CREATE" ? "Tạo mới đơn nhập hàng" : "Cập nhập đơn nhập hàng"
        }
        confirmLoading={isLoading}
        width={900}
        onOk={onFinish}
      >
        <Form
          layout="vertical"
          // initialValues={}
          name="editForm"
          form={form}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="receiver"
                label="Người nhận"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Select
                  style={{ width: "90%" }}
                  options={listAdmin?.map((item: any) => {
                    return {
                      value: item?._id,
                      label: item?.fullName,
                    };
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="d-flex btn-add-product">
                <Button
                  onClick={() => {
                    setVisibleCruProductModal({
                      visible: true,
                      product: {},
                      type: "CREATE",
                    });
                  }}
                  type="primary"
                  className="m-b-20 m-t-10"
                  style={{ marginLeft: "auto" }}
                >
                  <PlusOutlined className="action-btn-product" />
                  Thêm sản phẩm vào đơn
                </Button>
              </div>
              <Table columns={columns} dataSource={stockProduct} />
            </Col>
          </Row>
        </Form>
      </Modal>

      {visibleCruProductModal?.visible ? (
        <CruProductModal
          visible={visibleCruProductModal?.visible}
          handleAddProduct={(listProduct: any) => {
            const currPrd: any = [...stockProduct];
            const findPrd = currPrd?.find(
              (item: any) => item?.product?.code === listProduct?.product?.code
            );
            if (!findPrd) {
              currPrd.push(listProduct);
              setStockProduct(currPrd);
              message.success("Đã thêm vào danh sách");
              return setVisibleCruProductModal({
                visible: false,
                product: {},
                type: "",
              });
            }
            return message.error("Sản phẩm đã tồn tại trong danh sách");
          }}
          handleUpdateProduct={(listProduct: any) => {
            const currPrd: any = [...stockProduct];
            const findPrd = currPrd?.find(
              (item: any) =>
                item?.product?.code !==
                  (visibleCruProductModal?.product as any)?.product?.code &&
                item?.product?.code === listProduct?.product?.code
            );

            if (!findPrd) {
              const newPrd: any = [...stockProduct]?.map((item: any) => {
                if (
                  item?.product?.code ===
                  (visibleCruProductModal?.product as any)?.product?.code
                ) {
                  return listProduct;
                }
                return item;
              });
              setStockProduct(newPrd);
              return setVisibleCruProductModal({
                visible: false,
                product: {},
                type: "",
              });
            }
            return message.error("Sản phẩm đã tồn tại trong danh sách");
          }}
          onClose={() =>
            setVisibleCruProductModal({ visible: false, product: {}, type: "" })
          }
          modalType={visibleCruProductModal.type as "CREATE" | "UPDATE"}
          initProduct={visibleCruProductModal?.product}
        />
      ) : (
        <></>
      )}
    </>
  );
}
