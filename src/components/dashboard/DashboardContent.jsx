import React from "react";
import { Button, Table, Space, Tooltip, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";

const DashboardContent = () => {
  // Mock Data
  const stats = [
    {
      title: "အခန်းစုစုပေါင်း",
      value: "၁၂၄",
      sub: "↑ ၄ အခန်း (ယခုလ)",
      color: "border-l-primary",
      icon: "🏨",
    },
    {
      title: "လက်ရှိငှားထားသောအခန်း",
      value: "၈၆",
      sub: "စက်ဝန်းညွှန်းကိန်း ၇၀%",
      color: "border-l-blue-600",
      icon: "👤",
      progress: true,
    },
    {
      title: "အားလပ်သောအခန်း",
      value: "၃၂",
      sub: "၂၅.၈% အားလပ်သည်",
      color: "border-l-emerald-500",
      icon: "✅",
    },
    {
      title: "ပြင်ဆင်နေသောအခန်း",
      value: "၆",
      sub: "အရေးပေါ်ပြင်ဆင်မှု (၂)",
      color: "border-l-rose-500",
      icon: "🛠️",
    },
  ];

  const columns = [
    {
      title: "ROOM NO.",
      dataIndex: "roomNo",
      key: "roomNo",
      render: (text) => (
        <span className="font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap">
          {text}
        </span>
      ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      className:
        "text-sm text-on-surface-variant font-medium whitespace-nowrap",
    },
    {
      title: "FLOOR",
      dataIndex: "floor",
      key: "floor",
      className: "text-sm text-outline whitespace-nowrap",
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-bold text-on-surface whitespace-nowrap">
          ${price.toFixed(2)}
        </span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const styles = {
          AVAILABLE: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
          OCCUPIED: "bg-blue-50 text-blue-600 border-blue-200/50",
          CLEANING: "bg-amber-50 text-amber-600 border-amber-200/50",
          MAINTENANCE: "bg-rose-50 text-rose-600 border-rose-200/50",
        };
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${styles[status]}`}
          >
            • {status}
          </span>
        );
      },
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: () => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined className="text-blue-500" />}
          />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      roomNo: "အခန်း ၁၀၁",
      type: "Deluxe Suite",
      floor: "First Floor",
      price: 240,
      status: "AVAILABLE",
    },
    {
      id: 2,
      roomNo: "အခန်း ၁၀2",
      type: "Double Standard",
      floor: "First Floor",
      price: 120,
      status: "OCCUPIED",
    },
    {
      id: 3,
      roomNo: "အခန်း ၂၀၄",
      type: "Single Room",
      floor: "Second Floor",
      price: 85,
      status: "CLEANING",
    },
    {
      id: 4,
      roomNo: "အခန်း ၃၀၁",
      type: "Presidential Suite",
      floor: "Penthouse Floor",
      price: 550,
      status: "MAINTENANCE",
    },
    {
      id: 5,
      roomNo: "အခန်း ၁၀၅",
      type: "Double Standard",
      floor: "First Floor",
      price: 120,
      status: "AVAILABLE",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-title text-xl md:text-2xl font-bold text-on-surface mb-0.5">
            အခန်းစီမံခန့်ခွဲမှု
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant/80">
            ဟိုတယ်ရှိ အခန်းများအားလုံးကို စီမံခန့်ခွဲနိုင်ပါသည်။
          </p>
        </div>
        <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
          <Button
            icon={<DownloadOutlined />}
            className="flex-1 sm:flex-none h-9 md:h-10 rounded-xl font-medium border-slate-200 text-on-surface-variant text-xs md:text-sm"
          >
            ထုတ်ယူရန်
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="flex-1 sm:flex-none h-9 md:h-10 rounded-xl bg-primary hover:bg-primary-container font-semibold border-none text-xs md:text-sm"
          >
            အခန်းအသစ်ထည့်ရန်
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-4 md:p-5 rounded-2xl border-l-4 border-y border-r border-slate-100 border-l-primary shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1 w-full">
              <p className="text-[11px] md:text-xs font-bold text-on-surface-variant/70 tracking-wide">
                {item.title}
              </p>
              <h3 className="font-title text-2xl md:text-3xl font-bold text-on-surface">
                {item.value}
              </h3>
              {item.progress ? (
                <div className="w-2/3 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-blue-600 h-full w-[70%]" />
                </div>
              ) : (
                <p className="text-[10px] md:text-[11px] font-medium text-on-surface-variant/50">
                  {item.sub}
                </p>
              )}
            </div>
            <div className="text-xl md:text-2xl opacity-80 bg-slate-50 w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center border border-slate-100">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Select
              defaultValue="all"
              className="w-full sm:w-36 h-9"
              options={[{ value: "all", label: "အခြေအနေ: အားလုံး" }]}
            />
            <Select
              defaultValue="all-types"
              className="w-full sm:w-44 h-9"
              options={[{ value: "all-types", label: "အမျိုးအစား: အားလုံး" }]}
            />
          </div>
          <p className="text-xs font-medium text-outline hidden md:block">
            စုစုပေါင်း ၁၂၄ ခုတွင် ၅ ခုပြသနေသည်
          </p>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            className="border border-slate-50 rounded-xl overflow-hidden font-sans min-w-150"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 pt-4 border-t border-slate-50">
          <span className="text-xs text-outline font-medium text-center sm:text-left">
            Showing 5 of 124 entries
          </span>
          <div className="flex justify-center space-x-2">
            <Button size="small" className="rounded-lg text-xs font-medium">
              Previous
            </Button>
            <Button
              size="small"
              type="primary"
              className="bg-primary rounded-lg text-xs font-semibold"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="font-title text-base font-bold text-on-surface mb-1">
            Room Occupancy Trends
          </h4>
          <p className="text-xs text-on-surface-variant/70 mb-6">
            လွန်ခဲ့သော ၇ ရက်အတွင်း အခန်းငှားရမ်းမှု အခြေအနေ
          </p>
          <div className="overflow-x-auto">
            <div className="h-40 flex items-end justify-between px-2 border-b border-slate-100 pb-2 text-[10px] font-bold text-outline uppercase tracking-wider min-w-100">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center space-y-2 w-full"
                  >
                    <div
                      className="w-6 md:w-8 bg-primary/10 hover:bg-primary rounded-t-lg transition-all"
                      style={{ height: `${[40, 65, 50, 85, 75, 90, 60][i]}px` }}
                    />
                    <span>{day}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="font-title text-base font-bold text-on-surface mb-4">
            Quick Actions
          </h4>
          <div className="space-y-3">
            {[
              {
                title: "Cleaning Check",
                desc: "သန့်ရှင်းရေး အခြေအနေစစ်ရန်",
                icon: "🧹",
              },
              {
                title: "Manage Amenities",
                desc: "အခန်းသုံးပစ္စည်းများ စီမံရန်",
                icon: "📦",
              },
              {
                title: "Bulk Check-out",
                desc: "အစုလိုက် ထွက်ခွာခြင်း စာရင်းသွင်းရန်",
                icon: "🚪",
              },
            ].map((act, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-primary/20 bg-surface/40 hover:bg-white cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{act.icon}</span>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                      {act.title}
                    </h5>
                    <p className="text-[10px] text-on-surface-variant/70 mt-0.5">
                      {act.desc}
                    </p>
                  </div>
                </div>
                <RightOutlined className="text-xs text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
