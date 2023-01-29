import { WarningOutlined } from "@ant-design/icons";
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Switch,
  Table,
  Tooltip,
} from "antd";
import { useState, useEffect, useMemo } from "react";
import accountApi from "../../../apis/accountApi";
import adminApi from "../../../apis/adminApi";
import GlobalLoading from "../../../components/GlobalLoading";
import helpers from "../../../helpers";

const CustomerList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [modalDel, setModalDel] = useState({ visible: false, id: "" });

  const customerRole = useMemo(() => {
    const role = helpers.getFunctionRole("customer");
    return role;
  }, []);

  const onDelCustomer = async (id: any) => {
    try {
      const response = await adminApi.delCustomer(id);
      if (response) {
        message.success("Xoá tài khoản thành công");
        setData(data.filter((item: any) => item._id !== id));
      }
    } catch (error) {
      message.error("Xóa tài khoản thất bại");
    }
  };

  const getCustomerList = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getCustomerList();
      if (response) {
        const { list } = response.data;
        const newList = list?.map((item: any, index: number) => {
          return {
            key: index,
            _id: item?._id,
            email: item?.email,
            birthday: item?.birthday,
            fullName: item?.fullName,
            address: item?.address,
            gender: item?.gender,
            phone: item?.phone,
            accountId: item?.accountId,
            status: item?.status,
          };
        });
        setData([...newList]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCustomerList();
  }, []);

  const handleChangeAccountStatus = async (status: any, accountId: any) => {
    try {
      const result = await accountApi.changeAccountStatus(status, accountId);
      if (result?.data?.success) {
        const user = [...data]?.map((item) => {
          if (item?.accountId === accountId) {
            return {
              ...item,
              status,
            };
          }
          return item;
        });
        setData(user);
        return message.success("Thay đổi trạng thái thành công");
      }
      return message.error("Thay đổi trạng thái tài khoản thất bại");
    } catch (error) {
      return message.error("Thay đổi trạng thái tài khoản thất bại");
    }
  };

  const columns = [
    {
      title: "Số thứ tự",
      key: "id",
      dataIndex: "id",
      render: (item: any, _: any, index: number) => <>{index + 1}</>,
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Họ tên",
      key: "fullName",
      dataIndex: "fullName",
    },
    {
      title: "Số điện thoại",
      key: "phone",
      dataIndex: "phone",
    },
    {
      title: "Ngày sinh",
      key: "birthday",
      dataIndex: "birthday",
      render: (item: any) => helpers.dateTimeConverter(item),
    },
    {
      title: "Giới tính",
      key: "gender",
      dataIndex: "gender",
      render: (gender: any) => (gender ? "Nam" : "Nữ"),
    },
    {
      title: "Địa chỉ",
      key: "address",
      dataIndex: "address",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (item: any, record: any) => {
        return (
          <Popconfirm
            title="Xác nhận đổi trạng thái người dùng"
            placement="top"
            okText="Đồng ý"
            cancelText="Huỷ"
            onConfirm={() => {
              if (customerRole?.indexOf("update") < 0) {
                return message.error("Bạn không có quyền cập nhật dữ liệu");
              }
              handleChangeAccountStatus(!!!item, record?.accountId);
            }}
          >
            <Tooltip title={!!item ? "Hoạt động" : "Không hoạt động"}>
              <Switch checked={!!item}></Switch>
            </Tooltip>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <>
      {isLoading ? (
        <GlobalLoading content={"Đang tải danh sách..."} />
      ) : (
        <>
          <Table dataSource={data} columns={columns} />

          <Modal
            title="Xác nhận xóa tài khoản người dùng"
            visible={modalDel.visible}
            okText="Xóa"
            cancelText="Hủy"
            onCancel={() => setModalDel({ ...modalDel, visible: false })}
            onOk={() => {
              onDelCustomer(modalDel.id);
              setModalDel({ visible: false, id: "" });
            }}
          >
            <WarningOutlined style={{ fontSize: 28, color: "#F7B217" }} />
            <b> Không thể khôi phục được, bạn có chắc muốn xoá ?</b>
          </Modal>
        </>
      )}
    </>
  );
};

export default CustomerList;
