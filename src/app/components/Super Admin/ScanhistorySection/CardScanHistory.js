import { apiFetch } from '@/app/lib/api.js';
import React, { useState, useEffect, useMemo } from 'react';
import ScanDetailsModal from './ScanModal';

// Merchant List Component
const MerchantList = ({ scanData, onMerchantClick }) => {
  const merchantStats = useMemo(() => {
    const grouped = scanData.reduce((acc, scan) => {
      const merchantId = scan.merchant_id;
      
      if (!acc[merchantId]) {
        acc[merchantId] = {
          merchant_id: merchantId,
          merchant_key: scan.merchant_key,
          total_scans: 0,
          unique_users: new Set(),
          unique_cards: new Set(),
          success_count: 0,
          failed_count: 0,
          latest_scan: null
        };
      }
      
      acc[merchantId].total_scans++;
      acc[merchantId].unique_users.add(scan.user_id);
      acc[merchantId].unique_cards.add(scan.card_number_masked);
      
      if (scan.status === 'success') {
        acc[merchantId].success_count++;
      } else {
        acc[merchantId].failed_count++;
      }
      
      acc[merchantId].latest_scan = scan;
      
      return acc;
    }, {});

    return Object.values(grouped).map(merchant => ({
      ...merchant,
      unique_users: merchant.unique_users.size,
      unique_cards: merchant.unique_cards.size,
      success_rate: ((merchant.success_count / merchant.total_scans) * 100).toFixed(1)
    }));
  }, [scanData]);

  const getStatusBadge = (successRate) => {
    if (successRate >= 95) {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Excellent</span>;
    } else if (successRate >= 80) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Good</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Needs Attention</span>;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="grid gap-4">
          {merchantStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No scan data available
            </div>
          ) : (
            merchantStats.map((merchant) => (
              <div
                key={merchant.merchant_id}
                onClick={() => onMerchantClick(merchant.merchant_id)}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {merchant.merchant_id}
                      </h3>
                      {getStatusBadge(merchant.success_rate)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 font-mono">
                      Key: {merchant.merchant_key.substring(0, 20)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {merchant.total_scans}
                    </div>
                    <div className="text-sm text-gray-500">Total Scans</div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{merchant.unique_users}</div>
                    <div className="text-gray-500">Unique Users</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{merchant.unique_cards}</div>
                    <div className="text-gray-500">Unique Cards</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">{merchant.success_rate}%</div>
                    <div className="text-gray-500">Success Rate</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component
const CardScanHistory = () => {
  const [scanData, setScanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchScanData();
  }, []);

  const fetchScanData = async () => {
    try {
      setLoading(true);
      // Try without the /api prefix since your base URL likely already includes it
      const response = await apiFetch('/superadmin/access-all-scans');
      const result = await response.json();
      
      if (result.status) {
        setScanData(result.data);
      } else {
        setError('Failed to fetch scan data');
      }
    } catch (err) {
      setError('Error fetching scan data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMerchantClick = (merchantId) => {
    setSelectedMerchant(merchantId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMerchant(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={fetchScanData}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Card Scan History</h1>
        <p className="text-gray-600 mt-1">View and manage card scan records by merchant</p>
      </div>

      <MerchantList 
        scanData={scanData} 
        onMerchantClick={handleMerchantClick}
      />

      {isModalOpen && (
        <ScanDetailsModal
          merchantId={selectedMerchant}
          scanData={scanData}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CardScanHistory;