'use client';

import { useState, useEffect } from 'react';
import { Eye, Calendar, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import ScanHistoryModal from './ScanHistoryModal';
import { apiFetch } from '@/app/lib/api.js';

const ScanHistorySection = () => {
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Extract merchant_id from userData in localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const merchantId = userData.user?.merchant_id || userData.merchant_id;
      
      if (!merchantId) {
        throw new Error('Merchant ID not found in user data');
      }

      // Try multiple param name variations similar to subscriptions API
      const paramVariations = [
        `id=${merchantId}`,
        `merchant_id=${merchantId}`,
        `merchantId=${merchantId}`,
        `MerchantID=${merchantId}`,
        `UserID=${merchantId}`
      ];

      let fetched = false;
      for (const param of paramVariations) {
        if (fetched) break;
        try {
          const response = await apiFetch(`/merchant/getCardScans?${param}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.status) {
              setScanHistory(Array.isArray(data.data) ? data.data : []);
              fetched = true;
              break;
            }
          } else if (response.status === 404 || response.status === 400) {
            // No history or bad param name – try next variation
            console.warn(`${response.status} from getCardScans with param: ${param}`);
            continue;
          } else {
            console.warn(`Unexpected status ${response.status} from getCardScans with param: ${param}`);
          }
        } catch (innerErr) {
          console.error(`Error calling getCardScans with param ${param}:`, innerErr);
        }
      }

      // If nothing worked, assume no history for now (new user)
      if (!fetched) {
        setScanHistory([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching scan history:', err);
    } finally {
      setLoading(false);
    }
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

  const getStatusIcon = (status) => {
    if (!status) return <AlertCircle className="w-4 h-4 text-gray-400" />;
    return status === 'success' ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-400" />
    );
  };

  const getStatusBadge = (status) => {
    if (!status) return "px-2 py-1 text-xs font-medium rounded-full bg-gray-900 text-gray-300";
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    return status === 'success' 
      ? `${baseClasses} bg-green-900 text-green-300`
      : `${baseClasses} bg-red-900 text-red-300`;
  };

  const handleViewDetails = (scan) => {
    setSelectedScan(scan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScan(null);
  };

  if (loading) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-700 rounded w-36 sm:w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 sm:h-16 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-4 sm:p-6">
        <div className="text-center py-6 sm:py-8">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-white mb-2">No History Found</h3>
          <p className="text-sm sm:text-base text-gray-300 mb-4 px-4">{error}</p>
          <button
            onClick={fetchScanHistory}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg shadow-sm border border-gray-800">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Card Scan History</h2>
            <p className="text-gray-300 text-sm mt-1">
              Total scans: {scanHistory.length}
            </p>
          </div>
          <button
            onClick={fetchScanHistory}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium self-start sm:self-auto"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
     {scanHistory.length === 0 ? (
  <div className="text-center py-6 sm:py-8">
    <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-base sm:text-lg font-medium text-white mb-2">No Scan History Found</h3>
    <p className="text-sm sm:text-base text-gray-300">No scan history found against this merchant.</p>
  </div>
) : (
          <div className="space-y-3">
            {scanHistory.map((scan) => {
              // Add null checks for scan object and its properties
              if (!scan) return null;
              
              return (
                <div
                  key={scan.id || Math.random()}
                  className="border border-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-gray-600 transition-all"
                >
                  {/* Mobile Layout (stacked) */}
                  <div className="block sm:hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(scan.status)}
                        <span className={getStatusBadge(scan.status)}>
                          {scan.status || 'Unknown'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleViewDetails(scan)}
                        className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden xs:inline">Details</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-300">
                      <CreditCard className="w-4 h-4 flex-shrink-0" />
                      <span className="font-mono text-sm break-all">
                        {scan.card_number_masked || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">
                        {formatDate(scan.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout (horizontal) */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-4 flex-wrap gap-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(scan.status)}
                        <span className={getStatusBadge(scan.status)}>
                          {scan.status || 'Unknown'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-300">
                        <CreditCard className="w-4 h-4 flex-shrink-0" />
                        <span className="font-mono text-sm">
                          {scan.card_number_masked || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">
                          {formatDate(scan.created_at)}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleViewDetails(scan)}
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium ml-4"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && selectedScan && (
        <ScanHistoryModal
          scan={selectedScan}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ScanHistorySection;