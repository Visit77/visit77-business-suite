import React, { useState } from "react";
import { Layout, Menu, Avatar, Drawer, Button } from "antd";
import {
  UserOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL, BUSINESS_LABEL, TOKEN_LABEL } from "../variables/constants";
import logo from "../assets/v77_logo.png";
import { businessSelector } from "../service/businessSlice";
import LogoutModal from "./modal/LogoutModal";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Baby02Icon,
  BedSingle02Icon,
  Building01Icon,
  CatIcon,
  CigaretteIcon,
  CoinsDollarIcon,
  ConciergeBellIcon,
  Coupon01Icon,
  DollarSignIcon,
  Door01Icon,
  MeetingRoomIcon,
  Restaurant01Icon,
  Shield01Icon,
  TaskEdit01Icon,
} from "@hugeicons/core-free-icons";
import LanguageSelect from "./LanguageSelect";

const { Sider, Content, Header } = Layout;

const ROUTE_CONFIG = [
  {
    path: "/rooms-board",
    key: "/rooms-board",
    label: "Room",
    breadcrumb: "Room Management",
    icon: <HugeiconsIcon icon={MeetingRoomIcon} />,
  },
  {
    path: "/rooms",
    key: "/rooms",
    label: "Room Type",
    breadcrumb: "Room Type Management",
    icon: <HugeiconsIcon icon={BedSingle02Icon} />,
  },
  {
    path: "/room-price",
    key: "/room-price",
    label: "Room Price",
    breadcrumb: "Room Price",
    icon: <HugeiconsIcon icon={DollarSignIcon} />,
  },
  {
    key: "ota-group",
    label: "OTA & Revenue",
    icon: <HugeiconsIcon icon={CoinsDollarIcon} />,
    children: [
      {
        path: "/ota-revenue",
        key: "/ota-revenue",
        label: "OTA Revenue Table",
        breadcrumb: "OTA Revenue",
        icon: <HugeiconsIcon icon={CoinsDollarIcon} />,
      },
      {
        path: "/ota-revenue/management",
        key: "/ota-revenue/management",
        label: "OTA Management",
        breadcrumb: "OTA Management",
        icon: <HugeiconsIcon icon={Door01Icon} />,
      },
    ],
  },
  {
    path: "/meal-plan/",
    key: "/meal-plan/",
    label: "Meal Plan",
    breadcrumb: "Meal Plan",
    icon: <HugeiconsIcon icon={Restaurant01Icon} />,
  },
  {
    path: "/ota-revenue/add-room",
    key: "/ota-revenue/add-room",
    breadcrumb: "Add Room for OTA",
  },
  {
    path: "/building-and-area",
    key: "/building-and-area",
    label: "Buildings & Areas",
    breadcrumb: "Building Management",
    icon: <HugeiconsIcon icon={Building01Icon} />,
  },
  {
    path: "/hotel-facility",
    key: "/hotel-facility",
    label: "Hotel Facility & Rating",
    breadcrumb: "Facility Management",
    icon: <HugeiconsIcon icon={ConciergeBellIcon} />,
  },
  {
    path: "/invoice-and-receipt",
    key: "/invoice-and-receipt",
    label: "Invoice & Receipt Setting",
    breadcrumb: "Invoice & Receipt Setting",
    icon: <HugeiconsIcon icon={Coupon01Icon} />,
  },
  {
    path: "/booking-details/:id/",
    key: "/booking-details/:id/",
    breadcrumb: "Booking Detail",
  },
  {
    path: "/ota-room-history/:id/",
    key: "/ota-room-history/:id/",
    breadcrumb: "OTA Room Histroy",
  },
  {
    key: "policies-group",
    label: "Policies",
    icon: <HugeiconsIcon icon={Shield01Icon} />,
    children: [
      {
        path: "/cancellation-policy",
        key: "/cancellation-policy",
        label: "Booking Cancellation",
        breadcrumb: "Booking Cancellation",
        icon: <HugeiconsIcon icon={TaskEdit01Icon} />,
      },
      {
        path: "/pet-policy",
        key: "/pet-policy",
        label: "Pet Policy",
        breadcrumb: "Pet Policy",
        icon: <HugeiconsIcon icon={CatIcon} />,
      },
      {
        path: "/smoking-policy",
        key: "/smoking-policy",
        label: "Smoking Policy",
        breadcrumb: "Smoking Policy",
        icon: <HugeiconsIcon icon={CigaretteIcon} />,
      },
      {
        path: "/child-policy",
        key: "/child-policy",
        label: "Child Policy",
        breadcrumb: "Child Policy",
        icon: <HugeiconsIcon icon={Baby02Icon} />,
      },
    ],
  },
];

// Breadcrumb / route matching အတွက် nested children တွေကိုပါ flat ထုတ်ယူခြင်း
const flattenRoutes = (routes) =>
  routes.flatMap((route) =>
    route.children ? flattenRoutes(route.children) : [route],
  );

const ALL_LEAF_ROUTES = flattenRoutes(ROUTE_CONFIG).filter(
  (route) => route.path,
);

