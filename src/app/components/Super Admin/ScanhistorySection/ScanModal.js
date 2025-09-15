
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
      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  const getCardIcon = () => (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  const getUserIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8" 
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"></div>
      
      {/* Modal Container */}
      <div 
        className="relative bg-black rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-800/50 transform transition-all duration-300 scale-100 sm:scale-105"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black/80 backdrop-blur-md px-6 py-5 sm:px-8 sm:py-6 flex-shrink-0 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-900/30 p-2.5 rounded-xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {merchantId}
                </h3>
                <p className="text-blue-300 text-sm sm:text-base mt-1">
                  {merchantScans.length} total scan records
                </p>
                  <span className="text-sm font-medium text-gray-400">Merchant Key:</span>
                <span className="text-xs font-mono text-gray-200 bg-black/50 px-3 py-1.5 rounded-lg border border-gray-700/50 truncate max-w-xs sm:max-w-md">
                  {merchantInfo?.merchant_key}
                </span>



              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-black/50 hover:bg-gray-700/50 rounded-xl p-2.5 text-white transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-black/50 px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-800/50 flex-shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[
              { value: stats.uniqueUsers, label: 'Unique Users', color: 'text-blue-400' },
              { value: stats.uniqueCards, label: 'Unique Cards', color: 'text-purple-400' },
              { value: stats.successCount, label: 'Successful', color: 'text-green-400' },
              { value: stats.failedCount, label: 'Failed', color: 'text-red-400' },
              { value: stats.successRate, label: 'Success Rate', color: 'text-indigo-400', unit: '%' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-black/80 rounded-xl p-4 sm:p-5 shadow-md border border-gray-800/50 hover:shadow-lg transition-shadow duration-200"
              >
                <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                  {stat.value}{stat.unit || ''}
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

      

        {/* Card Scan Records */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 bg-black flex-1 overflow-y-auto">
          <h4 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-5">Card Scan Records</h4>
          <div className="space-y-4">
            {groupedScans.map((group, index) => (
              <div 
                key={index} 
                className="border border-gray-700/50 rounded-xl p-4 sm:p-5 hover:bg-black/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 bg-black/50 rounded-lg px-3 py-2.5">
                      {getUserIcon()}
                      <div>
                        <div className="text-xs text-gray-400">User ID</div>
                        <div className="text-sm font-semibold text-white">{group.user_id}</div>
                      </div>
                    </div>
                    
                    {/* Card Info */}
                    <div className="flex items-center space-x-3 bg-blue-900/30 rounded-lg px-3 py-2.5">
                      {getCardIcon()}
                      <div>
                        <div className="text-xs text-blue-300">Card Number</div>
                        <div className="text-sm font-mono font-semibold text-white">{group.card_number_masked}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 sm:space-x-6">
                    {/* Scan Count */}
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold text-white">{group.scan_count}</div>
                      <div className="text-xs text-gray-400">Scans</div>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(group.status)}
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        group.status === 'success' 
                          ? 'bg-green-900/50 text-green-300' 
                          : 'bg-red-900/50 text-red-300'
                      }`}>
                        {group.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Merchant Key for this specific scan */}
                <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-700/50">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-400">Key:</span>
                    <span className="font-mono bg-black/50 px-3 py-1.5 rounded-lg text-gray-200 border border-gray-700/50">
                      {group.merchant_key}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/50 px-6 sm:px-8 py-4 sm:py-5 border-t border-gray-800/50 flex-shrink-0">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
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