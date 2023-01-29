import {
  CloseOutlined,
  MessageOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./style.scss";
import telesaleIcon from "../../assets/img/telesale.png";
import { message } from "antd";
import chatApi from "../../apis/chatApi";
import socketIOClient from "socket.io-client";
import constants from "../../constants";
import { useLocation } from "react-router-dom";

export default function ChatBox() {
  const [visibleChatBox, setVisibleChatBox] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [userListMessage, setUserListMessage] = useState([]);
  const [isAdminAccount, setIsAdminAccount] = useState(false);
  const user = useSelector((state: any) => state.userReducer);
  const location = useLocation();

  const socketRef = useRef<any>();

  useEffect(() => {
    socketRef.current = (socketIOClient as any).connect(constants.CHAT_HOST);
    socketRef.current.on("getId", (data: any) => {
      setSocketId(data);
    });

    socketRef.current.on("sendDataServer", (dataGot: any) => {
      setUserListMessage(dataGot?.data);
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (user?._id) {
        const userMessage = await chatApi.getUserChat(user?._id);
        const { chat } = userMessage?.data;
        if (chat) {
          setUserListMessage(chat);
        }
      }
    })();
  }, [user?._id]);

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    setIsAdminAccount(admin ? true : false);
  }, [user?._id]);

  const sendMessage = async () => {
    if (!chatMessage?.trim()?.length) {
      return message.error("Tin nhắn không thể bỏ trống");
    }

    setChatMessage("");
    return socketRef.current.emit("sendDataClient", {
      userId: user?._id,
      message: chatMessage?.trim(),
      type: 'user-chat'
    });
  };

  return (
    <div>
      {location?.pathname?.indexOf("/admin") < 0 && !isAdminAccount ? (
        <div>
          {user?._id ? (
            <div
              style={{
                position: "fixed",
                right: "30px",
                bottom: "100px",
                zIndex: 10,
              }}
              className="chat-contact-icon"
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  border: "1px solid rgb(44,206,244)",
                  borderRadius: "50px",
                  background: "rgb(44,206,244)",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => setVisibleChatBox(true)}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <MessageOutlined style={{ color: "white" }} />
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {visibleChatBox ? (
            <div className="chat-box-frame">
              <div className="chat-box">
                <div className="header">
                  <div className="avatar-wrapper avatar-big">
                    <img src={telesaleIcon} alt="avatar" />
                  </div>
                  <span className="name" style={{ color: "white" }}>
                    Quản trị viên
                  </span>
                  <span
                    className="options"
                    onClick={() => setVisibleChatBox(false)}
                  >
                    <CloseOutlined style={{ color: "white" }} />
                  </span>
                </div>
                <div className="chat-room">
                  {userListMessage?.map((item: any, index: number) => {
                    return (
                      <div
                        className={`message ${
                          !item?.ownerId ? "message-right" : "message-left"
                        }`}
                        key={`user-message-item-${index}`}
                      >
                        <div
                          className={`bubble ${
                            !item?.ownerId ? "bubble-dark" : "bubble-light"
                          }`}
                        >
                          {item?.message || item?.replyMessage || ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="type-area">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="inputText"
                      placeholder="Nhập tin nhắn vào đây..."
                      value={chatMessage}
                      onChange={(event) => {
                        setChatMessage(event.target.value);
                      }}
                      onKeyDown={(event) => {
                        if (event?.keyCode === 13) {
                          sendMessage();
                        }
                      }}
                    />
                  </div>
                  <button
                    className="button-send"
                    onClick={async () => sendMessage()}
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
