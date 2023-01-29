import PropTypes from "prop-types";
import React from "react";
import { Form, Input, Button, Checkbox, message, Row, Col } from "antd";
import adminApi from "../../../apis/adminApi";

const Login = (props: any) => {
  const { onLogin } = props;

  const onFinish = async (account: any) => {
    try {
      const response = await adminApi.postLogin(account);

      if (response) {
        message.success("Đăng nhập thành công", 2);
        onLogin(true, response.data);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Tài khoản không tồn tại hoặc sai mật khẩu", 2);
      onLogin(false);
    }
  };

  return (
    <Form name="form" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="Tên đăng nhập"
            name="userName"
            rules={[{ required: true, message: "Vui lòng nhập vào tên đăng nhập!" }]}
            labelCol={{xs: 5}}
            labelAlign={'left'}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập vào mật khẩu!" }]}
            labelCol={{xs: 5}}
            labelAlign={'left'}
          >
            <Input.Password />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item>
            <Button
              size="large"
              className="w-100 m-t-8"
              htmlType="submit"
              type="primary"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Login;
