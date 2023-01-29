import { message } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import chatApi from "../../../../../apis/chatApi";
import constants from "../../../../../constants";
import "./style.scss";
import avatarPlaceholder from "../../../../../assets/img/user_placeholder.png";
import helpers from "../../../../../helpers";

type UserChatType = {
  user: any;
};

export default function UserChat({ user }: UserChatType) {
  const [socketId, setSocketId] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [userListMessage, setUserListMessage] = useState([]);

  const chatRole = useMemo(() => {
    const role = helpers.getFunctionRole("chat");
    return role;
  }, []);

  const socketRef = useRef<any>();

  useEffect(() => {
    socketRef.current = (socketIOClient as any).connect(constants?.CHAT_HOST);
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
      } else {
        if (userListMessage?.length) setUserListMessage([]);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (setChatMessage?.length) {
      setChatMessage("");
    }
  }, [user]);

  const sendMessage = async () => {
    if (chatRole?.indexOf("reply") < 0) {
      return message.error("Bạn không có quyền gửi tin nhắn");
    }

    if (!chatMessage?.trim()?.length) {
      return message.error("Tin nhắn không thể bỏ trống");
    }
    const adminId = JSON.parse(localStorage.getItem("admin") || "");
    setChatMessage("");
    socketRef.current.emit("sendDataClient", {
      userId: user?._id,
      message: chatMessage?.trim(),
      adminId: adminId?._id,
      type: "chat-reply",
    });
  };

  return (
    <div
      style={{
        minHeight: "84vh",
        maxHeight: "84vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "45px",
          padding: "6px 10px",
          boxSizing: "border-box",
          borderTop: "1px solid rgb(44, 206, 244)",
          borderLeft: "1px solid rgb(44, 206, 244)",
          borderRight: "1px solid rgb(44, 206, 244)",
          fontWeight: 700,
        }}
      >
        {user ? (
          <span>
            <img
              src={avatarPlaceholder}
              width={30}
              height={30}
              alt="user_placeholder"
              style={{ borderRadius: "15px" }}
            />
          </span>
        ) : (
          <></>
        )}
        <span style={{ marginLeft: "10px" }}>{user?.fullName}</span>
      </div>
      <div
        style={{
          position: "absolute",
          height: "calc(84vh - 65px - 45px)",
          overflowY: "auto",
          width: "100%",
          paddingRight: "15px",
        }}
        className={"AdminChatMessageFrame"}
      >
        {userListMessage?.map((item: any, index: number) => {
          return (
            <div
              className={`message ${
                item?.ownerId ? "message-right" : "message-left"
              }`}
              key={`user-chat-item-${index}`}
            >
              <div
                className={`bubble ${
                  item?.ownerId ? "bubble-dark" : "bubble-light"
                }`}
              >
                {item?.message || item?.replyMessage || ""}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <div className={"AdminChattypeArea"}>
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
            disabled={!user?._id}
            className="button-send"
            onClick={() => sendMessage()}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
