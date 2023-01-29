import {
  EditOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
  Upload,
} from "antd";
import Compressor from "compressorjs";
import { useEffect, useRef, useState } from "react";
import adminApi from "../../../../apis/adminApi";
import brandApi from "../../../../apis/brandApi";
import productApi from "../../../../apis/productApi";
import constants from "../../../../constants";
import ProductDetail from "../ProductDetailModal";
const suffixColor = "#aaa";

const AddProductModal = (props: any) => {
  const { visible, onClose, loadProductList } = props;
  const [isLoading, setIsLoading] = useState(false);
  // avt file chưa nén
  const [avtFileList, setAvtFileList] = useState([]);
  // avt đã nén
  const [avatar, setAvatar] = useState<any>(null);
  // danh sách hình ảnh sp chưa nén
  const [fileList, setFileList] = useState<any>([]);
  // danh sách thương hiệu
  const [listBrand, setListBrand] = useState([]);
  const [listConfiguration, setListConfiguration] = useState({
    cpu: [],
  });
  const [isAdded, setIsAdded] = useState(false);
  const [visibleDescModal, setVisibleDescModal] = useState(false);
  // danh sách hình ảnh sp đã nén
  const fileCompressedList = useRef<any>([]);
  const productDecs = useRef(null);
  const [form] = Form.useForm();
  const productModalRef = useRef<any>();

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

  useEffect(() => {
    const configuration = async () => {
      const lstConfiguration = await productApi.getProductConfiguration();
      if (lstConfiguration?.data?.success) {
        setListConfiguration(lstConfiguration?.data?.payload);
      }
    };
    configuration();
  }, []);

  const onGetDetailDesc = (data: any) => {
    setIsAdded(true);
    productDecs.current = data;
  };

  const onCompressFile = async (file: any, type = 0) => {
    new Compressor(file, {
      quality: constants.COMPRESSION_RADIO,
      convertSize: constants.COMPRESSION_RADIO_PNG,
      success(fileCompressed) {
        const reader = new FileReader();
        reader.readAsDataURL(fileCompressed);
        reader.onloadend = async () => {
          if (type === 0) setAvatar(reader.result);
          else if (fileCompressedList.current.length < 10)
            fileCompressedList.current.push({
              data: reader.result,
              uid: file.uid,
            });
        };
      },
      error(err: any) {
        message.error("Lỗi: ", err);
      },
    });
  };

  const onValBeforeSubmit = async (data: any) => {
    try {
      if (!avatar) {
        message.error("Thêm hình ảnh đại diện sản phẩm !", 2);
        return;
      }
      if (productDecs.current === null)
        Modal.confirm({
          title: "Bạn có chắc muốn submit ?",
          content: "Chưa có BÀI VIẾT MÔ TẢ cho sản phẩm này !",
          icon: <ExclamationCircleOutlined />,
          //   okButtonProps: true,
          onCancel: () => {
            return;
          },
          onOk() {
            onSubmit(data);
          },
        });
      if (fileCompressedList.current.length === 0)
        Modal.confirm({
          title: "Bạn có chắc muốn submit ?",
          content: "Chưa có HÌNH ẢNH MÔ TẢ cho sản phẩm này !",
          icon: <ExclamationCircleOutlined />,
          //   okButtonProps: true,
          onCancel() {
            return;
          },
          onOk() {
            onSubmit(data);
          },
        });
      else onSubmit(data);
    } catch (error) {
      message.error("Có lỗi. Thử lại !");
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const { code, name, price, discount, stock, brand, otherInfo, ...rest } =
        data;

      const product = {
        discount,
        code,
        name,
        price,
        brand,
        stock,
        avatar,
      };
      const catalogs = fileCompressedList.current.map((item: any) => item.data);
      const details = {
        ...rest,
        catalogs,
      };

      const dataSend = { product, details, desc: productDecs.current };
      const response = await adminApi.postAddProduct(dataSend);

      if (response?.data?.success) {
        message.success("Thêm sản phẩm thành công");
        loadProductList();
        onClose();
      }
    } catch (error: any) {
      setIsLoading(false);
      message.error(
        error?.response?.data?.message || "Thêm sản phẩm thất bại. Thử lại"
      );
    }
  };

  return (
    <Modal
      className="add-product-modal"
      visible={visible}
      okText="Thêm sản phẩm"
      cancelText="Huỷ bỏ"
      onCancel={() => {
        onClose();
      }}
      okButtonProps={{ form: "addForm", htmlType: "submit" }}
      title="Chỉnh sửa thông tin sản phẩm"
      confirmLoading={isLoading}
      width={"90vw"}
    >
      <Form
        name="addForm"
        onFinish={onValBeforeSubmit}
        onFinishFailed={() => message.error("Lỗi, kiểm tra lại form")}
        form={form}
      >
        <Row gutter={[16, 16]} className="m-b-20">
          <Col span={24}>
            <h2>Thông tin cơ bản sản phẩm</h2>
          </Col>
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="code"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input
                size="large"
                placeholder="Mã sản phẩm *"
                suffix={
                  <Tooltip title="LT211210638">
                    <InfoCircleOutlined style={{ color: suffixColor }} />
                  </Tooltip>
                }
              />
            </Form.Item>
          </Col>
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input
                size="large"
                placeholder="Tên sản phẩm *"
                suffix={
                  <Tooltip title="Laptop Apple MacBook Air 13 2019 MVFM2SA/A (Core i5/8GB/128GB SSD/UHD 617/macOS/1.3 kg)">
                    <InfoCircleOutlined style={{ color: suffixColor }} />
                  </Tooltip>
                }
              />
            </Form.Item>
          </Col>
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="brand"
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
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="warranty"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                step={6}
                size="large"
                min={0}
                max={240}
                placeholder="Tg bảo hành (Theo tháng) *"
              />
            </Form.Item>
          </Col>
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="price"
              rules={[{ required: true, message: "Bắt buộc" }]}
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

          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="discount"
              rules={[{ required: true, message: "Bắt buộc" }]}
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

          <Col span={12} md={8} xl={6}>
            <Upload
              listType="picture"
              fileList={avtFileList}
              maxCount={1}
              onChange={({ fileList }: any) => {
                if (avtFileList.length < 1) setAvtFileList(fileList);
              }}
              onRemove={() => {
                setAvatar(null);
                setAvtFileList([]);
              }}
              beforeUpload={(file) => {
                onCompressFile(file, 0);
                return false;
              }}
            >
              <Button
                disabled={avatar !== null ? true : false}
                className="w-100 h-100"
                icon={<UploadOutlined />}
              >
                Tải lên ảnh đại diện sản phẩm
              </Button>
            </Upload>
          </Col>
        </Row>

        {/* mô tả chi tiết */}
        {visibleDescModal && (
          <ProductDetail
            onGetDetailDes={onGetDetailDesc}
            visible={visibleDescModal}
            onClose={() => setVisibleDescModal(false)}
            ref={productModalRef}
          />
        )}

        <Col span={12} md={8} xl={6} xxl={4}>
          <Button
            className="w-100"
            size="large"
            icon={isAdded ? <EditOutlined /> : <PlusOutlined />}
            onClick={() => setVisibleDescModal(true)}
            type="dashed"
          >
            {isAdded ? "Chỉnh sửa " : "Thêm "} mô tả chi tiết
          </Button>
        </Col>

        <Row gutter={[16, 16]} className="m-b-20">
          <Col span={24}>
            <h2 className="m-b-10">Thông tin chi tiết cho laptop</h2>
          </Col>
          {/*thương hiệu chip*/}
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="chipBrand"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Select
                size="large"
                placeholder="Nhãn hiệu của chip cpu *"
                onChange={(value) => {
                  form.setFieldsValue({
                    processorCount: (
                      listConfiguration?.cpu?.find(
                        (it: any) => it?._id === value
                      ) as any
                    )?.processorCount,
                    series: (
                      listConfiguration?.cpu?.find(
                        (it: any) => it?._id === value
                      ) as any
                    )?.series,
                    detail: (
                      listConfiguration?.cpu?.find(
                        (it: any) => it?._id === value
                      ) as any
                    )?.detail,
                  });
                }}
              >
                {listConfiguration?.cpu?.map((item: any, index: number) => (
                  <Select.Option value={item?._id} key={`cpu-item-${index}`}>
                    {item?.chipBrand}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {/* Số lương core */}
          <Col span={12} md={8} xl={6}>
            <Form.Item name="processorCount">
              <InputNumber
                style={{ width: "100%" }}
                step={2}
                size="large"
                min={0}
                max={32}
                placeholder="Số Lượng core *"
                disabled
              />
            </Form.Item>
          </Col>
          {/* series CPU */}
          <Col span={12} md={8} xl={6}>
            <Form.Item name="series">
              <Input size="large" placeholder="Series chip *" disabled />
            </Form.Item>
          </Col>
          {/* chi tiết chip cpu */}
          <Col span={12} md={8} xl={6}>
            <Form.Item name="detail">
              <Input size="large" placeholder="Chi tiết của cpu *" disabled />
            </Form.Item>
          </Col>

          {/* kích thước màn hình */}
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="displaySize"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Kích thước màn hình *" />
            </Form.Item>
          </Col>

          {/* Card màn hình */}
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="display"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Card màn hình *" />
            </Form.Item>
          </Col>

          {/* Hệ điều hành */}
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="operating"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Hệ điều hành *" />
            </Form.Item>
          </Col>

          {/* Ổ cứng */}
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="disk"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Ổ cứng *" />
            </Form.Item>
          </Col>

          {/* RAM */}
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="ram"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="RAM *" />
            </Form.Item>
          </Col>

          {/* Pin */}
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="pin"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <InputNumber
                addonAfter="Wh"
                style={{ width: "100%" }}
                step={1}
                size="large"
                min={0}
                max={10}
                placeholder="Dung lượng pin *"
              />
            </Form.Item>
          </Col>

          {/* Khối lượng */}
          <Col span={12} md={8} xl={6}>
            <Form.Item
              name="weight"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <InputNumber
                addonAfter="kg"
                style={{ width: "100%" }}
                step={1}
                size="large"
                min={0}
                max={10}
                placeholder="Khối lượng *"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <h2 className="m-b-10">Hình ảnh chi tiết của sản phẩm</h2>

            <Upload
              listType="picture-card"
              multiple={true}
              onRemove={(file) => {
                fileCompressedList.current = fileCompressedList.current.filter(
                  (item: any) => item.uid !== file.uid
                );
              }}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={(file) => {
                onCompressFile(file, 1);
                return false;
              }}
            >
              {fileList.length < 10 && "+ Thêm ảnh"}
            </Upload>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
