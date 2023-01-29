import { PlusOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GlobalLoading from "../../../components/GlobalLoading";

const AddressList = (props: any) => {
  const { isCheckout, onChecked } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);
  const [isVisibleForm, setIsVisibleForm] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [activeItem, setActiveItem] = useState(-1);

  const user = useSelector((state:any) => state.userReducer);

//   useEffect(() => {
//     let isSubscribe = true;
//     async function getDeliveryAddressList() {
//       try {
//         setIsLoading(true);
//         const response = await addressApi.getDeliveryAddressList(user._id);
//         if (isSubscribe && response) {
//           setList(response.data.list);
//           setIsLoading(false);
//         }
//       } catch (error) {
//         if (isSubscribe) {
//           setList([]);
//           setIsLoading(false);
//         }
//       }
//     }
//     if (user) getDeliveryAddressList();
//     return () => (isSubscribe = false);
//   }, [user, updateList]);


  const showAddressList = (list: any) => {
    return (
      list &&
      list.map((item: any, index: number) => {
        <div
          className={`bg-white bor-rad-8 box-sha-home p-tb-8 p-lr-16 m-b-16 ${
            activeItem === index && isCheckout ? "item-active" : ""
          }`}
          onClick={() => {
            if (isCheckout) {
              setActiveItem(index);
              onChecked(index);
            }
          }}
          key={index}
        >
          <div className="d-flex justify-content-between m-b-4">
            <h3>
              <b>{item.name}</b>
              {/* {index === 0 && !isCheckout && (
                <span
                  className="font-size-12px p-tb-4 p-lr-8 m-l-8 bor-rad-4"
                  style={{ border: 'solid 1px #3a5dd9', color: '#3a5dd9' }}>
                  Mặc định
                </span>
              )} */}
            </h3>
            {index !== 0 && !isCheckout && (
              <div>
                {/* <Button
                  type="link"
                  onClick={() => onSetDefaultDeliveryAdd(index)}>
                  Đặt mặc định
                </Button> */}
                <Button
                  danger
                  type="primary"
                  disabled={index === 0}
                //   onClick={() => onDelDeliveryAdd(index)}
                >
                  Xoá
                </Button>
                <p className="m-b-6">
                  <b>Địa chỉ:</b> {item.address}
                </p>
                <p className="m-b-6">
                  <b>Số điện thoại:</b> {item.phone}
                </p>
              </div>
            )}
          </div>
        </div>;
      })
    );
  };
  return (
    <>
      {isLoading ? (
        <div className="t-center m-tb-48">
          <GlobalLoading content="Đang tải danh sách địa chỉ giao hàng ..." />
        </div>
      ) : (
        <div className="User-Address-List">
          {list.length < 5 && (
            <Button
              type="dashed"
              size="large"
              className="w-100"
              onClick={() => setIsVisibleForm(true)}
              style={{ height: 54 }}
            >
              <PlusOutlined />
              Thêm địa chỉ
            </Button>
          )}
          {list.length > 0 ? (
            <div className="m-t-16">{showAddressList(list)}</div>
          ) : (
            <h3 className="m-t-16 t-center" style={{ color: "#888" }}>
              Hiện tại bạn chưa có địa chỉ giao, nhận hàng nào
            </h3>
          )}
        </div>
      )}
    </>
  );
};

export default AddressList;
