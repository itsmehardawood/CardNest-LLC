'use client';

import { useState, useEffect } from 'react';
import { Check, CreditCard, Shield, Zap, Phone, RotateCcw, Lock, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { apiFetch } from '@/app/lib/api.js';

const CreditCardFeatureSelector = () => {
  const [selectedFeatures, setSelectedFeatures] = useState({
    bank_logo: false,
    chip: false,
    mag_strip: false,
    sig_strip: false,
    hologram: false,
    customer_service: false,
    symmetry: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const frontFeatures = [
    { key: 'bank_logo', label: 'Bank Logo', icon: CreditCard },
    { key: 'chip', label: 'Chip', icon: Zap },
    { key: 'hologram', label: 'Hologram', icon: Shield }
  ];

  const backFeatures = [
    { key: 'mag_strip', label: 'Magnetic Strip', icon: CreditCard },
    { key: 'sig_strip', label: 'Signature Strip', icon: CreditCard },
    { key: 'customer_service', label: 'Customer Service Info', icon: Phone },
    { key: 'symmetry', label: 'Symmetry Design', icon: RotateCcw }
  ];

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // Get user data from localStorage
        const storedUser = localStorage.getItem('userData');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const userObj = parsedUser.user || parsedUser;
          
          // Get both user_id and merchant_id from user object
          const userIdFromStorage = userObj.id;
          const merchantId = userObj.merchant_id;
          
          // Set user_id for later use in API call
          setUserId(userIdFromStorage);
          
          if (merchantId) {
            // Call the API with merchant_id
            console.log('Checking subscription for merchant_id:', merchantId);
            
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
              
              console.log(`Trying GET with parameter: ${param}`);
              
              try {
                const response = await apiFetch(
                  `/Subscriptions/GetByUserIDorMerchantID?${param}`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    }
                  }
                );
                
                console.log(`Response status for ${param}:`, response.status);
                
                if (response.ok) {
                  const data = await response.json();
                  console.log('Subscription data:', data);
                  
                  // Check if status is true and data exists
                  if (data.status === true && data.data) {
                    setHasActiveSubscription(true);
                    setSubscriptionData(data.data);
                    subscriptionFound = true;
                    console.log('Active subscription found!');
                  } else if (data.status === true) {
                    // Handle case where status is true but no nested data object
                    setHasActiveSubscription(true);
                    subscriptionFound = true;
                    console.log('Active subscription found (legacy format)!');
                  }
                  break; // Stop trying if we get a successful response
                }
              } catch (error) {
                console.error(`Error with ${param}:`, error);
              }
            }
            
            // If no variation worked, log it
            if (!subscriptionFound) {
              console.log('No active subscription found or API endpoint not working with any parameter variation');
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

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      setMessage('Error: User ID not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const requestBody = {
        user_id: userId,
        bank_logo: selectedFeatures.bank_logo,
        chip: selectedFeatures.chip,
        mag_strip: selectedFeatures.mag_strip,
        sig_strip: selectedFeatures.sig_strip,
        hologram: selectedFeatures.hologram,
        customer_service: selectedFeatures.customer_service,
        symmetry: selectedFeatures.symmetry
      };

      console.log('Sending request to API:', requestBody);

      const response = await apiFetch('/feature/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setMessage('Features saved successfully!');
        console.log('Features saved:', responseData);
      } else {
        throw new Error(responseData.message || 'Failed to save features');
      }
    } catch (error) {
      setMessage(`Error saving features: ${error.message}`);
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCount = () => {
    return Object.values(selectedFeatures).filter(Boolean).length;
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full mx-auto flex flex-col w-[100%] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Checking subscription status...</p>
      </div>
    );
  }

  // No subscription state
  if (!hasActiveSubscription) {
    return (
      <div className="h-full mx-auto flex flex-col w-[100%] items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 p-3 rounded-full">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Subscription Required
          </h2>
          
          <p className="text-gray-600 mb-6">
            To access the credit card feature selector, you need an active subscription. 
            Please subscribe your plan to unlock this feature.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">What you will get:</h3>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Access to all card features</li>
              <li>• Real-time feature selection</li>
              <li>• Advanced card customization</li>
              <li>• Priority customer support</li>
            </ul>
          </div>
          
          <button 
            onClick={() => window.location.href = '/plans'}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Plans
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Already have a subscription? Try refreshing the page or contact support.
          </p>
        </div>
      </div>
    );
  }

  // Main component with subscription
  return (
    <div className="h-full mx-auto flex flex-col w-[100%]">
      <div className="flex-1 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Card Preview */}
          <div className="flex flex-col h-[350px]">
            <div className="flex-1 flex flex-col justify-center space-y-4 lg:space-y-6 p-2 lg:p-4">
              {/* Card Front */}
              <div className="flex-1 flex flex-col items-center">
                <h3 className="text-sm lg:text-base font-semibold mb-2 lg:mb-3 text-center flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Card Front
                </h3>
                <div className="w-full max-w-xs lg:max-w-sm">
                  <div className="w-full h-32  rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl flex items-center justify-center">
                    {/* <span className="text-white font-bold">SAMPLE CARD</span> */}
                    <Image src="/images/cardfront.png"
                      height= "300"
                      width="450"
                      alt='card front'
                    />
                  </div>
                </div>
              </div>
              
              {/* Card Back */}
              <div className="flex-1 flex flex-col items-center">
                <h3 className="text-sm lg:text-base font-semibold mb-2 lg:mb-3 text-center flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Card Back
                </h3>
                <div className="w-full max-w-xs lg:max-w-sm">
                  <div className="w-full h-32 rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl flex items-center justify-center">
                    {/* <span className="text-white font-bold">SAMPLE BACK</span> */}
                      <Image src="/images/cardback.png"
                      height= "350"
                      width="450"
                      alt='card front'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Selection */}
          <div className="h-full overflow-y-auto">
            <div className="space-y-2 lg:space-y-3 p-1 lg:p-2">
              <div className="bg-white rounded-lg shadow-md p-2 lg:p-3">
                <h3 className="text-sm lg:text-base font-semibold mb-2 lg:mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Front Side Features
                </h3>
                <div className="space-y-1 lg:space-y-2">
                  {frontFeatures.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <label
                        key={feature.key}
                        className="flex items-center gap-2 p-2 rounded-md border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFeatures[feature.key]}
                          onChange={() => handleFeatureToggle(feature.key)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                          selectedFeatures[feature.key] 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300'
                        }`}>
                          {selectedFeatures[feature.key] && (
                            <Check className="w-2 h-2 text-white" />
                          )}
                        </div>
                        <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <span className="text-sm font-medium">{feature.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-2 lg:p-3">
                <h3 className="text-sm lg:text-base font-semibold mb-2 lg:mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Back Side Features
                </h3>
                <div className="space-y-1 lg:space-y-2">
                  {backFeatures.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <label
                        key={feature.key}
                        className="flex items-center gap-2 p-2 rounded-md border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFeatures[feature.key]}
                          onChange={() => handleFeatureToggle(feature.key)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                          selectedFeatures[feature.key] 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300'
                        }`}>
                          {selectedFeatures[feature.key] && (
                            <Check className="w-2 h-2 text-white" />
                          )}
                        </div>
                        <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <span className="text-sm font-medium">{feature.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Summary and Submit */}
              <div className="bg-gray-50 rounded-lg p-2 lg:p-3 sticky bottom-0">
                <div className="flex items-center justify-between mb-2 lg:mb-3">
                  <h3 className="text-sm lg:text-base font-semibold">Selection Summary</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {getSelectedCount()} features selected
                  </span>
                </div>
                
                {message && (
                  <div className={`mb-2 lg:mb-3 p-2 rounded-md text-sm ${
                    message.includes('Error') 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {message}
                  </div>
                )}
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !userId}
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Saving...' : 'Save Features'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardFeatureSelector;