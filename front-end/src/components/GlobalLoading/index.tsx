import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const GlobalLoading = ({ content }: any) => {
    const iconLoading = <LoadingOutlined style={{ fontSize: 30 }} spin />;
  return (
    <Spin indicator={iconLoading} className="Global-Loading trans-center" tip={content} />
  );
};
export default GlobalLoading;
