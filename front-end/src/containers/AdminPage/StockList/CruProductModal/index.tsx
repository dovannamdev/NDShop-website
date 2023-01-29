import { Col, Form, InputNumber, message, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import productApi from "../../../../apis/productApi";

type CruProductModalType = {
  visible: boolean;
  onClose: () => void;
  initProduct: any;
  handleAddProduct: (listProduct: any) => void;
  handleUpdateProduct: (listProduct: any) => void;
  modalType?: "CREATE" | "UPDATE";
};

export default function CruProductModal({
  visible,
  onClose,
  initProduct,
  handleAddProduct,
  handleUpdateProduct,
  modalType,
}: CruProductModalType) {
  const [listProduct, setListProduct] = useState([]);
  const [form] = Form.useForm();

  const getProductList = async () => {
    try {
      const res = await productApi.getAllProducts(-1, -2, "admin");
      if (res) {
        const { data } = res.data;
        const list = data.map((item: any, index: any) => {
          return { ...item, key: index };
        });
        setListProduct(list);
      }
    } catch (error) {
      message.error("Lấy danh sách sản phẩm thất bại.");
    }
  };

  useEffect(() => {
    getProductList();
  }, []);

  const onFinish = async () => {
    await form.validateFields();
    const formvalues = form.getFieldsValue();
    if (modalType === "CREATE") {
      handleAddProduct({
        ...formvalues,
        product: JSON.parse(formvalues?.product),
      });
    } else {
      handleUpdateProduct({
        ...formvalues,
        product: JSON.parse(formvalues?.product),
      });
    }
  };

  useEffect(() => {
    if (modalType === "UPDATE") {
      form.setFieldsValue({
        product: JSON.stringify(initProduct?.product),
        initQuantity: initProduct?.initQuantity,
        initPrice: initProduct?.initPrice,
      });
    }
  }, []);

  return (
    <Modal
      className="edit-product-modal"
      visible={visible}
      okText={modalType === "CREATE" ? "Thêm mới" : "Cập nhật"}
      cancelText="Huỷ bỏ"
      onCancel={() => onClose()}
      okButtonProps={{ form: "editForm", htmlType: "submit" }}
      title={
        modalType === "CREATE"
          ? "Tạo mới đơn nhập hàng"
          : "Cập nhập đơn nhập hàng"
      }
      width={900}
      maskClosable={false}
      onOk={onFinish}
    >
      <Form
        layout="vertical"
        // initialValues={}
        name="cruProductForm"
        form={form}
      >
        <Row gutter={[16, 16]} style={{paddingTop: '20px'}}>
          <Col span={24}>
            <Form.Item
              name="product"
              label="Sản phẩm"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Select
                style={{ width: "100%" }}
                options={listProduct?.map((item: any) => {
                  return {
                    value: JSON.stringify({
                      code: item?.code,
                      name: item?.name,
                    }),
                    label: item?.name,
                  };
                })}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Số lượng nhập vào"
              name="initQuantity"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                size="large"
                parser={(value: any) => value.match(/^\d+$/)}
                min={0}
                placeholder="Số lượng nhập"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Đơn giá"
              name="initPrice"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                size="large"
                min={0}
                parser={(value: any) => value.match(/^\d+$/)}
                placeholder="Nhập vào đơn giá"
              />
            </Form.Item>
          </Col>
          <div style={{ height: "150px" }} />
        </Row>
      </Form>
    </Modal>
  );
}
