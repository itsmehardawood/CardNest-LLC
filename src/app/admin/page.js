'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingComponent from '../components/Super Admin/General/Loading';
import HomePage from '../components/Super Admin/General/HomePage';
import BusinessApprovalSectionUpdated from '../components/Super Admin/ApprovalScreen/MainBusinessApproval';
import PricingSectionAdmin from '../components/Super Admin/General/PricingSection';
import UserActivitySection from '../components/Super Admin/General/UserActivityScreen';
import ContentManagementSection from '../components/Super Admin/General/ContentManagement';
import APIDocumentationSection from '../components/Super Admin/General/ApiDoc';
import GrantAccessForm from '../components/Super Admin/General/GrantAcess';
import CardScanHistory from '../components/Super Admin/ScanhistorySection/CardScanHistory';
import BillingLogsSection from '../components/Super Admin/BillingLogs/BillingLogs';
import TempDisplaySettings from '../components/Super Admin/General/TempDisplaySettings';
import NavigationSidebar from '../components/Super Admin/General/AdminNav';
import DashboardFooter from '../components/Super Admin/General/AdminFooter';
import PageHeader from '../components/Super Admin/General/AdminHeader';
import EnterpriseUsers from '../components/Super Admin/EnterpriseScreen/EnterpriseUsers';


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
        // console.log("No valid user data found, redirecting to admin login");
        router.push("/admin-login");
        return;
      }
      
      // Check if user has SUPER_ADMIN role - strict check only
      const userRole = userData.user?.role;
      
      if (userRole !== "SUPER_ADMIN") {
        // User is not a superadmin - redirect to admin login regardless of role
        // console.log("Access denied: User is not a superadmin");
        router.push("/admin-login");
        return;
      }
      
      // User is authenticated and is a superadmin
      // console.log("Access granted: User is a superadmin");
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Verifying access...</p>
        </div>
      </div>
    );
  }


  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingComponent message="Loading dashboard..." />;
    }

    switch (activeTab) {
      case 'Home':
        return <HomePage/>
      case 'Business Approval':
        return <BusinessApprovalSectionUpdated />;
      case 'Pricing':
        return <PricingSectionAdmin />;
      case 'User Activity':
        return <UserActivitySection />;
      case 'Content Management':
        return <ContentManagementSection />;
      case 'API Documentation':
        return <APIDocumentationSection />;
      case 'Access Grant':
        return <GrantAccessForm />;
      case 'Scan History':
      return <CardScanHistory/>
      case 'Billing Logs':
        return <BillingLogsSection/>
         case 'Display Settings':
        return <TempDisplaySettings/>
        case 'Enterprise Users':
          return <EnterpriseUsers />;
      default:
        return (
          <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">{activeTab}</h2>
            <p className="text-gray-300">This section is not implemented yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-black min-h-screen">
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
          <main className="flex-1 bg-black p-4 sm:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto w-full">
              <div className="space-y-4 sm:space-y-6">
                {/* Page Title Section */}
                {/* <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-4 sm:p-6">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">{activeTab}</h1>
                  <p className="text-gray-300 mt-1 text-sm sm:text-base">{getPageDescription(activeTab)}</p>
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