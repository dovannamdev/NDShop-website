import { Col, Row } from "antd";
import { useState } from "react";
import ListUserHaveChat from "./components/ListUser";
import UserChat from "./components/UserChat";

export default function AdminChat() {
  const [userSelected, setUserSelected] = useState("");

  return (
    <Row style={{padding: '20px 60px'}}>
      <Col span={10}>
        <ListUserHaveChat
          changeUserSelected={(user: any) => {
            setUserSelected(user);
          }}
        />
      </Col>

      <Col span={14}>
        <UserChat user={userSelected}/>
      </Col>
    </Row>
  );
}