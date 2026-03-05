'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAutoLogout from '../../hooks/Autologout';

/**
 * Shared dashboard layout shell used by both Card-Scan and Crypto dashboards.
 *
 * Props:
 *  - SidebarComponent : the sidebar to render (CardSidebar or CryptoSidebar)
 *  - sidebarProps     : extra props forwarded to the sidebar (activeTab, status, etc.)
 *  - headerTitle      : text shown in the top header bar
 *  - children         : the active screen content
 *  - loginPath        : where to redirect on logout (default "/login")
 *  - brandColor       : accent colour for header (default '#e0aa3e')
 */
export default function DashboardLayout({
  SidebarComponent,
  sidebarProps = {},
  headerTitle = 'Dashboard',
  children,
  loginPath = '/login',
  brandColor = '#e0aa3e',
}) {
  const router = useRouter();
  useAutoLogout();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Responsive sidebar
  useEffect(() => {
    const checkScreenSize = () => {
      const isLg = window.innerWidth >= 1024;
      setIsLargeScreen(isLg);
      setSidebarOpen(isLg);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberLogin');
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('savedCountryCode');
    localStorage.removeItem('businessSubmissionId');
    router.replace(loginPath);
  };

  return (
    <div className="h-screen bg-black text-black flex overflow-hidden">
      {/* Sidebar */}
      <SidebarComponent
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isLargeScreen={isLargeScreen}
        {...sidebarProps}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-gray-900 text-white shadow-sm border-b border-gray-700">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">{headerTitle}</h2>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 bg-black">{children}</div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && !isLargeScreen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
