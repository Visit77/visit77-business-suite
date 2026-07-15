import React from "react";
import { Button, Table, Input, Select, Tag, Space, DatePicker } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

const RoomBookingList = () => {
  // Columns သစ်များဖြစ်သော Guest Name, Room Type, Check-in, Check-out, Total Price, Status နှင့် Action တို့အတွက် Data အသစ်များ
  const guestsData = [
    {
      key: "1",
      initials: "UK",
      name: "U Kyaw Min",
      email: "kyawmin@gmail.com",
      roomType: "Deluxe Suite",
      checkIn: "2026-07-10 14:00",
      checkOut: "2026-07-12 12:00",
      totalPrice: "$240.00",
      status: "Active",
    },
    {
      key: "2",
      initials: "DT",
      name: "Daw Thuzar",
      email: "thuzar.dev@gmail.com",
      roomType: "Double Deluxe",
      checkIn: "2026-07-08 13:30",
      checkOut: "2026-07-11 12:00",
      totalPrice: "$300.00",
      status: "Active",
    },
    {
      key: "3",
      initials: "AM",
      name: "Aung Myo",
      email: "aungmyo.hotel@gmail.com",
      roomType: "Single Premium",
      checkIn: "2026-07-01 11:00",
      checkOut: "2026-07-03 12:00",
      totalPrice: "$120.00",
      status: "Inactive",
    },
    {
      key: "4",
      initials: "SM",
      name: "Sithu Maung",
      email: "sithu.m@gmail.com",
      roomType: "Deluxe Suite",
      checkIn: "2026-07-14 15:00",
      checkOut: "2026-07-16 12:00",
      totalPrice: "$240.00",
      status: "Active",
    },
  ];

  const columns = [
    {
      title: (
        <span className="text-[11px]! font-bold! text-slate-400! tracking-wider!">
          GUEST NAME
        </span>
      ),
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex! items-center! space-x-3! py-0.5!">
          <div className="w-8! h-8! rounded-full! bg-slate-100! text-slate-600! font-bold! text-xs! flex! items-center! justify-center! uppercase! shrink-0! border! border-slate-200/40!">
            {record.initials}
          </div>
          <div className="flex! flex-col!">
            <span className="font-bold! text-slate-800! text-xs! md:text-sm! leading-tight!">
              {text}
            </span>
            <span className="text-[10px]! md:text-xs! text-slate-400! font-medium! mt-0.5!">
              {record.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <span className="text-[11px]! font-bold! text-slate-400! tracking-wider!">
          ROOM TYPE
        </span>
      ),
      dataIndex: "roomType",
      key: "roomType",
      render: (text) => (
        <span className="font-bold! text-slate-700! bg-slate-50! border! border-slate-200/40! px-2.5! py-1! rounded-lg! text-xs! inline-block!">
          {text}
        </span>
      ),
    },
    {
      title: (
        <span className="text-[11px]! font-bold! text-slate-400! tracking-wider!">
          CHECK-IN TIME
        </span>
      ),
      dataIndex: "checkIn",
      key: "checkIn",
      render: (text) => (
        <span className="text-xs! md:text-sm! font-semibold! text-slate-600! whitespace-nowrap!">
          {text}
        </span>
      ),
    },
    {
      title: (
        <span className="text-[11px]! font-bold! text-slate-400! tracking-wider!">
          CHECK-OUT TIME
        </span>
      ),
      dataIndex: "checkOut",
      key: "checkOut",
      render: (text) => (
        <span className="text-xs! md:text-sm! font-semibold! text-slate-600! whitespace-nowrap!">
          {text}
        </span>
      ),
    },
    {
      title: (
        <span className="text-[11px]! font-bold! text-slate-400! tracking-wider!">
          TOTAL PRICE
        </span>
      ),
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => (
        <span className="text-xs! md:text-sm! font-bold! text-[#0F296D]!">
          {text}
        </span>
      ),
    },
    {
      title: (
        <span className="text-[11px]! font-bold! text-slate-400! tracking-wider!">
          STATUS
        </span>
      ),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const isActive = status === "Active";
        return (
          <Tag
            className={`rounded-full! px-3! py-0.5! text-[11px]! font-bold! border! ${
              isActive
                ? "bg-emerald-50/70! text-emerald-600! border-emerald-200/50!"
                : "bg-slate-50! text-slate-400! border-slate-200/60!"
            }`}
          >
            • {status}
          </Tag>
        );
      },
    },
    {
      title: (
        <span className="text-[11px]! font-bold! text-slate-400! tracking-wider! block! text-center!">
          ACTIONS
        </span>
      ),
      key: "actions",
      align: "center",
      width: 100,
      render: () => (
        <Space size="middle">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined className="text-blue-500!" />}
            className="flex! items-center! justify-center! hover:bg-blue-50!"
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            className="flex! items-center! justify-center! hover:bg-red-50!"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6! animate-fade-in! pb-10! font-sans! bg-[#FAFBFD]! min-h-screen!">
      {/* 1. Top Header Segment */}
      <div className="flex! flex-col! sm:flex-row! justify-between! items-start! sm:items-center! gap-4!">
        <div>
          <h1 className="font-title! text-xl! md:text-2xl! font-bold! text-slate-800! mb-0.5!">
            Guests Management
          </h1>
          <p className="text-xs! md:text-sm! text-slate-400! font-medium!">
            View, search, and manage all checked-in and historic guest records.
          </p>
        </div>
        <div className="flex! space-x-2! sm:space-x-3! w-full! sm:w-auto!">
          <Button
            icon={<DownloadOutlined />}
            className="flex-1! sm:flex-none! h-10! px-5! rounded-xl! font-bold! border-slate-200! text-slate-500! text-xs! md:text-sm! hover:bg-slate-50!"
          >
            Export
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="flex-1! sm:flex-none! h-10! px-5! rounded-xl! bg-[#0F296D]! hover:bg-[#1a3b8b]! font-bold! border-none! text-xs! md:text-sm! shadow-sm!"
          >
            Add Guest
          </Button>
        </div>
      </div>

      {/* 2. Main Layout Box */}
      <div className="bg-white! p-5! md:p-6! rounded-3xl! border! border-slate-100! shadow-xs! space-y-6!">
        {/* Exact Layout Filter Control Center */}
        <div className="bg-white! rounded-2xl! border! border-slate-100! p-4! shadow-2xs!">
          <div className="grid! grid-cols-1! sm:grid-cols-2! lg:grid-cols-5! gap-4! items-end!">
            {/* 1. Name Search */}
            <div className="space-y-1.5!">
              <span className="text-[11px]! font-bold! text-slate-400! tracking-wide! block!">
                Search Guest
              </span>
              <Input
                placeholder="Search name, email..."
                prefix={<SearchOutlined className="text-slate-400! mr-1.5!" />}
                className="w-full! h-10! rounded-xl! bg-slate-50/50! border-slate-200! text-xs! font-medium!"
              />
            </div>

            {/* 2. Room Type Filter Dropdown */}
            <div className="space-y-1.5!">
              <span className="text-[11px]! font-bold! text-slate-400! tracking-wide! block!">
                Room Type
              </span>
              <Select
                defaultValue="all"
                className="w-full! h-10! rounded-xl! font-semibold! text-slate-600!"
                options={[
                  { value: "all", label: "All Room Types" },
                  { value: "single", label: "Single Premium" },
                  { value: "double", label: "Double Deluxe" },
                  { value: "deluxe", label: "Deluxe Suite" },
                ]}
              />
            </div>

            {/* 3. Status Dropdown */}
            <div className="space-y-1.5!">
              <span className="text-[11px]! font-bold! text-slate-400! tracking-wide! block!">
                Status
              </span>
              <Select
                defaultValue="all"
                className="w-full! h-10! rounded-xl! font-semibold! text-slate-600!"
                options={[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </div>

            {/* 4. Checkin/out Date Filter (RangePicker) */}
            <div className="space-y-1.5! sm:col-span-2! lg:col-span-1!">
              <span className="text-[11px]! font-bold! text-slate-400! tracking-wide! block!">
                Check-in / Check-out Date
              </span>
              <RangePicker
                className="w-full! h-10! rounded-xl! bg-slate-50/50! border-slate-200! font-sans! text-xs!"
                suffixIcon={<CalendarOutlined className="text-slate-400!" />}
              />
            </div>

            {/* 5. Filter Submission Button */}
            <div>
              <button
                type="button"
                className="w-full! h-10! bg-amber-300! hover:bg-amber-400! font-title! text-xs! font-bold! text-slate-800! rounded-xl! border-none! shadow-none! cursor-pointer! transition-colors!"
              >
                Filter Guests
              </button>
            </div>
          </div>
        </div>

        {/* 3. Updated Dynamic Structured Guest Data Table */}
        <div className="overflow-x-auto! border! border-slate-100! rounded-2xl!">
          <Table
            columns={columns}
            dataSource={guestsData}
            pagination={false}
            className="font-sans! min-w-230! [&_.ant-table-thead_th]:bg-slate-50/60! [&_.ant-table-thead_th]:py-3.5! [&_.ant-table-row]:border-b! [&_.ant-table-row]:border-slate-50! [&_td]:py-3!"
          />
        </div>

        {/* 4. Footer Pagination Control */}
        <div className="flex! flex-col! sm:flex-row! justify-between! items-center! gap-4! pt-2!">
          <span className="text-xs! text-slate-400! font-bold!">
            Showing 1-4 of 4 entries
          </span>
          <div className="flex! justify-center! space-x-1.5!">
            <Button
              size="small"
              disabled
              className="rounded-lg! text-xs! font-bold! px-3! h-8! border-slate-200! text-slate-300!"
            >
              Previous
            </Button>
            <Button
              size="small"
              type="primary"
              className="bg-[#0F296D]! border-none! rounded-lg! text-xs! font-bold! px-3.5! h-8!"
            >
              1
            </Button>
            <Button
              size="small"
              className="rounded-lg! text-xs! font-bold! px-3! h-8! border-slate-200! text-slate-500! hover:text-[#0F296D]!"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomBookingList;
