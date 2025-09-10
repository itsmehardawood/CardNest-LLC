'use client';

import React, { useState, useEffect } from 'react';
import { FiMail, FiMapPin, FiCalendar, FiHome, FiRefreshCw, FiAlertCircle, FiEye } from 'react-icons/fi';
import { apiFetch } from '@/app/lib/api.js';
import SubBusinessModal from './SubBusinessModal';

const SubBusinessList = () => {
  const [subBusinesses, setSubBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSubBusinesses();
  }, []);

  const fetchSubBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get merchant_id from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const merchantId = userData.user?.merchant_id || userData.merchant_id;

      if (!merchantId) {
        throw new Error('Merchant ID not found');
      }

      const response = await apiFetch(`/superadmin/get-sub-business?parent_id=${merchantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sub-businesses');
      }

      const data = await response.json();

      if (data.message === 'Sub-businesses retrieved successfully' && data.data) {
        setSubBusinesses(data.data.sub_businesses || []);
      } else {
        throw new Error(data.message || 'Failed to retrieve sub-businesses');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sub-businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (subBusiness) => {
    setSelectedBusiness(subBusiness);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBusiness(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatAddress = (businessProfile) => {
    if (!businessProfile) return 'No address available';
    
    const parts = [
      businessProfile.street,
      businessProfile.street_line2,
      businessProfile.city,
      businessProfile.state,
      businessProfile.zip_code,
      businessProfile.country
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'No address available';
  };

  if (loading) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-6">
        <div className="text-center py-8">
          <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Unable to Load Sub-Businesses</h3>
          <p className="text-gray-300 text-sm mb-4">{error}</p>
          <button
            onClick={fetchSubBusinesses}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-black rounded-lg shadow-sm border border-gray-800">
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <h2 className="text-xl font-semibold text-white">Sub-Businesses</h2>
              <p className="text-gray-300 text-sm mt-1">
                Total sub-businesses: {subBusinesses.length}
              </p>
            </div>
            <button
              onClick={fetchSubBusinesses}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-6">
          {subBusinesses.length === 0 ? (
            <div className="text-center py-8">
              <FiHome className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Sub-Businesses Found</h3>
              <p className="text-gray-300 text-sm">
                You have not created any sub-businesses yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {subBusinesses.map((subBusiness) => (
                <div
                  key={subBusiness.merchant_id}
                  className="border border-gray-700 rounded-lg p-4 hover:shadow-md hover:border-gray-600 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    {/* Business Info */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-full bg-blue-900 mr-3">
                          <FiHome className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {subBusiness.business_profile?.business_name || 'Unnamed Business'}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2">
                            ID: {subBusiness.merchant_id}
                          </p>
                          
                          {/* Registration Number */}
                          {subBusiness.business_profile?.business_registration_number && (
                            <p className="text-gray-400 text-xs mb-2">
                              Reg: {subBusiness.business_profile.business_registration_number}
                            </p>
                          )}
                          
                          {/* Contact Info */}
                          <div className="flex items-center space-x-4 text-sm text-gray-300 mb-2">
                            <div className="flex items-center space-x-1">
                              <FiMail className="w-4 h-4" />
                              <span>{subBusiness.email || 'No email'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiCalendar className="w-4 h-4" />
                              <span>Created: {formatDate(subBusiness.created_at)}</span>
                            </div>
                          </div>

                          {/* Address */}
                          <div className="flex items-start space-x-1 text-sm text-gray-400">
                            <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">
                              {formatAddress(subBusiness.business_profile)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="lg:flex-shrink-0">
                      <button
                        onClick={() => handleViewDetails(subBusiness)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm flex items-center space-x-2"
                      >
                        <FiEye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <SubBusinessModal
        subBusiness={selectedBusiness}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default SubBusinessList;