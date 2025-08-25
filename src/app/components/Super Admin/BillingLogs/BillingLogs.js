import React, { useState, useEffect } from 'react';
import { Eye, Calendar, User, CreditCard } from 'lucide-react';
import { apiFetch } from '@/app/lib/api.js';
import BillingLogsModal from './BillingLogsModal';

const BillingLogsSection = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch subscriptions from API
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await apiFetch('/superadmin/access-all-old-subscriptions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status) {
          setSubscriptions(data.data || []);
        } else {
          console.error('API returned error:', data.message);
          setSubscriptions([]);
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPackageType = (subscription) => {
    if (subscription.custom_package) {
      return 'Custom Package';
    }
    return `Package ${subscription.package_id}`;
  };

  const getStatusColor = (subscription) => {
    if (subscription.is_blocked) return 'text-red-300 bg-red-900';
    if (subscription.custom_status === 'inactive') return 'text-yellow-300 bg-yellow-900';
    return 'text-green-300 bg-green-900';
  };

  const getStatusText = (subscription) => {
    if (subscription.is_blocked) return 'Blocked';
    if (subscription.custom_status === 'inactive') return 'Inactive';
    return 'Active';
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  // Helper function to get the appropriate API limit based on package_id
  const getApiLimit = (subscription) => {
    return subscription.package_id === 3 ? subscription.custom_api_count : subscription.api_calls_limit;
  };

  if (loading) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-black rounded-lg shadow-sm border border-gray-800">
        <div className="p-4 sm:p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <h2 className="text-lg sm:text-xl font-semibold text-white">Billing Logs</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-300 mt-2">
            Historical subscription records and billing information
          </p>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {subscriptions.map((subscription, index) => (
            <div key={index} className="border-b border-gray-800 p-4 hover:bg-gray-900 my-3">
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        User ID: {subscription.user_id}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {subscription.merchant_id}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription)}`}>
                    {getStatusText(subscription)}
                  </span>
                </div>

                {/* Package & Usage */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400 text-xs">Package</div>
                    <div className="font-medium text-white">{getPackageType(subscription)}</div>
                    {subscription.custom_price && (
                      <div className="text-green-400 font-medium text-xs">
                        ${subscription.custom_price}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">API Usage</div>
                    <div className="font-medium text-white">
                      {formatNumber(subscription.api_calls_used)} / {formatNumber(getApiLimit(subscription))}
                    </div>
                    {subscription.overage_calls > 0 && (
                      <div className="text-red-400 text-xs">
                        +{formatNumber(subscription.overage_calls)} overage
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates & Action */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(subscription.subscription_date)}</span>
                    </div>
                    <div className="mt-1">
                      Renews: {formatDate(subscription.renewal_date)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDetails(subscription)}
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Package Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  API Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-black divide-y divide-gray-800">
              {subscriptions.map((subscription, index) => (
                <tr key={index} className="hover:bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          User ID: {subscription.user_id}
                        </div>
                        <div className="text-sm text-gray-400">
                          {subscription.merchant_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {getPackageType(subscription)}
                      </div>
                      {subscription.custom_price && (
                        <div className="text-sm text-green-400 font-medium">
                          ${subscription.custom_price}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      <div>{formatNumber(subscription.api_calls_used)} / {formatNumber(getApiLimit(subscription))}</div>
                      {subscription.overage_calls > 0 && (
                        <div className="text-red-400 text-xs">
                          +{formatNumber(subscription.overage_calls)} overage
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{formatDate(subscription.subscription_date)}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Renews: {formatDate(subscription.renewal_date)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription)}`}>
                      {getStatusText(subscription)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(subscription)}
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No billing records found</p>
          </div>
        )}
      </div>

      <BillingLogsModal
        isOpen={isModalOpen}
        subscription={selectedSubscription}
        onClose={closeModal}
        formatDate={formatDate}
        getPackageType={getPackageType}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        formatNumber={formatNumber}
        getApiLimit={getApiLimit}
      />
    </>
  );
};

export default BillingLogsSection;