import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PricingSection from '../General/SubscriptionsCard';

function SubscriptionsScreen() {
  const router = useRouter();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // Get user data from localStorage
        const storedUser = localStorage.getItem('userData');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const userObj = parsedUser.user || parsedUser;
          
          // Get merchant_id from user object
          const merchantId = userObj.merchant_id;
          
          if (merchantId) {
            // Call the API with merchant_id
            // console.log('Checking subscription for merchant_id:', merchantId);
            
            // Try different parameter variations with GET method
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
              
              // console.log(`Trying GET with parameter: ${param}`);
              
              try {
                const response = await fetch(
                  `https://cardsecuritysystem-8xdez.ondigitalocean.app/api/Subscriptions/GetByUserIDorMerchantID?${param}`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    }
                  }
                );
                
                // console.log(`Response status for ${param}:`, response.status);
                
                if (response.ok) {
                  const data = await response.json();
                  // console.log('Subscription data:', data);
                  
                  // Check if status is true and data exists
                  if (data.status === true && data.data) {
                    setHasActiveSubscription(true);
                    setSubscriptionData(data.data);
                    subscriptionFound = true;
                    // console.log('Active subscription found!');
                  } else if (data.status === true) {
                    // Handle case where status is true but no nested data object
                    setHasActiveSubscription(true);
                    subscriptionFound = true;
                    // console.log('Active subscription found (legacy format)!');
                  }
                  break; // Stop trying if we get a successful response
                }
              } catch (error) {
                console.error(`Error with ${param}:`, error);
              }
            }
            
            // If no variation worked, log it
            if (!subscriptionFound) {
              // console.log('No active subscription found or API endpoint not working with any parameter variation');
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

  const handleBrowsePlans = () => {
    router.push("/plans");
   
  };

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
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border  p-4  sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscriptions</h2>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4 animate-pulse">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
            <p className="text-gray-600">Loading subscription status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Subscriptions</h2>

        <div className="py-4 sm:py-8">
          {hasActiveSubscription ? (
            <div className="max-w-5xl mx-auto">
              {subscriptionData && subscriptionData.package ? (
                <div className="space-y-6">
                  {/* Status Header */}
                  <div className="text-center px-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Active Subscription</h3>
                    <p className="text-sm sm:text-base text-gray-600">Your subscription is active and ready to use</p>
                  </div>

                  {/* Main Subscription Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 shadow-sm">
                    {/* Header Section - Stack on mobile, side-by-side on desktop */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 space-y-4 sm:space-y-0">
                      <div className="text-center sm:text-left">
                        <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                          {subscriptionData.package.package_name} Plan
                        </h4>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                            {formatCurrency(subscriptionData.package.package_price)}
                          </span>
                          <span className="text-sm sm:text-base text-gray-600">/ {subscriptionData.package.package_period}</span>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Next Renewal</p>
                        <p className="text-sm sm:text-lg font-semibold text-gray-900">
                          {formatDate(subscriptionData.renewal_date)}
                        </p>
                      </div>
                    </div>

                    {/* Usage Statistics - Responsive grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
                      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Monthly Limit</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">
                              {subscriptionData.package.monthly_limit}
                            </p>
                            <p className="text-xs text-gray-500">API Calls</p>
                          </div>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center ml-2">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Used</p>
                            <p className="text-lg sm:text-2xl font-bold text-orange-600">
                              {subscriptionData.api_calls_used}
                            </p>
                            <p className="text-xs text-gray-500">API Calls</p>
                          </div>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center ml-2">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">Remaining</p>
                            <p className="text-lg sm:text-2xl font-bold text-green-600">
                              {subscriptionData.package.monthly_limit - subscriptionData.api_calls_used}
                            </p>
                            <p className="text-xs text-gray-500">API Calls</p>
                          </div>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center ml-2">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Usage Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Usage Progress</span>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {Math.round((subscriptionData.api_calls_used / subscriptionData.package.monthly_limit) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 sm:h-3 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((subscriptionData.api_calls_used / subscriptionData.package.monthly_limit) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Overage Alert */}
                    {subscriptionData.overage_calls > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-yellow-800">
                              Overage Usage: {subscriptionData.overage_calls} calls
                            </p>
                            <p className="text-xs text-yellow-700 mt-1">
                              Additional charges: {formatCurrency(subscriptionData.overage_calls * parseFloat(subscriptionData.package.overage_rate))} 
                              (${subscriptionData.package.overage_rate} per call)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center px-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Active Subscription</h3>
                  <p className="text-sm sm:text-base text-gray-600">You have an active subscription</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Active Subscription</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">Get started with one of our plans</p>
             
            </div>
          )}
        </div>

        {/* Conditional Available Plans Section */}
        <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 px-2 sm:px-0">
            {hasActiveSubscription ? "Upgrade Your Plan" : "Available Plans"}
          </h3>
          
          {hasActiveSubscription ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Ready to Level Up?
                </h4>
                <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto px-2">
                  Explore our premium plans with higher limits, advanced features, and better value for your growing needs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
                  <button
                    onClick={handleBrowsePlans}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm sm:text-base">View All Plans</span>
                  </button>
                  <button
                    onClick={handleBrowsePlans}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium inline-flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm sm:text-base">Compare Plans</span>
                  </button>
                </div>
                
                {/* Feature highlights for upgrades */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-left">
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900">Higher Limits</h5>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Get more API calls per month with our premium plans</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                      </div>
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900">Advanced Features</h5>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Unlock premium features and priority support</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900">Better Value</h5>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Save money with our cost-effective higher tier plans</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <PricingSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionsScreen;