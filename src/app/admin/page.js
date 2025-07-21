'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingComponent from '../components/Super Admin/Loading';
import BusinessApprovalSection from '../components/Super Admin/BusinessApproved';
import PricingSectionAdmin from '../components/Super Admin/PricingSection';
import UserActivitySection from '../components/Super Admin/UserActivityScreen';
import ContentManagementSection from '../components/Super Admin/ContentManagement';
import APIDocumentationSection from '../components/Super Admin/ApiDoc';
import PageHeader from '../components/Super Admin/AdminHeader';
import NavigationSidebar from '../components/Super Admin/AdminNav';
import DashboardFooter from '../components/Super Admin/AdminFooter';
import HomePage from '../components/Super Admin/HomePage';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // Helper function to get userData and check if it's expired
  const getUserDataFromStorage = () => {
    try {
      const storedData = localStorage.getItem("userData");
      if (!storedData) return null;
      
      const userData = JSON.parse(storedData);
      const now = new Date().getTime();
      
      // Check if data has expired
      if (userData.expirationTime && now > userData.expirationTime) {
        localStorage.removeItem("userData");
        return null;
      }
      
      return userData;
    } catch (error) {
      console.error("Error reading userData from localStorage:", error);
      localStorage.removeItem("userData");
      return null;
    }
  };

  useEffect(() => {
    // Check authentication and authorization
    const checkAuth = () => {
      const userData = getUserDataFromStorage();
      
      if (!userData) {
        // No user data found or expired
        console.log("No valid user data found, redirecting to admin login");
        router.push("/admin-login");
        return;
      }
      
      // Check if user has SUPER_ADMIN role - strict check only
      const userRole = userData.user?.role;
      
      if (userRole !== "SUPER_ADMIN") {
        // User is not a superadmin - redirect to admin login regardless of role
        console.log("Access denied: User is not a superadmin");
        router.push("/admin-login");
        return;
      }
      
      // User is authenticated and is a superadmin
      console.log("Access granted: User is a superadmin");
      setIsAuthenticated(true);
    };

    // Enable authentication check
    checkAuth();
  }, [router]);

  useEffect(() => {
    // Only start the loading simulation if user is authenticated
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Show loading spinner while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // const getPageDescription = (tabName) => {
  //   const descriptions = {
  //     'Enterprise Approval': 'Review and manage enterprise client approval requests and business verifications',
  //     'Pricing': 'Configure pricing plans, subscription tiers, and billing settings for all user types',
  //     'User Activity': 'Monitor user engagement, API usage statistics, and platform activity in real-time',
  //     'Content Management': 'Create, edit, and moderate content across the platform with publishing controls',
  //     'API Documentation': 'Manage API documentation, integration guides, and developer resources'
  //   };
  //   return descriptions[tabName] || `Manage and monitor your ${tabName.toLowerCase()} settings`;
  // };

  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingComponent message="Loading dashboard..." />;
    }

    switch (activeTab) {
      case 'Home':
        return <HomePage/>
      case 'Enterprise Approval':
        return <BusinessApprovalSection />;
      case 'Pricing':
        return <PricingSectionAdmin />;
      case 'User Activity':
        return <UserActivitySection />;
      case 'Content Management':
        return <ContentManagementSection />;
      case 'API Documentation':
        return <APIDocumentationSection />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{activeTab}</h2>
            <p className="text-gray-600">This section is not implemented yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Fixed Header */}
      <PageHeader />
      
      {/* Fixed Sidebar */}
      <NavigationSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Main Content Area - Adjusted for fixed sidebar */}
      <div 
        className={`
          min-h-screen pt-16 transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'sm:ml-64 ml-0' : 'ml-16'}
        `}
      >
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
          {/* Content */}
          <main className="flex-1 bg-gray-100 p-4 sm:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto w-full">
              <div className="space-y-4 sm:space-y-6">
                {/* Page Title Section */}
                {/* <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{activeTab}</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">{getPageDescription(activeTab)}</p>
                </div> */}
                
                {/* Main Content */}
                {renderTabContent()}
              </div>
            </div>
          </main>
          
          {/* Footer */}
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;