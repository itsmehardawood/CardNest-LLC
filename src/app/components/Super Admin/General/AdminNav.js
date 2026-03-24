
"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  Building2,
  DollarSign,
  BookOpen,
  ChevronLeft,
  ChevronDown,
  CheckCircle,
  History,
  Receipt,
  Settings,
  Shield,
  Coins,
  RefreshCcw,
} from "lucide-react";

const NavigationSidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen, 
}) => {
  const [userEmail, setUserEmail] = useState("");
  const [openGroupId, setOpenGroupId] = useState(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("userData");
      if (storedData) {
        const userData = JSON.parse(storedData);
        const now = new Date().getTime();
        if (userData.expirationTime && now > userData.expirationTime) {
          localStorage.removeItem("userData");
        } else if (userData.user?.email) {
          setUserEmail(userData.user.email);
        }
      }
    } catch (err) {
      console.error("Error reading userData:", err);
    }
  }, []);
  const navigationGroups = [
    {
      id: "cardScan",
      label: "CardScan | Business",
      icon: Building2,
      accentColor: "#e0aa3e",
      textColor: "#e0aa3e",
      activeBackground: "rgba(224, 170, 62, 0.16)",
      submenu: [
        { id: "home", label: "Home", icon: Home },
        { id: "scanhistory", label: "Scan History", icon: History },
        { id: "EnterpriseUsers", label: "Enterprise Users", icon: Building2 },
        { id: "pricing", label: "Pricing", icon: DollarSign },
        { id: "billing", label: "Billing Logs", icon: Receipt },
        { id: "renewalSubscription", label: "Renewal Subscription", icon: RefreshCcw },
        { id: "api-docs", label: "API Documentation", icon: BookOpen },
        { id: "access", label: "Access Grant", icon: CheckCircle },
        { id: "displaysettings", label: "Display Settings", icon: Settings },
      ],
    },

     {
      id: "cryptoProfiles",
      label: "Crypto | Business ",
      icon: Coins,
      accentColor: "#f5a2ad",
      textColor: "#e88290",
      activeBackground: "rgba(153, 27, 27, 0.16)",
    },
    {
      id: "kycProfiles",
      label: "KYC | Business",
      icon: Shield,
      accentColor: "#38bdf8",
      textColor: "#38bdf8",
      activeBackground: "rgba(56, 189, 248, 0.16)",
    },
   
  ];

  const handleTabClick = (tabId, tabLabel) => {
    setActiveTab(tabLabel);
    console.log(`Switched to tab: ${tabId}`);
  };

  const handleMainItemClick = (group) => {
    handleTabClick(group.id, group.label);

    if (!group.submenu?.length) {
      return;
    }

    setOpenGroupId((currentGroupId) =>
      currentGroupId === group.id ? null : group.id
    );
  };

  return (
    <>
      {/* Main Sidebar */}
      <div
        className={`
          sidebar-container fixed left-0 bg-gray-900 shadow-lg border-r border-gray-700 
          transition-all duration-300 ease-in-out flex flex-col z-40
          ${sidebarOpen ? "w-[85vw] sm:w-72" : "w-16"}
          top-15.5 h-[calc(100dvh-4rem)] min-h-0
        `}
      >
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Header */}
        <div className="flex-shrink-0 p-4 ">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold" style={{color: '#e0aa3e'}}>Admin Panel</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-800 transition"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <ChevronLeft
                className={`w-4 h-4 transition-transform duration-200 ${
                  sidebarOpen ? "rotate-0" : "rotate-180"
                }`}
                style={{color: '#e0aa3e'}}
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-4">
            <div className={`${sidebarOpen ? "px-4" : "px-2"} space-y-2`}>
              {navigationGroups.map((group) => {
                const { id, label, icon: Icon, submenu, accentColor, textColor, activeBackground } = group;
                const isMainActive =
                  activeTab === label || submenu?.some((item) => item.label === activeTab);
                const isExpanded = openGroupId === id;

                return (
                  <div
                    key={id}
                    className="group relative"
                  >
                    <button
                      onClick={() => handleMainItemClick(group)}
                      className={`
                        relative w-full flex items-center text-left rounded-xl border transition-all duration-200
                        ${sidebarOpen ? "px-4 py-3" : "px-2 py-3 justify-center"}
                        ${isMainActive ? "shadow-sm" : "border-transparent hover:bg-gray-800/80"}
                      `}
                      style={{
                        color: textColor || accentColor,
                        backgroundColor: isMainActive ? activeBackground : "transparent",
                        borderColor: isMainActive ? accentColor : "transparent",
                      }}
                      title={!sidebarOpen ? label : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />

                      {sidebarOpen && (
                        <>
                          <span className="ml-3 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                            {label}
                          </span>

                          {submenu?.length ? (
                            <ChevronDown
                              className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          ) : isMainActive ? (
                            <div
                              className="ml-auto w-2 h-2 rounded-full opacity-90"
                              style={{ backgroundColor: accentColor }}
                            />
                          ) : null}
                        </>
                      )}

                      {!sidebarOpen && (
                        <div className="absolute left-16 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {label}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45" />
                        </div>
                      )}
                    </button>

                    {sidebarOpen && submenu?.length ? (
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded ? "max-h-[32rem] opacity-100 mt-2" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="ml-5 pl-4 border-l border-gray-700/80 space-y-1">
                          {submenu.map(({ id: subId, label: subLabel, icon: SubIcon }) => {
                            const isSubActive = activeTab === subLabel;

                            return (
                              <button
                                key={subId}
                                onClick={() => handleTabClick(subId, subLabel)}
                                className={`
                                  w-full flex items-center rounded-lg text-left px-3 py-2.5 text-sm transition-all duration-200
                                  ${
                                    isSubActive
                                      ? "bg-gray-800"
                                      : "hover:bg-gray-800/70"
                                  }
                                `}
                                style={{ color: textColor || accentColor }}
                              >
                                <SubIcon className="h-4 w-4 flex-shrink-0" />
                                <span className="ml-3 whitespace-nowrap overflow-hidden text-ellipsis">
                                  {subLabel}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Expanded Bottom Info */}
        {sidebarOpen && (
          <div className="flex-shrink-0 p-4 border-t border-gray-700">
            <div className="mb-3 flex items-center space-x-2 text-sm text-gray-400">
              <span>Dashboard</span>
              <span>•</span>
              <span className="font-medium" style={{color: '#e0aa3e'}}>{activeTab}</span>
            </div>

            <div className="px-3 py-2 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">SA</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{color: '#e0aa3e'}}>
                    Super Admin
                  </p>
                  <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Bottom Info */}
        {!sidebarOpen && (
          <div className="flex-shrink-0 p-2 border-t border-gray-700">
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group relative">
                <span className="text-white text-xs font-medium">SA</span>
                <div className="absolute left-10 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  <div className="text-center">
                    <div className="font-medium" style={{color: '#e0aa3e'}}>Super Admin</div>
                    <div className="text-xs opacity-75">{userEmail}</div>
                  </div>
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NavigationSidebar;