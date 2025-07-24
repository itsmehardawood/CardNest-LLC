"use client";
import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Calendar, Building, Mail, FileText, AlertCircle, Users, Download, Search, Filter, ChevronDown, ChevronUp, Clock, ShieldCheck, FileDigit, User, MapPin, Home, Briefcase, FileBadge, CreditCard } from 'lucide-react';

const BusinessApprovalSectionUpdated = () => {
  const [businesses, setBusinesses] = useState([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedLoading, setApprovedLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBusiness, setExpandedBusiness] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0
  });

  // Add the missing handleRejectClick function
  const handleRejectClick = () => {
    setShowRejectForm(true);
  };

  // Fetch both pending and approved businesses on page load
  useEffect(() => {
    const fetchAllBusinesses = async () => {
      try {
        // Fetch pending businesses
        const pendingResponse = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile');
        const pendingData = await pendingResponse.json();
            
        if (pendingData.status) {
          const allBusinesses = pendingData.data;
          const pending = allBusinesses.filter(business => {
            const status = business.user.business_verified;
            return status === 0 || status === "0" || status === null || status === "PENDING";
          });
          
          setBusinesses(pending);
          setStats(prev => ({...prev, pending: pending.length}));
        }

        // Fetch approved businesses
        const approvedResponse = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/approved');
        const approvedData = await approvedResponse.json();
            
        if (approvedData.status) {
          setApprovedBusinesses(approvedData.data || []);
          setStats(prev => ({...prev, approved: approvedData.data?.length || 0}));
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        showNotification('Error fetching businesses', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBusinesses();
  }, []);

  const fetchApprovedBusinesses = async () => {
    if (approvedBusinesses.length > 0) return;
    
    setApprovedLoading(true);
    try {
      const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/approved');
      const data = await response.json();
          
      if (data.status) {
        setApprovedBusinesses(data.data || []);
        setStats(prev => ({...prev, approved: data.data?.length || 0}));
      }
    } catch (error) {
      console.error('Error fetching approved businesses:', error);
      showNotification('Error fetching approved businesses', 'error');
    } finally {
      setApprovedLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'approved') {
      fetchApprovedBusinesses();
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadDocument = async (documentPath, fileName) => {
    setDownloadLoading(true);
    const fullUrl = `${documentPath}`;
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || documentPath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showNotification('Document downloaded successfully', 'success');
      } else {
        throw new Error('Failed to fetch document');
      }
    } catch (error) {
      console.error('Download method 1 failed:', error);
      
      try {
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = fileName || documentPath.split('/').pop();
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('Opening document in new tab for download', 'success');
      } catch (directError) {
        console.error('Download method 2 failed:', directError);
        window.open(fullUrl, '_blank');
        showNotification('Document opened in new tab. Use browser\'s download option if needed.', 'success');
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleViewDocument = (business) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
    setShowRejectForm(false);
    setRejectReason('');
  };

  const handleApprove = async (businessId) => {
    setActionLoading(true);
    try {
      const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedBusiness.user.id,
          status: 'APPROVED',
          reason: 'Business profile approved after verification'
        })
      });

      const data = await response.json();

      if (response.ok && data.status) {
        showNotification(data.message || 'Business approved successfully', 'success');
        setBusinesses(prevBusinesses => 
          prevBusinesses.filter(business => business.id !== businessId)
        );
        
        if (approvedBusinesses.length > 0) {
          const approvedBusiness = { 
            ...selectedBusiness, 
            user: { ...selectedBusiness.user, business_verified: 1 }
          };
          setApprovedBusinesses(prevApproved => [...prevApproved, approvedBusiness]);
        }
        
        setIsModalOpen(false);
        setStats(prev => ({
          pending: prev.pending - 1,
          approved: prev.approved + 1
        }));
      } else {
        throw new Error(data.message || 'Failed to approve business');
      }
    } catch (error) {
      console.error('Error approving business:', error);
      showNotification(error.message || 'Failed to approve business', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (businessId) => {
    setActionLoading(true);
    try {
      const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedBusiness.user.id,
          status: 'INCOMPLETE',
          reason: rejectReason || 'Business profile rejected after verification'
        })
      });

      const data = await response.json();

      if (response.ok && data.status) {
        showNotification(data.message || 'Business rejected successfully', 'success');
        setBusinesses(prevBusinesses => 
          prevBusinesses.filter(business => business.id !== businessId)
        );
        setIsModalOpen(false);
        setShowRejectForm(false);
        setRejectReason('');
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1
        }));
      } else {
        throw new Error(data.message || 'Failed to reject business');
      }
    } catch (error) {
      console.error('Error rejecting business:', error);
      showNotification(error.message || 'Failed to reject business', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleExpandBusiness = (businessId) => {
    setExpandedBusiness(expandedBusiness === businessId ? null : businessId);
  };

  const filteredBusinesses = businesses.filter(business => 
    business.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.business_registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApprovedBusinesses = approvedBusinesses.filter(business => 
    business.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.business_registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (verified) => {
    const status = String(verified).toUpperCase();
    
    if (status === "1" || status === "APPROVED") {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm transition-all duration-200 hover:shadow-md">
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          <span>Approved</span>
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200 shadow-sm transition-all duration-200 hover:shadow-md">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          <span>Pending</span>
        </div>
      );
    }
  };

 

  const renderBusinessTable = (businessList, isApproved = false) => (
    <div className="overflow-hidden">
      {isApproved && approvedLoading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading approved businesses...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[200px]">
                    Company Details
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[180px]">
                    Contact
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[150px]">
                    {isApproved ? 'Approved Date' : 'Requested Date'}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {businessList.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">{business.business_name}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <FileDigit className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-[160px]">{business.business_registration_number}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-blue-500 mr-2 transition-transform duration-200 hover:scale-110" />
                        <div className="text-sm text-gray-900 truncate max-w-[160px]">{business.user.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-purple-500 mr-2 transition-transform duration-200 hover:scale-110" />
                        <div className="text-sm text-gray-700 truncate max-w-[120px]">
                          {formatDate(isApproved ? business.updated_at : business.created_at)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(business.user.business_verified)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDocument(business)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-gradient-to-r bg-slate-800 hover:from-blue-800 hover:to-blue-800 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5 transition-transform duration-200 hover:scale-110" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet View */}
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-1 gap-3">
              {businessList.map((business) => (
                <div key={business.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:border-blue-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mr-3 transition-transform duration-200 hover:scale-105">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{business.business_name}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <FileDigit className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-[180px]">{business.business_registration_number}</span>
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(business.user.business_verified)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center text-xs text-gray-700 bg-gray-50 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100">
                      <Mail className="h-3.5 w-3.5 mr-2 text-blue-500" />
                      <span className="truncate">{business.user.email}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100">
                      <Calendar className="h-3.5 w-3.5 mr-2 text-purple-500" />
                      <span className="truncate">{formatDate(isApproved ? business.updated_at : business.created_at)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleViewDocument(business)}
                    className="w-full inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5 transition-transform duration-200 hover:scale-110" />
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {businessList.map((business) => (
              <div key={business.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ease-in-out hover:border-blue-100">
                <div 
                  className="p-3 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpandBusiness(business.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{business.business_name}</h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center truncate">
                      <Mail className="w-3 h-3 mr-1 transition-transform duration-200 hover:scale-110" />
                      {business.user.email}
                    </p>
                  </div>
                  <div className="flex items-center ml-2">
                    {getStatusBadge(business.user.business_verified)}
                    {expandedBusiness === business.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-500 ml-2 transition-transform duration-200 hover:scale-125" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500 ml-2 transition-transform duration-200 hover:scale-125" />
                    )}
                  </div>
                </div>
                
                {expandedBusiness === business.id && (
                  <div className="px-3 pb-3 pt-1 border-t border-gray-100 transition-all duration-300 ease-in-out">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="bg-gray-50 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100">
                        <p className="text-xs text-gray-500 flex items-center">
                          <FileDigit className="w-3 h-3 mr-1" />
                          Reg. Number
                        </p>
                        <p className="text-xs font-medium truncate text-gray-700">{business.business_registration_number}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100">
                        <p className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {isApproved ? 'Approved' : 'Requested'}
                        </p>
                        <p className="text-xs font-medium truncate text-gray-700">
                          {formatDate(isApproved ? business.updated_at : business.created_at)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDocument(business)}
                      className="w-full inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5 transition-transform duration-200 hover:scale-110" />
                      View Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderEmptyState = (title, description, icon) => (
    <div className="p-8 text-center rounded-xl bg-gray-50 border border-dashed border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 mb-3 transition-transform duration-200 hover:scale-110">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-xs max-w-md mx-auto">{description}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded-xl w-1/4"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-4 bg-gray-200 rounded-xl col-span-2"></div>
              <div className="h-4 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded-xl w-3/4"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-xs transform transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200' 
            : 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200'
        } animate-fade-in-up`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-emerald-500 animate-bounce" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-emerald-800' : 'text-red-800'
              }`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold mb-1 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 transition-transform duration-200 hover:scale-110" />
              Business Management
            </h2>
            <p className="text-gray-300 text-xs">Manage verification requests</p>
          </div>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
            </div>
            <input
              type="text"
              placeholder="Search businesses..."
              className="block w-full pl-9 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-gray-700 bg-opacity-70 text-white placeholder-gray-300 focus:outline-none focus:bg-gray-600 focus:ring-2 focus:ring-white focus:border-transparent text-xs sm:text-sm transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-5 pt-2 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3 transition-transform duration-200 hover:scale-110">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-blue-700 font-medium">Pending Review</p>
                <p className="text-lg font-bold text-blue-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 mr-3 transition-transform duration-200 hover:scale-110">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-700 font-medium">Approved</p>
                <p className="text-lg font-bold text-emerald-900">{stats.approved}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-4">
          <button
            onClick={() => handleTabChange('pending')}
            className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'pending'
                ? 'bg-white text-blue-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center">
              <Clock className="w-4 h-4 mr-1.5 transition-transform duration-200 hover:scale-110" />
              <span>Pending</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('approved')}
            className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'approved'
                ? 'bg-white text-emerald-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1.5 transition-transform duration-200 hover:scale-110" />
              <span>Approved</span>
                     </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-sm">
          {activeTab === 'pending' && (
            <>
              {filteredBusinesses.length > 0 ? (
                renderBusinessTable(filteredBusinesses)
              ) : (
                renderEmptyState(
                  'No Pending Verification Requests',
                  'All verification requests have been processed. Check back later for new submissions.',
                  <FileText className="h-5 w-5" />
                )
              )}
            </>
          )}

          {activeTab === 'approved' && (
            <>
              {filteredApprovedBusinesses.length > 0 || approvedLoading ? (
                renderBusinessTable(filteredApprovedBusinesses, true)
              ) : (
                renderEmptyState(
                  'No Approved Businesses',
                  'Approved businesses will appear here once you start verifying pending requests.',
                  <Users className="h-5 w-5" />
                )
              )}
            </>
          )}
        </div>
      </div>

            {/* Modal */}
    {isModalOpen && selectedBusiness && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-4">
    <div className="relative top-4 mx-auto border-0 w-full max-w-6xl shadow-2xl rounded-2xl bg-white">
      {/* Enhanced Modal Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Business Verification Review</h3>
              <p className="text-gray-300 text-sm">Complete verification assessment</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsModalOpen(false);
              setShowRejectForm(false);
              setRejectReason('');
            }}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
            disabled={actionLoading}
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-6 max-h-[85vh] overflow-y-auto bg-gray-50">
        <div className="space-y-8">
          {/* Business Information Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Business Information</h4>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Business Name</label>
                <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.business_name}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Registration Number</label>
                <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.business_registration_number}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Business Email</label>
                <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.email}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">User Email</label>
                <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.user.email}</p>
              </div>
            </div>
          </div>

          {/* Business Address Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Business Address</h4>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-gray-900 space-y-1">
                <p className="font-semibold text-base">{selectedBusiness.street}</p>
                {selectedBusiness.street_line2 && <p className="text-gray-600">{selectedBusiness.street_line2}</p>}
                <p className="text-gray-700">{selectedBusiness.city}, {selectedBusiness.state} {selectedBusiness.zip_code}</p>
                <p className="font-semibold text-green-700 text-sm">{selectedBusiness.country}</p>
              </div>
            </div>
          </div>
          
          {/* Account Holder Information Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Account Holder Details</h4>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Full Name</label>
                <p className="text-gray-900 text-sm font-semibold">
                  {selectedBusiness.account_holder_first_name} {selectedBusiness.account_holder_last_name}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Email</label>
                <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.account_holder_email}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Date of Birth</label>
                <p className="text-gray-900 text-sm font-semibold">
                  {new Date(selectedBusiness.account_holder_date_of_birth).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Phone</label>
                <p className="text-gray-900 text-sm font-semibold">
                  {selectedBusiness.user.country_code} {selectedBusiness.user.phone_no}
                </p>
              </div>
            </div>
          </div>

          {/* Account Holder Address Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <Home className="h-5 w-5 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Account Holder Address</h4>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-gray-900 space-y-1">
                <p className="font-semibold text-base">{selectedBusiness.account_holder_street}</p>
                {selectedBusiness.account_holder_street_line2 && (
                  <p className="text-gray-600">{selectedBusiness.account_holder_street_line2}</p>
                )}
                <p className="text-gray-700">{selectedBusiness.account_holder_city}, {selectedBusiness.account_holder_state} {selectedBusiness.account_holder_zip_code}</p>
                <p className="font-semibold text-amber-700 text-sm">{selectedBusiness.account_holder_country}</p>
              </div>
            </div>
          </div>

          {/* ID Information Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <CreditCard className="h-5 w-5 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Identity Information</h4>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">ID Type</label>
                <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.account_holder_id_type}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">ID Number</label>
                <p className="text-gray-900 text-sm font-semibold font-mono">
                  {selectedBusiness.account_holder_id_number}
                </p>
              </div>
            </div>
          </div>

          {/* Account Status Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gray-100 rounded-lg mr-3">
                <ShieldCheck className="h-5 w-5 text-gray-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Account Status</h4>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Merchant ID</label>
                <p className="text-gray-900 text-sm font-semibold font-mono">{selectedBusiness.user.merchant_id}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Trial Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedBusiness.user.on_trial 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {selectedBusiness.user.on_trial ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Trial Calls Remaining</label>
                <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.user.trial_calls_remaining}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Trial Ends</label>
                <p className="text-gray-900 text-sm font-semibold">
                  {new Date(selectedBusiness.user.trial_ends_at).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">OTP Verified</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedBusiness.user.otp_verified 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {selectedBusiness.user.otp_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Role</label>
                <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.user.role}</p>
              </div>
            </div>
          </div>

          {/* Previous verification reason */}
          {selectedBusiness.user.verification_reason && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <label className="text-sm font-semibold text-red-800">Previous Rejection Notes</label>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-red-700 text-sm leading-relaxed">{selectedBusiness.user.verification_reason}</p>
              </div>
            </div>
          )}

          {/* Documents Section */}
          {activeTab === "pending" && (
            <div className="space-y-6">
              {/* Registration Document */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4">
                  <h4 className="text-sm font-semibold flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Business Registration Document
                  </h4>
                </div>
                
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center min-w-0 bg-gray-50 rounded-lg p-3 flex-1 mr-3">
                      <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm truncate font-medium">
                        {selectedBusiness.registration_document_path.split('/').pop()}
                      </span>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0">
                      <button
                        onClick={() => window.open(`${selectedBusiness.registration_document_path}`, '_blank')}
                        className="flex items-center px-3 py-2 bg-gray-700 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadDocument(
                          selectedBusiness.registration_document_path,
                          `${selectedBusiness.business_name}_registration_document.${selectedBusiness.registration_document_path.split('.').pop()}`
                        )}
                        disabled={downloadLoading}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 shadow-sm"
                      >
                        {downloadLoading ? (
                          <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1"></div>
                        ) : (
                          <Download className="h-3 w-3 mr-1" />
                        )}
                        Download
                      </button>
                    </div>
                  </div>
                  
                  {/* Document Preview */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="aspect-w-16 aspect-h-9">
                      {selectedBusiness.registration_document_path.toLowerCase().includes('.pdf') ? (
                        <iframe
                          src={`${selectedBusiness.registration_document_path}`}
                          className="w-full h-48 border-0 rounded-lg shadow-inner"
                          title="Registration Document Preview"
                        />
                      ) : (
                        <img
                          src={`${selectedBusiness.registration_document_path}`}
                          alt="Registration Document"
                          className="w-full h-48 object-contain rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      )}
                      <div className="hidden w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm font-medium">Preview not available</p>
                          <p className="text-gray-400 text-xs">Click view to open in new tab</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ID Document */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
                  <h4 className="text-sm font-semibold flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Account Holder ID Document
                  </h4>
                </div>
                
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center min-w-0 bg-gray-50 rounded-lg p-3 flex-1 mr-3">
                      <CreditCard className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm truncate font-medium">
                        {selectedBusiness.account_holder_id_document_path.split('/').pop()}
                      </span>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0">
                      <button
                        onClick={() => window.open(`${selectedBusiness.account_holder_id_document_path}`, '_blank')}
                        className="flex items-center px-3 py-2 bg-gray-700 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadDocument(
                          selectedBusiness.account_holder_id_document_path,
                          `${selectedBusiness.account_holder_first_name}_${selectedBusiness.account_holder_last_name}_id_document.${selectedBusiness.account_holder_id_document_path.split('.').pop()}`
                        )}
                        disabled={downloadLoading}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 shadow-sm"
                      >
                        {downloadLoading ? (
                          <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1"></div>
                        ) : (
                          <Download className="h-3 w-3 mr-1" />
                        )}
                        Download
                      </button>
                    </div>
                  </div>
                  
                  {/* Document Preview */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="aspect-w-16 aspect-h-9">
                      {selectedBusiness.account_holder_id_document_path.toLowerCase().includes('.pdf') ? (
                        <iframe
                          src={`${selectedBusiness.account_holder_id_document_path}`}
                          className="w-full h-48 border-0 rounded-lg shadow-inner"
                          title="ID Document Preview"
                        />
                      ) : (
                        <img
                          src={`${selectedBusiness.account_holder_id_document_path}`}
                          alt="ID Document"
                          className="w-full h-48 object-contain rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      )}
                      <div className="hidden w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm font-medium">Preview not available</p>
                          <p className="text-gray-400 text-xs">Click view to open in new tab</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reject Reason Form */}
          {showRejectForm && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                <label className="text-sm font-semibold text-red-800">Reason for Rejection *</label>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-3 border text-black border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm resize-none"
                rows="4"
                placeholder="Please provide a detailed reason for rejection. This will help the business understand what needs to be corrected."
                required
              />
            </div>
          )}
        </div>   

        {/* Enhanced Action Buttons */}
        {activeTab === 'pending' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => handleApprove(selectedBusiness.id)}
              disabled={actionLoading}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {actionLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Approve Business
            </button>

            {!showRejectForm ? (
              <button
                onClick={handleRejectClick}
                disabled={actionLoading}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Business
              </button>
            ) : (
              <button
                onClick={() => handleReject(selectedBusiness.id)}
                disabled={actionLoading || !rejectReason.trim()}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Confirm Rejection
              </button>
            )}
            
            <button
              onClick={() => {
                setIsModalOpen(false);
                setShowRejectForm(false);
                setRejectReason('');
              }}
              disabled={actionLoading}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 text-sm font-semibold rounded-xl disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    
  </div>
); 
};

export default BusinessApprovalSectionUpdated;