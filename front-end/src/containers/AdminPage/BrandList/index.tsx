import React, { useEffect, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { Button, message, Table, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import GlobalLoading from "../../../components/GlobalLoading";
import ControlBrandModal from "./ControlBrandModal";
import brandApi from "../../../apis/brandApi";
import ConfirmBrandModal from "./ConfirmBrandModal";
import helpers from "../../../helpers";

interface BrandItemType {
  _id: number;
  brandName: string;
}

export default function BrandList() {
  const [controlModal, setControlModal] = useState<{
    visible: boolean;
    brand: any;
    type: "CREATE" | "UPDATE" | "DELETE";
  }>({
    visible: false,
    brand: {},
    type: "CREATE",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [listBrand, setListBrand] = useState<any[]>([]);
  const brandRole = useMemo(() => {
    const role = helpers.getFunctionRole('brand')
    return role
  }, [])

  const getAllBrand = async () => {
    try {
      const brand = await brandApi.getBrandList();
      if (brand?.data?.data) {
        setListBrand(brand?.data?.data);
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Lấy danh sách thương hiệu thất bại.");
    }
  };

  useEffect(() => {
    getAllBrand();
  }, []);

  const columns: ColumnsType<BrandItemType> = [
    {
      title: "Số thứ tự",
      key: "index",
      dataIndex: "index",
      render: (code, data: any, index) => <div>{index + 1}</div>,
    },
    {
      title: "Tên thương hiệu",
      key: "brandName",
      dataIndex: "brandName",
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (brand) => (
        <>
          <Tooltip title="Sửa thương hiệu" placement="bottom">
            <EditOutlined
              onClick={() => {
                if (brandRole?.indexOf('update') < 0){
                  return message.error('Bạn không có quyền cập nhật thương hiệu')
                }

                setControlModal({
                  visible: true,
                  brand: { ...brand },
                  type: "UPDATE",
                });
              }}
              className="m-r-8 action-btn-product font-size-18px m-r-10"
              style={{ color: "#30CFD0 " }}
            />
          </Tooltip>
          <Tooltip title="Xóa thương hiệu" placement="bottom">
            <DeleteOutlined
              onClick={() =>{
                if (brandRole?.indexOf('delete') < 0){
                  return message.error('Bạn không có quyền xoá thương hiệu')
                }

                setControlModal({
                  visible: true,
                  brand: { ...brand },
                  type: "DELETE",
                })
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
        <GlobalLoading content={"Đang tải danh sách thương hiệu ..."} />
      ) : (
        <>
          <div className="d-flex btn-add-product">
            <Button
              onClick={() =>{
                if (brandRole?.indexOf('create') < 0){
                  return message.error('Bạn không có quyền tạo thương hiệu')
                }
                setControlModal({ visible: true, brand: {}, type: "CREATE" })
              }}
              type="primary"
              className="m-b-20 m-t-10"
              style={{ marginLeft: "auto" }}
            >
              <PlusOutlined className="action-btn-product" />
              Thêm thương hiệu
            </Button>
          </div>
          <Table columns={columns} dataSource={listBrand} />

          {controlModal.visible && controlModal?.type !== "DELETE" && (
            <ControlBrandModal
              visible={controlModal.visible}
              onClose={() =>
                setControlModal({ visible: false, brand: {}, type: "CREATE" })
              }
              handleUpdateField={(id: any, brandName: any) => {
                const brand = listBrand?.map((item: any) => {
                  if (item?._id === id) {
                    return {
                      ...item,
                      brandName: brandName,
                    };
                  }
                  return item;
                });
                setListBrand(brand);
              }}
              reloadPage={() => getAllBrand()}
              brand={controlModal?.brand}
              type={controlModal?.type}
            />
          )}

          {controlModal.visible && controlModal?.type === "DELETE" && (
            <ConfirmBrandModal
              visible={controlModal.visible}
              onClose={() =>
                setControlModal({ visible: false, brand: {}, type: "CREATE" })
              }
              brandId={controlModal?.brand?._id}
              handleDeleteBrand={(id: any) => {
                const brand = listBrand?.filter((item) => {
                  if (item?._id !== id) return true;
                });
                setListBrand(brand)
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
