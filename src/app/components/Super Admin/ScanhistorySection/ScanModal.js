import React, { useMemo } from 'react';

const ScanDetailsModal = ({ merchantId, scanData, onClose }) => {
  const merchantScans = useMemo(() => {
    return scanData.filter(scan => scan.merchant_id === merchantId);
  }, [scanData, merchantId]);

  const merchantInfo = merchantScans[0];
  
  // Group scans for better display
  const groupedScans = useMemo(() => {
    const grouped = merchantScans.reduce((acc, scan) => {
      const key = `${scan.user_id}-${scan.card_number_masked}`;
      if (!acc[key]) {
        acc[key] = {
          user_id: scan.user_id,
          card_number_masked: scan.card_number_masked,
          merchant_key: scan.merchant_key,
          status: scan.status,
          scan_count: 0,
          all_scans: []
        };
      }
      acc[key].scan_count++;
      acc[key].all_scans.push(scan);
      return acc;
    }, {});
    
    return Object.values(grouped);
  }, [merchantScans]);

  const stats = useMemo(() => {
    const uniqueUsers = new Set(merchantScans.map(scan => scan.user_id)).size;
    const uniqueCards = new Set(merchantScans.map(scan => scan.card_number_masked)).size;
    const successCount = merchantScans.filter(scan => scan.status === 'success').length;
    const failedCount = merchantScans.length - successCount;
    const successRate = ((successCount / merchantScans.length) * 100).toFixed(1);
    
    return { uniqueUsers, uniqueCards, successCount, failedCount, successRate };
  }, [merchantScans]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusIcon = (status) => {
    return status === 'success' ? (
      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  const getCardIcon = () => (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  const getUserIcon = () => (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className=" bg-gray-800 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-opacity-20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {merchantId}
                </h3>
                <p className="text-blue-100 text-sm">
                  {merchantScans.length} total scan records
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className=" bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.uniqueUsers}</div>
              <div className="text-xs text-gray-500">Unique Users</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{stats.uniqueCards}</div>
              <div className="text-xs text-gray-500">Unique Cards</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-green-600">{stats.successCount}</div>
              <div className="text-xs text-gray-500">Successful</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-red-600">{stats.failedCount}</div>
              <div className="text-xs text-gray-500">Failed</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">{stats.successRate}%</div>
              <div className="text-xs text-gray-500">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Merchant Information */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Merchant Information</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Merchant ID:</span>
                <span className="text-sm font-mono bg-white px-2 py-1 rounded border">{merchantInfo?.merchant_id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Merchant Key:</span>
                <span className="text-xs font-mono bg-white px-2 py-1 rounded border truncate max-w-xs">{merchantInfo?.merchant_key}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Scan Records */}
        <div className="px-6 py-4 bg-white flex-1 overflow-y-auto">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Card Scan Records</h4>
          <div className="space-y-2">
            {groupedScans.map((group, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                      {getUserIcon()}
                      <div>
                        <div className="text-xs text-gray-500">User ID</div>
                        <div className="text-sm font-semibold text-gray-900">{group.user_id}</div>
                      </div>
                    </div>
                    
                    {/* Card Info */}
                    <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2">
                      {getCardIcon()}
                      <div>
                        <div className="text-xs text-blue-600">Card Number</div>
                        <div className="text-sm font-mono font-semibold text-gray-900">{group.card_number_masked}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Scan Count */}
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{group.scan_count}</div>
                      <div className="text-xs text-gray-500">Scans</div>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(group.status)}
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        group.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {group.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Merchant Key for this specific scan */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-500">Key:</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{group.merchant_key}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanDetailsModal;