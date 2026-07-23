import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const PageLoading = ({
  message = "Loading...",
  fullScreen = true,
  size = "large",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center font-sans ${
        fullScreen ? "min-h-screen bg-background" : ""
      } ${className}`}
    >
      <Spin
        size={size}
        indicator={
          <LoadingOutlined
            className={`${size === "large" ? "text-3xl" : "text-xl"} text-primary`}
            spin
          />
        }
      />
      {message ? (
        <p className="mt-4 text-sm font-medium text-on-surface-variant">
          {message}
        </p>
      ) : null}
    </div>
  );
};

export default PageLoading;
