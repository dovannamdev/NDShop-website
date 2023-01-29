import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Col, message, Row, Tooltip } from "antd";
import { FastField, Formik, Form } from "formik";
import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import InputField from "../../components/Custom/InputField";
import constants from "../../constants";
import accountApi from "../../apis/accountApi";
import DatePickerField from "../../components/Custom/DatePickerField";
import SelectField from "../../components/Custom/SelectField";
import "./index.scss";

const SignUp = () => {
  const navigate = useNavigate();

  const [isRedirectLogin, setIsRedirectLogin] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // giá trọ khởi tạo cho formik
  const initialValue = {
    email: "",
    // verifyCode: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    address: "",
    // gender: null,
    phone: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().trim().required("* Email bạn là gì ?").email(),
    fullName: Yup.string()
      .trim()
      .required("* Tên bạn là gì ?")
      .matches(
        /[^~!@#%\^&\*()_\+-=\|\\,\.\/\[\]{}'"`]/,
        "* Không được chứa ký tự đặc biệt"
      )
      .max(70, "* Tối đa 70 ký tự"),
    password: Yup.string()
      .trim()
      .required("* Mật khẩu của bạn là gì ?")
      .min(6, "* Mật khẩu ít nhất 6 ký tự")
      .max(20, "* Mật khẩu tối đa 20 ký tự")
      .matches(
        /^(?=.*[A-Z])(?=.*[~!@#%\^&\*()_\+-=\|\\,\.\/\[\]{}'"`])(?=.*[0-9])(?=.*[a-z]).{6,}$/,
        "Mật khẩu chứa chữ hoa,chữ thường và số"
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "* Mật khẩu chưa trùng khớp"
    ),
    // birthday: Yup.date()
    //   .notRequired()
    //   .min(new Date(1900, 1, 1), "* Năm sinh từ 1900")
    //   .max(
    //     new Date(
    //       new Date().getFullYear() - parseInt(constants.MIN_AGE.toString()),
    //       1,
    //       1
    //     ),
    //     `* Tuổi tối thiểu là ${constants.MIN_AGE}`
    //   ),
    // gender: Yup.boolean().required("* Giới tính của bạn"),
    address: Yup.string().trim().max(100, "* Tối đa 100 ký tự"),
    phone: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Số điện thoại gồm 10 số")
      .max(10, "Số điện thoại gồm 10 số"),
  });

  const onSignUp = async (account: any) => {
    try {
      setIsSubmitting(true);
      const result = await accountApi.postSignUp({ account });
      if (result.status === 200) {
        message.success("Đăng ký thành công.", 1);
        setIsSubmitting(false);
        setIsRedirectLogin(true);
      }
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("Đăng ký thất bại, thử lại");
      }
    }
  };
  return (
    <div className="SignUp container">
      {isRedirectLogin && (
        // <Delay wait={constants.DELAY_TIME}>
        <Navigate to={constants.ROUTES.LOGIN} />
        // </Delay>
      )}

      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={onSignUp}
      >
        {(formikProps: any) => {
          return (
            <Form className="bg-form m-tb-40">
              <Row
                className="input-border p-t-30 p-b-30 m-lr-0"
                gutter={[64, 32]}
              >
                <Col className="bg-head" span={24}>
                  <div className="bg-header">ĐĂNG KÝ TÀI KHOẢN</div>
                </Col>

                <Col className="p-b-0" span={24}>
                  <Row gutter={[0, 16]}>
                    <Col span={24}>
                      {/* email field */}
                      <FastField
                        name="email"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Email *"
                        size="large"
                      />
                    </Col>
                  
                    <Col span={24}>
                      {/* password field */}
                      <FastField
                        name="password"
                        component={InputField}
                        className="input-form-common"
                        type="password"
                        placeholder="Mật khẩu *"
                        size="large"
                        autocomplete="on"
                        iconRender={(visible: boolean) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </Col>
                    <Col span={24}>
                      {/* confirm password field */}
                      <FastField
                        name="confirmPassword"
                        component={InputField}
                        className="input-form-common"
                        type="password"
                        placeholder="Xác nhận mật khẩu *"
                        size="large"
                        iconRender={(visible: boolean) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </Col>

                    <Col span={24}>
                      {/* full name filed */}
                      <FastField
                        name="fullName"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Họ và tên *"
                        size="large"
                      />
                    </Col>
                    <Col span={24}>
                      {/* full name filed */}
                      <FastField
                        name="phone"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Số điện thoại"
                        size="large"
                      />
                    </Col>
                    {/* <Col span={24}>
                      <FastField
                        className="input-form-common"
                        name="birthday"
                        component={DatePickerField}
                        placeholder="Ngày sinh"
                        size="large"
                      />
                    </Col> */}
                    {/* <Col span={24}>
                      <FastField
                        className="input-form-common gender-field"
                        size="large"
                        name="gender"
                        component={SelectField}
                        placeholder="Giới tính *"
                        options={constants.GENDER_OPTIONS}
                      />
                    </Col> */}
                    <Col span={24}>
                      {/* address filed */}
                      <FastField
                        name="address"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Địa chỉ"
                        size="large"
                      />
                    </Col>
                  </Row>
                </Col>

                {/* Button submit */}
                <Col className="p-t-8 p-b-0 t-center" span={24}>
                  <Button
                    className="SignUp-submit-btn w-100"
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    Đăng Ký
                  </Button>
                </Col>

                <Col span={24} className="p-t-0 t-center">
                  <div className="m-t-10 font-weight-500">
                    Bạn đã có tài khoản ?
                    <Link to={constants.ROUTES.LOGIN}>&nbsp;Đăng nhập</Link>
                  </div>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default SignUp;
