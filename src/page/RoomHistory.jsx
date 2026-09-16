import React, { useEffect, useState } from "react";
import { Table, DatePicker, Tabs, Tooltip } from "antd";

import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { getRoomHistory, roomSelector } from "../service/roomSlice";
import {
  FilePdfOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

const RoomHistory = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [dates, setDates] = useState([dayjs().subtract(30, "day"), dayjs()]);

  const navigate = useNavigate();
  const { id } = useParams();
  const businessId = useSelector(selectBusinessId);

  const { history: roomData = [], isPending } = useSelector(roomSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id && businessId) {
      const payload = {
        id: id,
        business_id: businessId,
      };

      if (dates && dates[0] && dates[1]) {
        payload.date_from = dates[0].format("YYYY-MM-DD");
        payload.date_to = dates[1].format("YYYY-MM-DD");
      }

      dispatch(getRoomHistory(payload));
    }
  }, [id, businessId, dates, dispatch]);

  const handleDateChange = (values) => {
    setDates(values);
  };

  if (isPending) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // Table Columns Setup
  const columns = [
    {
      title: "Time",
      dataIndex: "performed_at",
      key: "time",
      render: (text) => (
        <span className="font-medium text-gray-600">
          {dayjs(text).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-gray-800">
            {record.action_label}
          </span>
          {record.booking_source_label && (
            <span className="text-blue-600 font-medium text-xs">
              ({record.booking_source_label})
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Staff / Actor",
      dataIndex: ["actor", "type_label"],
      key: "staff",
      render: (text) => text || "NA",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            <FileTextOutlined className="text-blue-500 text-lg cursor-pointer hover:text-blue-700" />
          </Tooltip>
        ) : (
          <span className="text-gray-400">NA</span>
        ),
    },
    {
      title: "Guest",
      dataIndex: "guest_name",
      key: "guest",
      render: (text) =>
        text ? (
          <span className="font-medium text-gray-700">{text}</span>
        ) : (
          <span className="text-gray-400">NA</span>
        ),
    },
    {
      title: "Invoice",
      key: "invoice",
      render: (_, record) =>
        record.invoice_url ? (
          <a
            href={`https://uat.api.business.visit77.com${record.invoice_url}`}
            target="_blank"
            rel="noreferrer"
          >
            <FilePdfOutlined className="text-blue-600 text-xl hover:text-blue-800" />
          </a>
        ) : (
          <span className="text-gray-400">NA</span>
        ),
    },
  ];

  const groupedData = (roomData || []).reduce((acc, curr) => {
    const date = dayjs(curr.performed_at).format("DD.MM.YYYY");
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {/* Date Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-xs text-gray-400 font-medium mb-1">
                Date Range Filter
              </label>
              <RangePicker
                value={dates}
                onChange={handleDateChange}
                format="DD MMM YYYY"
                className="w-72"
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="w-full md:w-auto">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              centered
              items={[
                {
                  label: (
                    <span className="px-4 font-semibold text-base">
                      Overview
                    </span>
                  ),
                  key: "1",
                },
                {
                  label: (
                    <span className="px-4 font-semibold text-base">
                      Guest View
                    </span>
                  ),
                  key: "2",
                },
              ]}
            />
          </div>
        </div>

        {/* Content Display */}
        {activeTab === "1" ? (
          <div className="space-y-6">
            {Object.keys(groupedData).map((date) => (
              <div
                key={date}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Date Header Tag */}
                <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 text-sm">
                  {date}
                </div>

                {/* Antd Table */}
                <Table
                  columns={columns}
                  dataSource={groupedData[date]}
                  rowKey="id"
                  pagination={false}
                  size="middle"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <UserOutlined className="text-4xl mb-2 text-gray-300" />
            <p>Guest View Content will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomHistory;
