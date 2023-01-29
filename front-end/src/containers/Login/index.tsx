import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Col, message, Row } from "antd";
import { FastField, Form, Formik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import InputField from "../../components/Custom/InputField";
import { Link, Navigate, useNavigate } from "react-router-dom";
import constants from "../../constants";
import CheckboxField from "../../components/Custom/CheckboxField";
import "./styles.scss";
import { setUser } from "../../reducers/userSlice";
import accountApi from "../../apis/accountApi";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisableLogin, setIsDisableLogin] = useState(false);
  const [isnavigateLogin, setNavigateLogin] = useState(false);
  const navigate = useNavigate();
  const windowWidth = window.screen.width;
  const dispatch = useDispatch();

  // giá trọ khởi tạo cho formik
  const initialValues = {
    email: "",
    password: "",
    keepLogin: false,
  };

  // fn: xử lý khi đăng nhập thành công
  const onLoginSuccess = async (data: any, account: any) => {
    const { email, keepLogin } = account;
    try {
      setIsSubmitting(false);
      message.success("Đăng nhập thành công");
      data.user = { ...data.user, email, keepLogin };
      dispatch(setUser(data?.user));
      setNavigateLogin(true);
    } catch (error) {
      message.error("Lỗi đăng nhập");
    }
  };

  const onLogin = async (account: any) => {
    try {
      setIsSubmitting(true);
      const result = await accountApi.postLogin({ account });
      if (result.status === 200) {
        sessionStorage.setItem(
          constants.SSSTORAGE_USER,
          JSON.stringify({ ...result?.data?.user, email: account?.email })
        );
        onLoginSuccess(result.data, account);
      }
    } catch (error: any) {
      setIsSubmitting(false);
      message.error(error?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  // validate form trước submit với yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("* Email bạn là gì ?")
      .email("* Email không hợp lệ !"),
    password: Yup.string().trim().required("* Mật khẩu của bạn là gì ?"),
  });
  return (
    <>
      {isnavigateLogin ? (
        <Navigate to={constants.ROUTES.HOME} />
      ) : (
        <div className="Login container">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onLogin}
          >
            {(formitProps: any) => {
              return (
                <Form className="bg-form m-tb-40">
                  <Row
                    className="input-border m-lr-0 p-tb-20"
                    gutter={[40, 24]}
                    justify="center"
                  >
                    <Col span={24} className="bg-head">
                      <div className="login-title m-tb-20 t-center bg-header">
                        ĐĂNG NHẬP
                      </div>
                    </Col>
                    <Col span={24} className="">
                      <FastField
                        name="email"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Email *"
                        size="large"
                      />
                    </Col>
                    <Col span={24}>
                      <FastField
                        name="password"
                        component={InputField}
                        className="input-form-common"
                        type="password"
                        placeholder="Mật khẩu *"
                        size="large"
                        autocomplete="on"
                        iconRender={(visible: any) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </Col>
                    <Col span={24}>
                      <div className="d-flex justify-content-between">
                        <FastField name="keepLogin" component={CheckboxField}>
                          <b>Duy trì đăng nhập</b>
                        </FastField>
                        <Link
                          to={constants.ROUTES.FORGOT_PASSWORD}
                          style={{ color: "#50aaff" }}
                        >
                          <b>Quên mật khẩu ?</b>
                        </Link>
                      </div>
                    </Col>
                    {/* Button submit */}
                    <Col className="p-t-8 p-b-0 t-center" span={24}>
                      <Button
                        className="Login-submit-btn w-100"
                        size="large"
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                      >
                        Đăng nhập
                      </Button>
                    </Col>
                    <Col span={24} className="p-t-0 t-center">
                      <div className="m-t-10 font-weight-500">
                        Bạn chưa có tài khoản ?
                        <Link to={constants.ROUTES.SIGNUP}>&nbsp;Đăng ký</Link>
                      </div>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </div>
      )}
    </>
  );
};
export default Login;
