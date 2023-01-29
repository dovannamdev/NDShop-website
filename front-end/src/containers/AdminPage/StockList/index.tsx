import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Table, Tooltip } from "antd";
import { useState, useEffect, useMemo } from "react";
import stockApi from "../../../apis/stockApi";
import GlobalLoading from "../../../components/GlobalLoading";
import helpers from "../../../helpers";
import ConfirmStockModal from "./ConfirmStockModal";
import ControlStockModal from "./ControlStockModal";
import ViewProductModal from "./ViewProductModal";

const StockList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [controlModal, setControlModal] = useState<any>({
    visible: false,
    stock: {},
    type: "",
  });
  const [visibleViewProductModal, setVisibleViewProductModal] = useState({
    visible: false,
    stockId: "",
  });

  const stockRole = useMemo(() => {
    const role = helpers.getFunctionRole("stock");
    return role;
  }, []);

  const getStockList = async () => {
    setIsLoading(true);
    try {
      const stockList = await stockApi.getStockList();
      if (stockList?.data?.success) {
        setData(stockList?.data?.payload);
      }
    } catch (error) {
      console.log("get stock list error >>>> ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getStockList();
  }, []);

  const columns = [
    {
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (item: any, record: any, index: number) => index + 1,
    },
    {
      title: "Mã nhập hàng",
      key: "_id",
      dataIndex: "_id",
      render: (item: any) => "MNH" + item,
    },
    {
      title: "Người nhập hàng",
      key: "receiverName",
      dataIndex: "receiverName",
    },
    {
      title: "Ngày nhập hàng",
      key: "createdDate",
      dataIndex: "createdDate",
      render: (item: any) => {
        return <>{helpers.dateTimeConverter(item)}</>;
      },
    },
    {
      title: "Sản phẩm",
      key: "stockProduct",
      dataIndex: "stockProduct",
      render: (item: any, record: any) => {
        return (
          <div
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() =>
              setVisibleViewProductModal({
                visible: true,
                stockId: record?._id,
              })
            }
          >
            Xem sản phẩm
          </div>
        );
      },
    },
    {
      title: "Hành động",
      render: (item: any) => (
        <>
          <Tooltip title="Sửa đơn nhập hàng" placement="bottom">
            <EditOutlined
              className="m-r-8 action-btn-product font-size-18px m-r-10"
              style={{ color: "#30CFD0 " }}
              onClick={() => {
                if (stockRole?.indexOf("update") < 0) {
                  return message.error("Bạn không có quyền cập nhật dữ liệu");
                }
                setControlModal({
                  visible: true,
                  stock: { ...item },
                  type: "UPDATE",
                });
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa quyền" placement="bottom">
            <DeleteOutlined
              className="m-r-8 action-btn-product font-size-18px"
              style={{ color: "red" }}
              onClick={() => {
                if (stockRole?.indexOf("delete") < 0) {
                  return message.error("Bạn không có quyền xoá dữ liệu");
                }

                setControlModal({
                  visible: true,
                  stock: { ...item },
                  type: "DELETE",
                });
              }}
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
              onClick={() => {
                if (stockRole?.indexOf("create") < 0) {
                  return message.error("Bạn không có quyền tạo mới dữ liệu");
                }

                setControlModal({ visible: true, stock: {}, type: "CREATE" });
              }}
              type="primary"
              className="m-b-20 m-t-10"
              style={{ marginLeft: "auto" }}
            >
              <PlusOutlined className="action-btn-product" />
              Thêm đơn nhập hàng
            </Button>
          </div>
          <Table columns={columns} dataSource={data} />

          {controlModal.visible && controlModal?.type !== "DELETE" && (
            <ControlStockModal
              visible={controlModal.visible}
              onClose={() =>
                setControlModal({ visible: false, stock: {}, type: "" })
              }
              handleUpdateField={(
                id: any,
                receiver: any,
                receiverName: any
              ) => {
                const role = data?.map((item: any) => {
                  if (item?._id === id) {
                    return {
                      ...item,
                      receiver,
                      receiverName,
                    };
                  }
                  return item;
                });
                setData(role);
              }}
              reloadPage={() => getStockList()}
              role={controlModal?.role}
              type={controlModal?.type}
              stockData={controlModal?.stock}
            />
          )}

          {controlModal.visible && controlModal?.type === "DELETE" && (
            <ConfirmStockModal
              visible={controlModal.visible}
              onClose={() =>
                setControlModal({ visible: false, role: {}, type: "" })
              }
              stockId={controlModal?.stock?._id}
              handleDeleteStock={(id: any) => {
                const stock = data?.filter((item: any) => {
                  if (item?._id !== id) return true;
                });
                setData(stock);
              }}
            />
          )}

          {visibleViewProductModal?.visible && (
            <ViewProductModal
              visible={visibleViewProductModal?.visible}
              onClose={() =>
                setVisibleViewProductModal({ visible: false, stockId: "" })
              }
              stockId={visibleViewProductModal?.stockId}
            />
          )}
        </>
      )}
    </div>
  );
};

export default StockList;