// Ant Design Menu items အဖြစ် ပြောင်းလဲခြင်း
const buildMenuItems = (routes) =>
  routes.flatMap((item) => {
    if (item.children) {
      const childItems = buildMenuItems(item.children);
      return childItems.length > 0
        ? [
            {
              key: item.key,
              icon: item.icon,
              label: item.label,
              children: childItems,
            },
          ]
        : [];
    }

    if (item.label && item.path) {
      return [
        {
          key: item.key,
          icon: item.icon,
          label: <Link to={item.path}>{item.label}</Link>,
        },
      ];
    }

    return [];
  });

const menuItems = buildMenuItems(ROUTE_CONFIG);

const SidebarBody = ({
  collapsed = false,
  activeKey,
  onMenuClick,
  onOpenLogout,
}) => (
  <div className="flex flex-col h-full bg-white overflow-hidden">
    {/* Brand Logo */}
    <div
      className={`h-16 px-4 border-b border-slate-50 flex items-center shrink-0 font-medium ${
        collapsed ? "justify-center" : "space-x-3 px-6"
      }`}
    >
      <img
        className="w-9 h-9 rounded-xl object-contain shrink-0"
        src={logo}
        alt="Logo"
      />
      {!collapsed && (
        <h2 className="font-title text-base font-bold text-on-surface leading-tight truncate">
          Visit 77
        </h2>
      )}
    </div>

    {/* Scrollable Menu Area */}
    <div className="flex-1 min-h-0 overflow-y-auto">
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[activeKey]}
        items={menuItems}
        className="border-none py-3 px-2 space-y-1 text-on-surface-variant font-medium!"
        style={{ backgroundColor: "transparent" }}
        onClick={onMenuClick}
      />
    </div>

    {/* Footer Action - Hidden when sidebar is collapsed */}
    {!collapsed && (
      <div className="p-3 border-t border-slate-50 bg-white shrink-0">
        <button
          onClick={onOpenLogout}
          className="w-full bg-primary hover:bg-primary-container text-white py-2.5 px-3 rounded-xl text-sm font-semibold shadow-sm flex items-center justify-center transition-all active:scale-95 truncate"
          title="Log out"
        >
          <span>Log out</span>
        </button>
      </div>
    )}
  </div>
);

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { details } = useSelector(businessSelector);

  const currentRoute = [...ALL_LEAF_ROUTES]
    .sort((a, b) => b.path.length - a.path.length)
    .find(
      (route) =>
        location.pathname === route.path ||
        location.pathname.startsWith(`${route.path}/`),
    );

  const activeKey = currentRoute?.key || "/dashboard";
  const currentBreadcrumb = currentRoute?.breadcrumb || "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_LABEL);
    localStorage.removeItem(BUSINESS_LABEL);
    navigate("/login");
  };

  const handleSwitchBusiness = () => {
    navigate("/select-business");
  };

  return (
    <Layout className="min-h-screen bg-background font-sans">
      {/* Desktop Fixed Sider */}
      <div className="hidden lg:block">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={260}
          collapsedWidth={80}
          theme="light"
          className="border-r border-slate-100 h-screen transition-all duration-200"
          style={{ position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 40 }}
        >
          <SidebarBody
            collapsed={collapsed}
            activeKey={activeKey}
            onOpenLogout={() => setIsLogoutModalOpen(true)}
          />
        </Sider>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={260}
        styles={{ body: { padding: 0, height: "100%" } }}
      >
        <SidebarBody
          collapsed={false}
          activeKey={activeKey}
          onMenuClick={() => setMobileMenuOpen(false)}
          onOpenLogout={() => {
            setMobileMenuOpen(false);
            setIsLogoutModalOpen(true);
          }}
        />
      </Drawer>

      <Layout
        className={`bg-background min-h-screen transition-all duration-200 ${
          collapsed ? "lg:pl-20" : "lg:pl-65"
        }`}
      >
        <Header className="bg-white! border-b! border-slate-100! h-16! px-4! md:px-8! flex! items-center! justify-between! sticky! top-0! z-30!">
          <div className="flex items-center space-x-3">
            {/* Mobile Drawer Trigger */}
            <Button
              type="text"
              icon={<MenuOutlined className="text-lg" />}
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden! flex items-center justify-center"
            />

            {/* Desktop Sidebar Collapse Trigger */}
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined className="text-lg" />
                ) : (
                  <MenuFoldOutlined className="text-lg" />
                )
              }
              onClick={() => setCollapsed((prev) => !prev)}
              className="hidden! lg:flex! items-center justify-center"
              aria-label="Toggle sidebar"
            />

            {/* Dynamic Breadcrumb / Title */}
            <h3 className="font-title text-base md:text-lg font-bold text-on-surface">
              {currentBreadcrumb}
            </h3>
          </div>

          <div className="flex! items-center! space-x-3! md:space-x-6!">
            <LanguageSelect />

            {details?.profile ? (
              <img
                src={`${API_URL}${details.profile}`}
                alt={details?.name_1 || "Business profile"}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <Avatar
                size="large"
                shape="square"
                icon={<UserOutlined />}
                className="bg-gray-400! cursor-pointer! hidden! sm:inline-block! px-2!"
              />
            )}
          </div>
        </Header>

        <Content className="p-4 md:p-8 max-w-7xl w-full mx-auto bg-white">
          <Outlet />
        </Content>
      </Layout>

      <LogoutModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
        onSwitchBusiness={handleSwitchBusiness}
      />
    </Layout>
  );
};

export default AdminLayout;
