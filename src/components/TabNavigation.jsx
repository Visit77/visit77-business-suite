import React from "react";

export const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "rooms", label: "Rooms" },
    { id: "bookings", label: "Bookings" },
    { id: "guests", label: "Guests" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="border-b border-slate-200 bg-white px-6">
      <nav className="flex gap-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 font-semibold text-sm relative transition-colors ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-md" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
