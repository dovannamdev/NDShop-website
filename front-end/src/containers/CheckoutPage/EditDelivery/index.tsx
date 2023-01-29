import { Button, Col, Form, Input, Modal, Row } from "antd";

const EditDelivery = (props: any) => {
  const { isModalVisible, onModalVisible, deliveryAddress, onSetDeliveryAddress } = props;
  const onFinish = (data:any) => {
    onSetDeliveryAddress(data);
    onModalVisible();
  }

  return (
    <Modal
      visible={isModalVisible}
      closable={true}
      maskClosable={false}
      onCancel={() => {
        onModalVisible();
      }}
      width={568}
      footer={[
        <Button
          key="back"
          danger
          onClick={() => {
            onModalVisible();
          }}
        >
          Huỷ bỏ
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" form="form">
          Thêm địa chỉ
        </Button>,
      ]}
    >
      <Form onFinish={onFinish} name="form">
        <Row gutter={[32, 0]}>
          <Col span={24}>
            <h3>Thông tin người nhận hàng</h3>
            <Form.Item
              name="name"
              className="m-tb-16"
              initialValue={deliveryAddress?.name}
              rules={[
                { required: true, message: "* Bắt buộc nhập" },
                {
                  max: 40,
                  message: "Tối đa 40 ký tự",
                },
              ]}
            >
              <Input size="middle" placeholder="Họ tên *" maxLength={60} />
            </Form.Item>
            <Form.Item
              name="phone"
              initialValue={deliveryAddress?.phone}
              rules={[
                { required: true, message: "* Bắt buộc nhập" },
                {
                  validator: (_, value) =>
                    /0\d{0,9}/gi.test(value)
                      ? Promise.resolve()
                      : Promise.reject("Số điện thoại không hợp lệ"),
                },
                {
                  max: 10,
                  message: "Số điện thoại bao gồm 10 số",
                },
                {
                  min: 10,
                  message: "Số điện thoại bao gồm 10 số",
                },
              ]}
            >
              <Input
                size="middle"
                placeholder="Số điện thoại *"
                maxLength={12}
              />
            </Form.Item>
            <Form.Item
              initialValue={deliveryAddress?.address}
              className="m-tb-16"
              name="address"
              rules={[{ required: true, message: "* Bắt buộc nhập" }]}
            >
              <Input size="middle" placeholder="Địa chỉ *" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditDelivery;
