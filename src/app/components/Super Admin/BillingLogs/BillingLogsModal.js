import React from 'react';
import { User, CreditCard, AlertCircle, X, Clock, DollarSign } from 'lucide-react';

const BillingLogsModal = ({
  isOpen,
  subscription,
  onClose,
  formatDate,
  getPackageType,
  getStatusColor,
  getStatusText,
  formatNumber,
  getApiLimit
}) => {
  if (!isOpen || !subscription) return null;

  const apiLimit = getApiLimit(subscription);

  return (
    <div className="fixed inset-0 text-white bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-800">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Subscription Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* User Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-white flex items-center gap-2 text-sm sm:text-base">
                <User className="w-4 h-4" />
                User Information
              </h4>
              <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-400 text-sm">User ID:</span>
                    <span className="font-medium text-white text-sm sm:text-base">{subscription.user_id}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-400 text-sm">Merchant ID:</span>
                    <span className="font-medium text-white text-sm sm:text-base break-all">{subscription.merchant_id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-white flex items-center gap-2 text-sm sm:text-base">
                <CreditCard className="w-4 h-4" />
                Package Information
              </h4>
              <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-400 text-sm">Package ID:</span>
                    <span className="font-medium text-white text-sm sm:text-base">{subscription.package_id}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-400 text-sm">Type:</span>
                    <span className="font-medium text-white text-sm sm:text-base">{getPackageType(subscription)}</span>
                  </div>
                  {subscription.custom_price && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:col-span-2">
                      <span className="text-gray-400 text-sm">Custom Price:</span>
                      <span className="font-medium text-green-400 text-sm sm:text-base">
                        ${subscription.custom_price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* API Usage */}
            <div className="space-y-4">
              <h4 className="font-medium text-white flex items-center gap-2 text-sm sm:text-base">
                <AlertCircle className="w-4 h-4" />
                API Usage
              </h4>
              <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-400 text-sm">Limit:</span>
                    <span className="font-medium text-white text-sm sm:text-base">{formatNumber(apiLimit)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-400 text-sm">Used:</span>
                    <span className="font-medium text-white text-sm sm:text-base">{formatNumber(subscription.api_calls_used)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-400 text-sm">Remaining:</span>
                    <span className="font-medium text-green-400 text-sm sm:text-base">
                      {formatNumber(apiLimit - subscription.api_calls_used)}
                    </span>
                  </div>
                  {subscription.overage_calls > 0 && (
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-400 text-sm">Overage:</span>
                      <span className="font-medium text-red-400 text-sm sm:text-base">
                        {formatNumber(subscription.overage_calls)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Timeline */}
            <div className="space-y-4">
              <h4 className="font-medium text-white flex items-center gap-2 text-sm sm:text-base">
                <Clock className="w-4 h-4" />
                Subscription Timeline
              </h4>
              <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-400 text-sm">Started:</span>
                    <span className="font-medium text-white text-sm sm:text-base">{formatDate(subscription.subscription_date)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-400 text-sm">Renewal:</span>
                    <span className="font-medium text-white text-sm sm:text-base">{formatDate(subscription.renewal_date)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:col-span-2">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${getStatusColor(subscription)} inline-flex items-center`}>
                      {getStatusText(subscription)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Package Details */}
            {subscription.custom_package && (
              <div className="space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2 text-sm sm:text-base">
                  <DollarSign className="w-4 h-4" />
                  Custom Package Details
                </h4>
                <div className="bg-blue-900 rounded-lg p-3 sm:p-4 border border-blue-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-blue-300 text-sm">Custom Package:</span>
                      <span className="font-medium text-white text-sm sm:text-base">{subscription.custom_package}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-blue-300 text-sm">Custom Status:</span>
                      <span className="font-medium text-white text-sm sm:text-base">{subscription.custom_status || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-blue-300 text-sm">Custom Calls Used:</span>
                      <span className="font-medium text-white text-sm sm:text-base">{subscription.custom_calls_used || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-blue-300 text-sm">Custom API Count:</span>
                      <span className="font-medium text-white text-sm sm:text-base">{subscription.custom_api_count || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Package ID 3 Special Indicator */}
            {subscription.package_id === 3 && (
              <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-300">Package 3 Configuration</p>
                    <p className="text-yellow-200 mt-1">
                      This subscription uses custom API count ({formatNumber(subscription.custom_api_count)}) instead of standard API limit for usage calculations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-800 bg-gray-900 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingLogsModal;