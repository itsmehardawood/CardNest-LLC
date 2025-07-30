'use client';

import { X, CreditCard, User, Key, Calendar, CheckCircle, AlertCircle, Hash } from 'lucide-react';

const ScanHistoryModal = ({ scan, isOpen, onClose }) => {
  if (!isOpen || !scan) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    return status === 'success' 
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = (status) => {
    return status === 'success' ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-500" />
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    });
  };

  const maskMerchantKey = (key) => {
    if (!key || key.length <= 6) return key;
    const start = key.substring(0, 3);
    const end = key.substring(key.length - 3);
    return `${start}${'*'.repeat(Math.min(8, key.length - 6))}${end}`;
  };

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-sm sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Scan Details
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Scan ID: #{scan.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Status Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {getStatusIcon(scan.status)}
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">Scan Status</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Current processing status</p>
                </div>
              </div>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border self-start sm:self-auto ${getStatusColor(scan.status)}`}>
                {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Card Information */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Card Information
            </h3>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Card Number</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-lg text-gray-900 break-all">
                    {scan.card_number_masked}
                  </span>
                  <button
                    onClick={() => copyToClipboard(scan.card_number_masked)}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium ml-2 flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Scan ID</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-lg text-gray-900">#{scan.id}</span>
                  <button
                    onClick={() => copyToClipboard(scan.id.toString())}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Merchant Information */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Merchant Information
            </h3>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Merchant ID</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-base text-gray-900 break-all">{scan.merchant_id}</span>
                  <button
                    onClick={() => copyToClipboard(scan.merchant_id)}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium ml-2 flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Key className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Merchant Key</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs sm:text-sm text-gray-900 break-all mr-2">
                    {maskMerchantKey(scan.merchant_key)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(scan.merchant_key)}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium flex-shrink-0"
                    title="Copy full merchant key"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Click copy to get the full key</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">User ID</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base text-gray-900">{scan.user_id}</span>
                  <button
                    onClick={() => copyToClipboard(scan.user_id.toString())}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Timeline
            </h3>
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 space-y-1 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Created</span>
                    <p className="text-xs text-gray-500">When the scan was initiated</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-gray-900 ml-5 sm:ml-0">
                  {formatDate(scan.created_at)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 space-y-1 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Last Updated</span>
                    <p className="text-xs text-gray-500">Most recent status change</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-gray-900 ml-5 sm:ml-0">
                  {formatDate(scan.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
          >
            Close
          </button>
          {/* <button
            onClick={() => {
              // Add export functionality here if needed
              console.log('Export scan data:', scan);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base order-1 sm:order-2"
          >
            Export Details
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ScanHistoryModal;