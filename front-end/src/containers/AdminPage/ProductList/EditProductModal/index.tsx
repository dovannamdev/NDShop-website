import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import adminApi from "../../../../apis/adminApi";
import brandApi from "../../../../apis/brandApi";

const EditProductModal = (props: any) => {
  const { visible, onClose, product, updateField } = props;

  const [isUpdating, setIsUpdating] = useState(false);
  // danh sách thương hiệu
  const [listBrand, setListBrand] = useState([]);

  const getBrandList = async () => {
    try {
      const brand = await brandApi.getBrandList();
      if (brand?.data?.data) {
        setListBrand(brand?.data?.data);
      }
    } catch (error) {
      console.log("get brandList error >>>> ", error);
    }
  };

  useEffect(() => {
    getBrandList();
  }, []);

  const onFinish = async (value: any) => {
    try {
      setIsUpdating(true);
      const response = await adminApi.updateProduct(value);
      if (response?.data?.success) {
        message.success("Cập nhật thành công");
        setIsUpdating(false);
        onClose();
        updateField({
          ...value,
          brandName:
            (
              listBrand?.find(
                (item: any) => item?._id === value?.brandId
              ) as any
            )?.brandName || "",
        });
      }
    } catch (error) {
      setIsUpdating(false);
      message.error("Cập nhật thất bại");
    }
  };
  return (
    <Modal
      className="edit-product-modal"
      visible={visible}
      okText="Cập nhật"
      cancelText="Huỷ bỏ"
      onCancel={onClose}
      okButtonProps={{ form: "editForm", htmlType: "submit" }}
      title="Chỉnh sửa thông tin sản phẩm"
      confirmLoading={isUpdating}
      width={1000}
    >
      <Form
        layout="vertical"
        initialValues={product}
        name="editForm"
        onFinish={onFinish}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã sản phẩm"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Mã sản phẩm *" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Tên sản phẩm *" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="brandId"
              label="Thương hiệu"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Select size="large" placeholder="Chọn thương hiệu">
                {listBrand?.map((item: any, index: number) => (
                  <Select.Option value={item?._id} key={index}>
                    {item?.brandName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="price"
              rules={[{ required: true, message: "Bắt buộc" }]}
              label={`Giá bán ra`}
            >
              <InputNumber
                style={{ width: "100%" }}
                step={1}
                size="large"
                parser={(value: any) => value.match(/^\d+$/)}
                min={0}
                placeholder="Giá bán ra"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="discount"
              rules={[{ required: true, message: "Bắt buộc" }]}
              label={`Khuyến mãi`}
            >
              <InputNumber
                style={{ width: "100%" }}
                step={1}
                size="large"
                parser={(value: any) => value.match(/^\d+$/)}
                min={0}
                placeholder="Khuyến mãi"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
