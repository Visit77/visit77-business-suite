import React from "react";
import { Card, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const SetupMenuCard = ({ title, description, onClick }) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      className=" mt-3! rounded-2xl! border! border-gray-200! shadow-sm! hover:border-neutral-500! hover:shadow-md! transition-all! duration-200!"
    >
      <div className="flex items-center justify-between">
        <div>
          <Title level={5} className="text-gray-900! mb-1! font-bold!">
            {title}
          </Title>
          <Text className="text-gray-500 text-sm">{description}</Text>
        </div>
        <div className="text-gray-400">
          <RightOutlined className="text-base font-semibold" />
        </div>
      </div>
    </Card>
  );
};

const InvoiceAndReceipt = () => {
  const menuItems = [
    {
      title: "OTA Charge Setup",
      description: "Set up fixed charges for OTA Invoice / Receipt",
      path: "/ota/invoice-receipt-setting",
    },
    {
      title: "PMS Charge Setup",
      description: "Set up fixed charges for PMS Invoice / Receipt",
      path: "/pms/invoice-receipt-setting",
    },
    {
      title: "Document ID Setup",
      description: "Set up Invoice, Receipt & Reservation IDs",
      path: "/document/id-setup/",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-5 mx-auto max-w-md">
      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <SetupMenuCard
            key={index}
            title={item.title}
            description={item.description}
            onClick={() => navigate(item?.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default InvoiceAndReceipt;
