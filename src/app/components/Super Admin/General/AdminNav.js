
"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  Building2,
  DollarSign,
  BarChart2,
  FileText,
  BookOpen,
  ChevronLeft,
  CheckCircle,
  History,
  Receipt,
  Settings,
} from "lucide-react";

const NavigationSidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen, 
}) => {
  const [userEmail, setUserEmail] = useState("");

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

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "enterprise", label: "Business Approval", icon: Building2 },
    { id: "scanhistory", label: "Scan History", icon: History },
     { id: "EnterpriseUsers", label: "Enterprise Users", icon: Building2 },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "billing", label: "Billing Logs", icon: Receipt },
    { id: "api-docs", label: "API Documentation", icon: BookOpen },
    { id: "access", label: "Access Grant", icon: CheckCircle },
    { id: "displaysettings", label: "Display Settings", icon: Settings },

    // { id: "content", label: "Content Management", icon: FileText },
    // { id: "activity", label: "User Activity", icon: BarChart2 },
  ];

  const handleTabClick = (tabId, tabLabel) => {
    setActiveTab(tabLabel);
    console.log(`Switched to tab: ${tabId}`);
  };

  return (
    <>
      {/* Main Sidebar */}
      <div
        className={`
          sidebar-container fixed left-0 bg-gray-900 shadow-lg border-r border-gray-700 
          transition-all duration-300 ease-in-out flex flex-col z-40
          ${sidebarOpen ? "w-4/5 sm:w-64" : "w-16"}
          top-15.5 h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] min-h-0
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
              {tabs.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === label;
                return (
                  <button
                    key={id}
                    onClick={() => handleTabClick(id, label)}
                    className={`
                      relative w-full flex items-center text-left rounded-lg transition-all duration-200 group
                      ${sidebarOpen ? "px-4 py-3" : "px-2 py-3 justify-center"}
                      ${
                        isActive
                          ? "bg-gray-800 border border-gray-600"
                          : "hover:bg-gray-800"
                      }
                    `}
                    style={{color: '#e0aa3e'}}
                    title={!sidebarOpen ? label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />

                    {sidebarOpen && (
                      <>
                        <span className="ml-3 font-medium">{label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 rounded-full opacity-75" style={{backgroundColor: '#e0aa3e'}} />
                        )}
                      </>
                    )}

                    {/* Tooltip on collapsed state */}
                    {!sidebarOpen && (
                      <div className="absolute left-16 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {label}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45" />
                      </div>
                    )}
                  </button>
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