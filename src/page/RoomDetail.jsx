import React, { useState } from "react";
import { Button, Table, Tag, Image } from "antd"; // 1. AntD ရဲ့ Image component ကို ယူပါ
import {
  EditOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
  WifiOutlined,
  ControlOutlined,
  DesktopOutlined,
  CoffeeOutlined,
  BuildOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const RoomDetail = () => {
  const imagesList = [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
  ];

  const navigate = useNavigate();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const handleImageClick = (index) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const bookingHistory = [
    {
      key: "1",
      guestInitials: "UK",
      guestName: "U Kyaw Min",
      checkIn: "Oct 24, 2023",
      checkOut: "Oct 26, 2023",
      status: "Completed",
    },
    {
      key: "2",
      guestInitials: "DT",
      guestName: "Daw Thuzar",
      checkIn: "Oct 20, 2023",
      checkOut: "Oct 22, 2023",
      status: "Completed",
    },
  ];

  const columns = [
    {
      title: "GUEST NAME",
      dataIndex: "guestName",
      key: "guestName",
      render: (text, record) => (
        <div className="flex items-center space-x-3 py-1">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center uppercase tracking-wider">
            {record.guestInitials}
          </div>
          <span className="font-semibold text-on-surface text-xs md:text-sm">
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "CHECK-IN",
      dataIndex: "checkIn",
      key: "checkIn",
      className: "text-xs md:text-sm font-medium text-on-surface-variant/90",
    },
    {
      title: "CHECK-OUT",
      dataIndex: "checkOut",
      key: "checkOut",
      className: "text-xs md:text-sm font-medium text-on-surface-variant/90",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color="success"
          className="rounded-full! px-3! py-0.5! border-emerald-200! text-[11px]! font-bold!"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      align: "center",
      render: () => (
        <Button
          type="text"
          shape="circle"
          icon={<MoreOutlined className="text-slate-400" />}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-10 font-sans">
      <div className="hidden">
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            current: previewIndex,
            onVisibleChange: (visible) => setPreviewVisible(visible),
            onChange: (index) => setPreviewIndex(index),
          }}
        >
          {imagesList.map((url, index) => (
            <Image key={index} src={url} />
          ))}
        </Image.PreviewGroup>
      </div>

      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="font-title text-2xl md:text-3xl font-bold text-on-surface">
              Room 101
            </h1>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              • Available
            </span>
          </div>
          <p className="text-xs md:text-sm text-on-surface-variant/70 mt-1">
            Premium Elegant Deluxe Suite
          </p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`/rooms/edit/1`);
            }}
            className="flex-1 sm:flex-none h-10 px-5 rounded-xl font-semibold border-slate-200 text-on-surface-variant text-sm hover:bg-slate-50"
          >
            Edit Room
          </Button>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            className="flex-1 sm:flex-none h-10 px-5 rounded-xl bg-[#0F296D]! hover:bg-[#1a3b8b]! font-semibold border-none text-sm shadow-sm"
          >
            View Bookings
          </Button>
        </div>
      </div>

      {/* 2. Top Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0F296D] flex items-center justify-center text-lg">
            <DollarCircleOutlined />
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider">
              Price Per Night
            </p>
            <h3 className="text-base font-bold text-[#0F296D] mt-0.5">$120</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0F296D] flex items-center justify-center text-lg">
            <AppstoreOutlined />
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider">
              Room Type
            </p>
            <h3 className="text-base font-bold text-[#0F296D] mt-0.5">
              Deluxe Suite
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0F296D] flex items-center justify-center text-lg">
            <BuildOutlined />
          </div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider">
              Floor
            </p>
            <h3 className="text-base font-bold text-[#0F296D] mt-0.5">
              1st Floor
            </h3>
          </div>
        </div>
      </div>

      {/* 3. Media & Info Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Photo Card */}
          <div
            onClick={() => handleImageClick(0)}
            className="relative rounded-2xl overflow-hidden aspect-16/10 bg-slate-100 shadow-sm border border-slate-100 cursor-pointer group"
          >
            <img
              src={imagesList[0]}
              alt="Main Room"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <span className="absolute top-4 left-4 bg-black/50 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs">
              Main Photo
            </span>
          </div>

          {/* Sub Photos Grid */}
          <div className="grid grid-cols-4 gap-3">
            {imagesList.slice(1, 4).map((url, index) => (
              <div
                key={index}
                onClick={() => handleImageClick(index + 1)} // Index ကို main photo အပြီးဆက်တွက်ခြင်း
                className="rounded-xl overflow-hidden aspect-square border border-slate-100 shadow-xs bg-slate-50 cursor-pointer hover:opacity-90 transition-opacity group"
              >
                <img
                  src={url}
                  alt={`Sub View ${index}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}

            {/* +More Photos Box */}
            <div
              onClick={() => handleImageClick(4)}
              className="relative rounded-xl overflow-hidden aspect-square border border-slate-100 shadow-xs bg-slate-900 cursor-pointer group"
            >
              <img
                src={imagesList[4]}
                alt="More"
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs md:text-sm tracking-wide">
                +5 Photos
              </div>
            </div>
          </div>
        </div>

        {/* Text & Amenities Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h4 className="font-title text-base font-bold text-on-surface mb-2">
              About the Room
            </h4>
            <p className="text-xs md:text-sm text-on-surface-variant/80 leading-relaxed font-medium">
              This Deluxe Suite is designed to provide the best city views. It
              features modern furniture, a comfortable bed, and premium
              amenities. It is especially suitable for both business travelers
              and leisure guests.
            </p>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h4 className="font-title text-base font-bold text-on-surface mb-4">
              Amenities
            </h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-on-surface-variant font-medium text-xs md:text-sm">
              <div className="flex items-center space-x-3">
                <WifiOutlined className="text-[#0F296D]! text-base!" />
                <span>Wi-Fi</span>
              </div>
              <div className="flex items-center space-x-3">
                <ControlOutlined className="text-[#0F296D]! text-base! rotate-90" />
                <span>AC</span>
              </div>
              <div className="flex items-center space-x-3">
                <DesktopOutlined className="text-[#0F296D]! text-base!" />
                <span>Smart TV</span>
              </div>
              <div className="flex items-center space-x-3">
                <CoffeeOutlined className="text-[#0F296D]! text-base!" />
                <span>Minibar</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvironmentOutlined className="text-[#0F296D]! text-base!" />
                <span>City View</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-4 h-4 text-slate-400 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 6c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v1h3v2H4V7h3V6zM4 11h16v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V11z" />
                </svg>
                <span>Shower</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Booking History Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-title text-base font-bold text-on-surface">
            Recent Booking History
          </h4>
          <Button
            type="text"
            className="text-blue-600! font-semibold! text-xs!"
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={bookingHistory}
            pagination={false}
            className="border! border-slate-50! rounded-xl! overflow-hidden! font-sans! min-w-150!"
          />
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
