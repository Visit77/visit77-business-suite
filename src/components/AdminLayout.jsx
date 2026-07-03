import React, { useState } from "react";
import { Layout, Menu, Input, Badge, Avatar, Drawer, Button } from "antd";
import {
  AppstoreOutlined,
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  PlusOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { logout } from "../service/authSlice";
import { TOKEN_LABEL } from "../variables/constants";

const { Sider, Content, Header } = Layout;

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const menuItems = [
    { key: "dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
    { key: "rooms", icon: <HomeOutlined />, label: "Room Management" },
    { key: "bookings", icon: <CalendarOutlined />, label: "Bookings" },
    { key: "guests", icon: <UserOutlined />, label: "Guests" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between bg-white">
      <div>
        {/* Brand Logo */}
        <div className="p-6 border-b border-slate-50 flex items-center space-x-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
            LM
          </div>
          <div>
            <h2 className="font-title text-base font-bold text-on-surface leading-tight">
              LuxeManage
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-wider text-outline">
              Premium Hospitality
            </p>
          </div>
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={["rooms"]}
          items={menuItems}
          className="border-none pt-4 px-3 space-y-1 text-on-surface-variant font-medium"
          style={{ backgroundColor: "transparent" }}
          onClick={() => setMobileMenuOpen(false)} // Mobile မှာ menu တစ်ခုနှိပ်ရင် drawer ပိတ်သွားစေရန်
        />
      </div>

      <div className="p-4 border-t border-slate-50 bg-white space-y-4">
        <button
          onClick={() => {
            // dispatch(logout());
            localStorage.removeItem(TOKEN_LABEL);
          }}
          className="w-full bg-primary hover:bg-primary-container text-white py-3 px-4 rounded-xl font-title text-sm font-semibold shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          {/* <PlusOutlined /> */}
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <Layout className="min-h-screen bg-background font-sans">
      <div className="hidden lg:block">
        <Sider
          width={260}
          theme="light"
          className="border-r border-slate-100 fixed h-screen left-0 top-0 bottom-0"
          style={{ position: "fixed", left: 0, top: 0, bottom: 0 }}
        >
          <SidebarContent />
        </Sider>
      </div>

      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={260}
        bodyStyle={{ padding: 0 }}
      >
        <SidebarContent />
      </Drawer>

      <Layout className="lg:pl-65 bg-background min-h-screen">
        {/* Top Navbar */}
        <Header className="bg-white! border-b! border-slate-100! h-16! px-4! md:px-8! flex! items-center! justify-between! sticky! top-0! z-50!">
          <div className="flex items-center space-x-3">
            <Button
              type="text"
              icon={<MenuOutlined className="text-lg" />}
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden! flex items-center justify-center"
            />
            <h3 className="font-title text-base md:text-lg font-bold text-on-surface">
              Room Management
            </h3>
          </div>

          <div className="flex! items-center! space-x-3! md:space-x-6!">
            <Input
              placeholder="ရှာဖွေရန်..."
              className="w-36! sm:w-48! md:w-72! bg-surface/60! border-slate-200/80! rounded-xl! px-3! py-1.5! text-xs! font-sans!"
            />

            <Badge count={3} size="small" offset={[-2, 2]}>
              <button className="text-outline! hover:text-primary! transition-colors! flex items-center">
                <BellOutlined className="text-lg! md:text-xl!" />
              </button>
            </Badge>

            <Avatar
              size="large"
              shape="square"
              icon={<UserOutlined />}
              className="bg-gray-400! cursor-pointer! hidden! sm:inline-block! px-2!"
            />
          </div>
        </Header>

        <Content className="p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
