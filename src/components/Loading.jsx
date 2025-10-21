import { Spin } from "antd";
import logo from "../assets/images/logo.png";
import { LoadingOutlined } from "@ant-design/icons";

function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50">
      <img src={logo} alt="Learnly Logo" className="w-32 h-auto mb-6" />
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 24, color: "#3B82F6" }} spin />
        }
      />
      <p className="mt-4 text-gray-600 text-sm">Đang tải...</p>
    </div>
  );
}

export default Loading;
