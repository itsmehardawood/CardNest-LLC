
import { apiFetch } from '@/app/lib/api.js';
import React, { useState, useEffect } from 'react';

const BillingLogsSection = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBillingLogs();
  }, []);

  const fetchBillingLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get merchant_id from localStorage
       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const merchantId = userData.user?.merchant_id;  

      if (!merchantId) {
        setError('Merchant ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await apiFetch(`/merchant/getOldSubscriptions?id=${merchantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status) {
        setSubscriptions(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch billing logs');
      }
    } catch (err) {
      setError('Failed to load billing logs. Please try again.');
      console.error('Error fetching billing logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    if (!amount) return 'N/A';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusColor = (isBlocked, renewalDate) => {
    if (isBlocked === 1) {
      return 'bg-red-900 text-red-300';
    }
    
    if (renewalDate) {
      const renewal = new Date(renewalDate);
      const now = new Date();
      
      if (renewal > now) {
        return 'bg-green-900 text-green-300';
      } else {
        return 'bg-red-900 text-red-300';
      }
    }
    
    return 'bg-gray-800 text-gray-300';
  };

  const getStatusText = (isBlocked, renewalDate) => {
    if (isBlocked === 1) {
      return 'Blocked';
    }
    
    if (renewalDate) {
      const renewal = new Date(renewalDate);
      const now = new Date();
      
      if (renewal > now) {
        return 'Active';
      } else {
        return 'Expired';
      }
    }
    
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="bg-black rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Billing Logs</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-300">Loading billing logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black rounded-lg shadow-md border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Billing Logs</h2>
        <div className="bg-red-900 border border-red-700 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-300">⚠</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchBillingLogs}
                  className="bg-red-800 hover:bg-red-700 text-red-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
   <div className="bg-black rounded-lg shadow-md border border-gray-800 p-6">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold text-white">Billing Logs</h2>
    <button
      onClick={fetchBillingLogs}
      className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
    >
      <span className="mr-1">↻</span>
      Refresh
    </button>
  </div>

  {subscriptions.length === 0 ? (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">No Past Subscriptions</h3>
      <p className="text-gray-300">There are no past subscriptions of yours.</p>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Package
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              API Calls Limit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              API Calls Used
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Subscription Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Renewal Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-black divide-y divide-gray-700">
          {subscriptions.map((subscription, index) => (
            <tr key={subscription.id || index} className="hover:bg-gray-900">
              {/* Package Column - Updated */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {subscription.package_id === 3 
                      ? 'Custom Enterprise Plan' 
                      : subscription.package_id === 2 
                        ? 'Premium Plan' 
                        : subscription.package_id === 1 
                          ? 'Basic Plan' 
                          : `Package ${subscription.package_id}`
                    }
                  </span>
                  {/* {subscription.package_id === 3 && (
                    <span className="text-xs text-purple-400 font-medium">
                      Custom Package
                    </span>
                  )} */}
                </div>
              </td>
              
              {/* API Calls Limit Column - Updated */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {subscription.package_id === 3 
                  ? (subscription.custom_api_count?.toLocaleString()  || 'N/A')
                  : subscription.api_calls_limit?.toLocaleString() || 'N/A'
                }
              </td>
              
              {/* API Calls Used Column - Updated */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                <div className="flex items-center">
                  <span className="mr-2">
                    {subscription.package_id === 3 
                      ? (subscription.custom_calls_used?.toLocaleString() || subscription.api_calls_used?.toLocaleString() || '0')
                      : subscription.api_calls_used?.toLocaleString() || '0'
                    }
                  </span>
                  {subscription.api_calls_limit && (
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{
                          width: `${Math.min(
                            (subscription.package_id === 3 
                              ? (subscription.custom_calls_used || subscription.api_calls_used || 0) 
                              : (subscription.api_calls_used || 0)
                            ) / subscription.api_calls_limit * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </td>
              
              {/* Subscription Date Column */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(subscription.subscription_date)}
              </td>
              
              {/* Renewal Date Column */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDate(subscription.renewal_date)}
              </td>
              
              {/* Status Column */}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex flex-col space-y-1 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs text-center font-semibold rounded-full ${
                    getStatusColor(subscription.is_blocked, subscription.renewal_date)
                  }`}>
                    {getStatusText(subscription.is_blocked, subscription.renewal_date)}
                  </span>
              
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
  );
};

export default BillingLogsSection;