import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PricingSection from '../General/SubscriptionsCard';
import { apiFetch } from '@/app/lib/api.js';

function SubscriptionsScreen() {
  const router = useRouter();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [userObj, setUserObj] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const userData = parsedUser.user || parsedUser;
          setUserObj(userData);
          
          const merchantId = userData.merchant_id;
          if (merchantId) {
            const paramVariations = [
              `merchant_id=${merchantId}`,
              `merchantId=${merchantId}`,
              `id=${merchantId}`,
              `MerchantID=${merchantId}`,
              `UserID=${merchantId}`
            ];
            
            let subscriptionFound = false;
            for (const param of paramVariations) {
              if (subscriptionFound) break;
              try {
                const response = await apiFetch(
                  `/Subscriptions/GetByUserIDorMerchantID?${param}`,
                  { method: 'GET', headers: { 'Content-Type': 'application/json' } }
                );
                
                if (response.ok) {
                  const data = await response.json();
                  if (data.status === true && data.data) {
                    setHasActiveSubscription(true);
                    setSubscriptionData(data.data);
                    subscriptionFound = true;
                  } else if (data.status === true) {
                    setHasActiveSubscription(true);
                    subscriptionFound = true;
                  }
                  break;
                } else if (response.status === 404) {
                  // No subscription found - this is expected for new users
                  console.log('No subscription found for user - this is normal for new users');
                  setHasActiveSubscription(false);
                  setSubscriptionData(null);
                  subscriptionFound = true;
                  break;
                }
              } catch (error) {
                console.error(`Error with ${param}:`, error);
              }
            }
            
            // If no subscription was found after trying all parameters
            if (!subscriptionFound) {
              setHasActiveSubscription(false);
              setSubscriptionData(null);
            }
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  const handleBrowsePlans = () => router.push("/plans");

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Helper functions for package data based on package_id
  const getMonthlyLimit = () => {
    if (!subscriptionData) return 0;
    if (subscriptionData.package_id === 3) {
      return subscriptionData.custom_api_count || 0;
    }
    return subscriptionData.package?.monthly_limit || 0;
  };

  const getUsedCalls = () => {
    if (!subscriptionData) return 0;
    if (subscriptionData.package_id === 3) {
      return subscriptionData.custom_calls_used || 0;
    }
    return subscriptionData.api_calls_used || 0;
  };

  const getRemainingCalls = () => {
    const limit = getMonthlyLimit();
    const used = getUsedCalls();
    return Math.max(0, limit - used);
  };

  const getUsagePercentage = () => {
    const limit = getMonthlyLimit();
    if (limit === 0) return 0;
    const used = getUsedCalls();
    return Math.round((used / limit) * 100);
  };

  const getPlanName = () => {
    if (!subscriptionData) return 'No Plan';
    if (subscriptionData.package_id === 3) {
      return 'Custom Enterprise Plan';
    }
    return subscriptionData.package?.package_name ? `${subscriptionData.package.package_name} Plan` : 'Unknown Plan';
  };

  const getPlanPrice = () => {
    if (!subscriptionData) return 0;
    if (subscriptionData.package_id === 3) {
      return subscriptionData.custom_price || 0;
    }
    return subscriptionData.package?.package_price || 0;
  };

  const isCustomPackage = () => {
    if (!subscriptionData) return false;
    return subscriptionData.package_id === 3;
  };

  
if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-black rounded-xl shadow-lg border border-gray-800 p-8 sm:p-10">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Loading Subscription Details</h2>
                <p className="text-gray-300">We are fetching your subscription information...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Main Content */}
        <div className="space-y-8">
          {/* Status Section */}
          {hasActiveSubscription ? (
            <div className="space-y-6">
              {/* Active Subscription Banner */}
              <div className="bg-black rounded-xl shadow-sm border border-gray-800 p-6">
                <div className="flex items-center">
                  <div className="bg-green-900 p-2 rounded-full mr-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Active Subscription</h2>
                    <p className="text-gray-300">Your subscription is active and ready to use</p>
                  </div>
                </div>
              </div>

              {/* Plan Details */}
              {subscriptionData && (
                <div className="bg-black rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{getPlanName()}</h3>
                        <p className="text-gray-300 text-lg">{formatCurrency(getPlanPrice())} / {subscriptionData.package?.package_period || 'month'}</p>
                        {isCustomPackage() && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                              Custom Package
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 sm:mt-0 bg-green-900 text-green-300 px-4 py-2 rounded-full text-sm font-medium">
                        <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {isCustomPackage() && subscriptionData.custom_status === 'inactive' ? 'Pending Activation' : 'Approved'}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Usage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-blue-900 p-5 rounded-lg border border-blue-800">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Monthly Limit</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{getMonthlyLimit().toLocaleString()}</p>
                        <p className="text-sm text-gray-400">API Calls</p>
                      </div>

                      <div className="bg-purple-900 p-5 rounded-lg border border-purple-800">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Used</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{getUsedCalls().toLocaleString()}</p>
                        <p className="text-sm text-gray-400">API Calls</p>
                      </div>

                      <div className="bg-green-900 p-5 rounded-lg border border-green-800">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Remaining</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{getRemainingCalls().toLocaleString()}</p>
                        <p className="text-sm text-gray-400">API Calls</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Usage Progress</h4>
                        <span className="text-sm font-medium text-gray-300">{getUsagePercentage()}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            getUsagePercentage() > 90 
                              ? 'bg-red-500' 
                              : getUsagePercentage() > 70 
                                ? 'bg-yellow-500' 
                                : 'bg-blue-500'
                          }`}
                          style={{ 
                            width: `${Math.min(getUsagePercentage(), 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Custom Package Info */}
                    {isCustomPackage() && (
                      <div className="mb-8 bg-purple-900 p-5 rounded-lg border border-purple-800">
                        <h4 className="text-sm font-medium text-purple-300 uppercase tracking-wider mb-3">Custom Package Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-purple-300 font-medium">Custom API Count:</span>
                            <span className="ml-2 text-purple-200">{(subscriptionData.custom_api_count || 0).toLocaleString()}</span>
                          </div>
                          {/* <div>
                            <span className="text-purple-300 font-medium">Custom Price:</span>
                            <span className="ml-2 text-purple-200">{formatCurrency(subscriptionData.custom_price || 0)}</span>
                          </div> */}
                          {/* <div>
                            <span className="text-purple-300 font-medium">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              subscriptionData.custom_status === 'active' 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-yellow-900 text-yellow-300'
                            }`}>
                              {subscriptionData.custom_status === 'active' ? 'Active' : 'Pending Activation'}
                            </span>
                          </div> */}
                        </div>
                      </div>
                    )}

                    {/* Next Renewal */}
                    <div className="bg-gray-900 p-5 rounded-lg border border-gray-700">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-gray-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Next Renewal</h4>
                      </div>
                      <p className="text-lg font-medium text-white">{formatDate(subscriptionData?.renewal_date)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 px-6 bg-black rounded-xl shadow-sm border border-gray-800">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-800 mb-4">
                <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Active Subscription</h3>
              <p className="text-gray-300 max-w-md mx-auto mb-6">
                You do not have an active subscription. Choose a plan that fits your needs to unlock all features.
              </p>
       
            </div>
          )}

          {/* Plans Section - Conditional based on package type */}
          {hasActiveSubscription && subscriptionData ? (
            isCustomPackage() ? (
              <div className="bg-slate-900 rounded-xl shadow-sm border border-gray-800 p-6">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-900 mb-4">
                    <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Custom Enterprise Plan</h2>
                  <p className="text-gray-300 max-w-md mx-auto mb-6">
                    You are currently on a custom enterprise plan. If you would like to downgrade your package or make any changes, please contact our customer support team.
                  </p>
                  <div className="bg-blue-900 p-4 rounded-lg border border-blue-800">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-blue-300 font-medium">Contact Customer Support</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-xl shadow-sm border border-gray-800 p-6">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Available Plans</h2>
                  <p className="text-gray-300">Choose the perfect plan for your business needs</p>
                </div>
                <PricingSection  isDark={true} />
              </div>
            )
          ) : (
            <div className="bg-slate-900 rounded-xl shadow-sm border border-gray-800 p-6">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Available Plans</h2>
                <p className="text-gray-300">Choose the perfect plan for your business needs</p>
              </div>
              <PricingSection  isDark={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

}

export default SubscriptionsScreen;

