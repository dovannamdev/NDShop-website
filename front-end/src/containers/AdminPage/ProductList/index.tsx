import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Button, message, Modal, Table, Tooltip } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import GlobalLoading from "../../../components/GlobalLoading";
import helpers from "../../../helpers";
import productApi from "../../../apis/productApi";
import EditProductModal from "./EditProductModal";
import adminApi from "../../../apis/adminApi";
import AddProductModal from "./AddProductModal";
import CommentDrawer from "./CommentDrawer";
import { FORMAT_NUMBER } from "../../../constants";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const ProductList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalDel, setModalDel] = useState({ visible: false, code: "" });
  const [editModal, setEditModal] = useState<any>({
    visible: false,
    product: null,
  });
  const [addModal, setAddModal] = useState({ visible: false });
  const [list, setList] = useState<any[]>([]);
  const [visibleCommentDrawer, setVisibleCommentDrawer] = useState({
    visible: false,
    code: "",
  });

  const productRole = useMemo(() => {
    const role = helpers.getFunctionRole('product')
    return role
  }, [])

  const onDelete = async (code: any) => {
    try {
      const response = await adminApi.removeProduct(code);
      if (response?.data?.success) {
        message.success("Xoá thành công.");
        const newList = [...list]?.filter((item) => item.code !== code);
        setList(newList);
      }
    } catch (error: any) {
      message.error(error.response.data.message || "Xoá thất bại, thử lại !");
    }
  };

  const getProductList = async () => {
    try {
      const res = await productApi.getAllProducts(-1, -1, 'admin');
      if (res) {
        const { data } = res.data;
        const list = data.map((item: any, index: any) => {
          return { ...item, key: index };
        });
        setList(list);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Lấy danh sách sản phẩm thất bại.");
    }
  };

  useEffect(() => {
    getProductList();
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: "Mã",
      key: "code",
      dataIndex: "code",
      render: (code, data: any) => (
        <a target="blank" href={`/product/${data.code}`}>
          {code}
        </a>
      ),
    },
    {
      title: "Tên",
      key: "name",
      dataIndex: "name",
      render: (name) => (
        <Tooltip title={name}>{helpers.reduceProductName(name, 40)}</Tooltip>
      ),
    },
    {
      title: "Thương hiệu",
      key: "brandName",
      dataIndex: "brandName",
      render: (brandName) => (
        <Tooltip title={brandName}>
          {helpers.reduceProductName(brandName, 40)}
        </Tooltip>
      ),
    },
    {
      title: "Số lượng tồn kho",
      key: "allQuantity",
      dataIndex: "allQuantity",
      render: (value: any) => FORMAT_NUMBER.format(value),
      sorter: (a: any, b: any) => {
        return a.allQuantity - b.allQuantity
      },
    },
    {
      title: "Số lượng khả dụng",
      key: "stock",
      dataIndex: "stock",
      render: (value: any) => FORMAT_NUMBER.format(value),
      sorter: (a: any, b: any) => {
        return a.stock - b.stock
      },
    },
    {
      title: "Giá nhập vào",
      key: "initPrice",
      dataIndex: "initPrice",
      render: (value: any) => helpers.formatProductPrice(value),
      sorter: (a: any, b: any) => {
        return a.initPrice - b.initPrice
      },
    },
    {
      title: "Giá bán ra",
      key: "price",
      dataIndex: "price",
      render: (value: any) => helpers.formatProductPrice(value),
      sorter: (a: any, b: any) => {
        return a.price - b.price
      },
    },
    {
      title: "Khuyến mãi",
      key: "discount",
      dataIndex: "discount",
      sorter: (a: any, b: any) => {
        return a.discount - b.discount
      },
      render: (item) => {
        return item + "%"
      }

    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (text) => (
        <>
          <Tooltip title="Bình luận sản phẩm" placement="bottom">
            <CommentOutlined
              onClick={() =>
                setVisibleCommentDrawer({
                  visible: true,
                  code: text?.code,
                })
              }
              className="m-r-8 action-btn-product font-size-18px m-r-10"
              style={{ color: "#30CFD0 " }}
            />
          </Tooltip>
          <Tooltip title="Sửa sản phẩm" placement="bottom">
            <EditOutlined
              onClick={() =>{
                if (productRole?.indexOf('update') < 0){
                  return message.error('Bạn không có quyền cập nhật sản phẩm')
                }

                setEditModal({ visible: true, product: { ...text } })
              }}
              className="m-r-8 action-btn-product font-size-18px m-r-10"
              style={{ color: "#30CFD0 " }}
            />
          </Tooltip>
          <Tooltip title="Xóa sản phẩm" placement="bottom">
            <DeleteOutlined
              onClick={() => {
                if (productRole?.indexOf('delete') < 0){
                  return message.error('Bạn không có quyền xoá sản phẩm')
                }

                setModalDel({ visible: true, code: text?.code })
              }}
              className="m-r-8 action-btn-product font-size-18px"
              style={{ color: "red" }}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div className="pos-relative p-8">
      {isLoading ? (
        <GlobalLoading content={"Đang tải danh sách sản phẩm ..."} />
      ) : (
        <>
          <div className="d-flex btn-add-product">
            <Button
              onClick={() => {
                if (productRole?.indexOf('create') < 0){
                  return message.error('Bạn không có quyền tạo sản phẩm')
                }
                setAddModal({ visible: true })
              }}
              type="primary"
              className="m-b-20 m-t-10"
              style={{ marginLeft: "auto" }}
            >
              <PlusOutlined className="action-btn-product" />
              Thêm sản phẩm
            </Button>
          </div>
          <Table columns={columns} dataSource={list} />

          {addModal.visible && (
            <AddProductModal
              visible={addModal.visible}
              onClose={() => setAddModal({ visible: false })}
              loadProductList={() => getProductList()}
            />
          )}

          {editModal.visible && (
            <EditProductModal
              visible={editModal.visible}
              onClose={() => setEditModal({ visible: false })}
              product={editModal.product}
              updateField={(value: any) => {
                const newList = list.map((item: any) =>
                  item.code !== value.code ? item : { ...item, ...value }
                );
                setList(newList);
              }}
            />
          )}

          {modalDel.visible && (
            <Modal
              title="Xác nhận xoá sản phẩm"
              visible={modalDel.visible}
              onOk={() => {
                onDelete(modalDel.code);
                setModalDel({ visible: false, code: "" });
              }}
              onCancel={() => setModalDel({ visible: false, code: "" })}
              okButtonProps={{ danger: true }}
              okText="Xoá"
              cancelText="Huỷ bỏ"
            >
              <WarningOutlined style={{ fontSize: 28, color: "#F7B217" }} />
              <b> Không thể khôi phục được, bạn có chắc muốn xoá ?</b>
            </Modal>
          )}

          {visibleCommentDrawer?.visible ? (
            <CommentDrawer
              visible={visibleCommentDrawer?.visible}
              onClose={() =>
                setVisibleCommentDrawer({ visible: false, code: "" })
              }
              productCode={visibleCommentDrawer?.code}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
