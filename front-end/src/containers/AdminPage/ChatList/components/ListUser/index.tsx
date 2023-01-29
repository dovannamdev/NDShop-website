import { useCallback, useEffect, useRef, useState } from "react";
import chatApi from "../../../../../apis/chatApi";
import userApi from "../../../../../apis/userApi";
import _ from "lodash";
import { SearchOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import avatarPlaceholder from "../../../../../assets/img/user_placeholder.png";
import './style.scss'

type ListUserHaveChatType = {
  changeUserSelected?: (item: any) => void;
};

export default function ListUserHaveChat({
  changeUserSelected,
}: ListUserHaveChatType) {
  const [listUser, setListUser] = useState([]);
  const [userSelected, setUserSelected] = useState("");
  const searchText = useRef("");
  const [inputSearch, setInputSearch] = useState("");
  const [searchList, setSearchList] = useState([]);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(true);

  const getListUserHaveChat = async () => {
    const response = await chatApi.getAllUserHaveChat();
    if (response?.data?.user) {
      setListUser(response?.data?.user);
    }
  };

  const searchData = async (keyWord: any) => {
    if (keyWord?.length) {
      const searchList = await userApi.getUserList(keyWord?.trim());
      if (searchList?.data?.user) {
        setSearchList(searchList?.data?.user);
      }
    } else {
      setSearchList([]);
    }
  };

  useEffect(() => {
    getListUserHaveChat();
  }, []);

  const debounceSearch = useCallback(
    _.debounce(() => {
      searchData(searchText.current);
    }, 200),
    []
  );

  return (
    <div
      style={{
        minHeight: "84vh",
        maxHeight: "84vh",
        overflowY: "auto",
      }}
    >
      <div className="homeSearchBar">
        <div style={{ position: "relative" }}>
          <div className="search" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="searchTerm"
              placeholder="Nhập tên khách hàng muốn tìm kiếm tại đây?"
              onChange={(event) => (searchText.current = event.target.value)}
              onKeyUp={(event) => {
                if (event?.code === "Backspace") {
                  debounceSearch();
                }
              }}
              style={{ width: "80%" }}
              onClick={() => {
                if (!isComponentVisible) {
                  setIsComponentVisible(true);
                }
              }}
            />
            <button
              type="submit"
              className="searchButton"
              onClick={() => {
                if (!isComponentVisible) {
                  setIsComponentVisible(true);
                }
                searchData(searchText.current);
              }}
            >
              <SearchOutlined />
            </button>
          </div>
          {(searchList?.length && isComponentVisible && (
            <ul
              ref={ref}
              style={{
                maxHeight: "300px",
                overflow: "auto",
                background: "white",
                position: "absolute",
                width: "80%",
                zIndex: 50,
                padding: "10px",
                borderBottom: "1px solid rgb(44, 206, 244)",
                borderLeft: "1px solid rgb(44, 206, 244)",
                borderRight: "1px solid rgb(44, 206, 244)",
                listStyleType: "none",
              }}
            >
              {searchList?.map((item: any, index: any) => {
                return (
                  <>
                    <li
                      key={`search-list-item-${index}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const checkUser: any = listUser?.find(
                          (it: any) => it?._id == item?._id
                        );
                        if (!checkUser?._id) {
                          const ur: any = [...listUser];
                          ur?.push(item);
                          setListUser(ur);
                        }
                        changeUserSelected?.(item);
                        setUserSelected(item?._id);
                        setIsComponentVisible(false);
                      }}
                    >
                      {item?.fullName}
                    </li>
                    {index < searchList?.length - 1 && (
                      <Divider
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                          border: "1px solid rgb(44, 206, 244)",
                        }}
                      />
                    )}
                  </>
                );
              })}
            </ul>
          )) ||
            ""}
        </div>
      </div>
      <div style={{ marginTop: "30px" }}>
        {listUser?.map((item: any, index: number) => {
          return (
            <div
              key={`user-chat-item-${index}`}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "10px 5px",
                cursor: "pointer",
                background: item?._id === userSelected ? "rgb(44,206,245)" : "",
              }}
              onClick={() => {
                if (item?._id !== userSelected) {
                  changeUserSelected?.(item);
                  setUserSelected(item?._id);
                }
              }}
            >
              <div>
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img
                  src={avatarPlaceholder}
                  width={30}
                  height={30}
                  alt="user_placeholder"
                  style={{borderRadius: '15px'}}
                />
              </div>
              <div style={{ marginLeft: "10px" }}>{item?.fullName}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function useComponentVisible(initialIsVisible: any) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
