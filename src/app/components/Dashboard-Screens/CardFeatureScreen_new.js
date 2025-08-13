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

  const frontFeatures = [
    { key: 'bank_logo', label: 'Bank Logo', icon: CreditCard, color: 'bg-indigo-100 text-indigo-600', desc: 'Add your bank branding' },
    { key: 'chip', label: 'EMV Chip', icon: Zap, color: 'bg-amber-100 text-amber-600', desc: 'Secure contactless payments' },
    { key: 'hologram', label: 'Hologram', icon: Shield, color: 'bg-purple-100 text-purple-600', desc: 'Anti-counterfeit protection' }
  ];

  const backFeatures = [
    { key: 'mag_strip', label: 'Magnetic Strip', icon: CreditCard, color: 'bg-blue-100 text-blue-600', desc: 'Traditional swipe functionality' },
    { key: 'sig_strip', label: 'Signature Panel', icon: CreditCard, color: 'bg-green-100 text-green-600', desc: 'Cardholder verification' },
    { key: 'customer_service', label: 'Service Info', icon: Phone, color: 'bg-teal-100 text-teal-600', desc: 'Support contact details' },
    { key: 'symmetry', label: 'Symmetry Design', icon: RotateCcw, color: 'bg-pink-100 text-pink-600', desc: 'Aesthetic balance' }
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);
  const [hasExistingFeatures, setHasExistingFeatures] = useState(false);

  const getSelectedCount = () => {
    return Object.values(selectedFeatures).filter(Boolean).length;
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  // Function to load existing features
  const loadExistingFeatures = async (userIdToUse) => {
    if (!userIdToUse) return;
    
    setIsLoadingFeatures(true);
    try {
      const response = await apiFetch(`/feature/get?user_id=${userIdToUse}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (response.ok && responseData.code === 200 && responseData.data) {
        const data = responseData.data;
        
        // Convert the API response to boolean values
        // Handle both string and number values from API (1/"1" = true, 0/"0" = false)
        setSelectedFeatures({
          bank_logo: Boolean(Number(data.bank_logo)),
          chip: Boolean(Number(data.chip)),
          mag_strip: Boolean(Number(data.mag_strip)),
          sig_strip: Boolean(Number(data.sig_strip)),
          hologram: Boolean(Number(data.hologram)),
          customer_service: Boolean(Number(data.customer_service)),
          symmetry: Boolean(Number(data.symmetry))
        });
        
        setHasExistingFeatures(true);
        setMessage('Previously saved features loaded successfully!');
        
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        // No existing features found, keep default values
        setHasExistingFeatures(false);
      }
    } catch (error) {
      console.error('Error loading existing features:', error);
      // Don't show error to user as this is optional functionality
      setHasExistingFeatures(false);
    } finally {
      setIsLoadingFeatures(false);
    }
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

      const response = await apiFetch('/feature/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(hasExistingFeatures ? 'Your card features have been updated successfully!' : 'Your card features have been saved successfully!');
        setHasExistingFeatures(true);
      } else {
        throw new Error(responseData.message || 'Failed to save features');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const storedUser = localStorage.getItem('userData');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const userObj = parsedUser.user || parsedUser;
          const userIdFromStorage = userObj.id;
          const merchantId = userObj.merchant_id;
          
          setUserId(userIdFromStorage);
          
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
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    }
                  }
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
                }
              } catch (error) {
                console.error(`Error with ${param}:`, error);
              }
            }
            
            // If subscription is active, load existing features
            if (subscriptionFound && userIdFromStorage) {
              await loadExistingFeatures(userIdFromStorage);
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

if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-300 font-medium">Preparing your customization panel...</p>
        </div>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center  bg-black p-4">
        <div className="max-w-md w-full bg-black rounded-2xl shadow-xl overflow-hidden border border-gray-800 transform transition-all hover:shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-400 bg-opacity-10"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-400 bg-opacity-10"></div>
            <div className="relative z-10">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 bg-opacity-20 mb-4 shadow-lg">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Premium Features</h2>
              <p className="text-blue-100">Unlock full card customization</p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="mb-8 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Complete Design Control</h3>
                  <p className="text-gray-400 text-sm mt-1">Customize every aspect of your card appearance</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Real-time 3D Preview</h3>
                  <p className="text-gray-400 text-sm mt-1">See changes instantly before saving</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Advanced Security</h3>
                  <p className="text-gray-400 text-sm mt-1">Enterprise-grade protection features</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => window.location.href = '/plans'}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Explore Premium Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Scan Confidence Settings</h1>
          <p className="text-gray-300 max-w-lg mx-auto">Customize your card features you want to scan</p>
          <div className="mt-4 flex space-y-2 lg:space-y-0 md:space-y-0 items-center justify-center flex-col lg:flex-row md:flex-row space-x-4">
            <div className="bg-blue-900 text-blue-300 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <span> Features Enabled</span>
            </div>
            {hasExistingFeatures && (
              <div className="bg-green-900 text-green-300 px-4 py-2 rounded-full text-sm font-medium inline-flex items-center">
                <Check className="h-4 w-4 mr-2" />
                <span>Previously Saved Design</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Loading indicator for features */}
        {isLoadingFeatures && (
          <div className="mb-6 bg-black p-4 rounded-lg shadow-sm border border-gray-800">
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-gray-300">Loading your saved features...</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Front Preview with Front Features */}
          <div className="flex flex-col gap-8">
            <div className="bg-black p-6 rounded-2xl shadow-xl border border-gray-800 transform transition-all hover:shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-900 p-2 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="font-semibold text-white text-lg">Card Front</h2>
              </div>
              <div className="relative aspect-[1.58] rounded-xl overflow-hidden border-2 border-gray-700 bg-white  shadow-inner">
                <Image 
                  src="/images/cardfront.png"
                  fill
                  alt="Card Front"
                  className="object-contain"
                  priority
                />
                <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/10" />
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
            
            <div className="bg-black p-6 rounded-2xl shadow-xl border border-gray-800 h-full">
              <h2 className="font-semibold text-white text-lg mb-6">Front Features</h2>
              <div className="space-y-3">
                {frontFeatures.map((feature) => (
                  <div 
                    key={feature.key}
                    onClick={() => handleFeatureToggle(feature.key)}
                    className={`p-4 rounded-xl flex items-start cursor-pointer transition-all ${
                      selectedFeatures[feature.key] 
                        ? ' border-2 border-blue-700 shadow-sm'  
                        : 'hover:bg-gray-900 border-2 border-transparent hover:border-gray-700'
                    }`}
                     style={{backgroundColor: '#e0aa3e'}}
                  >
                    <div className={`h-6 w-6 rounded-md border-2 flex items-center justify-center mr-4 mt-0.5 transition-colors ${
                      selectedFeatures[feature.key] 
                        ? 'bg-blue-500 border-blue-500 shadow-sm' 
                        : 'border-gray-600'
                    }`}>
                      {selectedFeatures[feature.key] && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full ${feature.color} flex items-center justify-center mr-3 shadow-sm`}>
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">{feature.label}</h3>
                          <p className="text-xs text-white mt-1">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Back Preview with Back Features */}
          <div className="flex flex-col gap-8">
            <div className="bg-black p-6 rounded-2xl shadow-xl border border-gray-800 transform transition-all hover:shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-900 p-2 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="font-semibold text-white text-lg">Card Back</h2>
              </div>
              <div className="relative aspect-[1.58] rounded-xl overflow-hidden border-2 border-gray-700  bg-white  shadow-inner">
                  <Image 
                    src="/images/cardback.png"
                    fill
                    alt="Card Back"
                    className="object-contain"
                    priority
                  />

                <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/10" />
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
            
            <div className="bg-black p-6 rounded-2xl shadow-xl border border-gray-800 h-full">
              <h2 className="font-semibold text-white text-lg mb-6">Back Features</h2>
              <div className="space-y-3">
                {backFeatures.map((feature) => (
                  <div 
                    key={feature.key}
                    onClick={() => handleFeatureToggle(feature.key)}
                    className={`p-4 rounded-xl flex items-start cursor-pointer transition-all ${
                      selectedFeatures[feature.key] 
                        ? ' border-2 border-blue-700 shadow-sm' 
                        : 'hover:bg-gray-900 border-2 border-transparent hover:border-gray-700'
                    }`}
                                         style={{backgroundColor: '#e0aa3e'}}

                  >
                    <div className={`h-6 w-6 rounded-md border-2 flex items-center justify-center mr-4 mt-0.5 transition-colors ${
                      selectedFeatures[feature.key] 
                        ? 'bg-blue-500 border-blue-500 shadow-sm' 
                        : 'border-gray-600'
                    }`}>
                      {selectedFeatures[feature.key] && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full ${feature.color} flex items-center justify-center mr-3 shadow-sm`}>
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">{feature.label}</h3>
                          <p className="text-xs text-white mt-1">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary and Submit */}
        <div className="mt-12 bg-black p-8 rounded-2xl shadow-xl border border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Design Summary</h3>
              <p className="text-sm text-gray-400 mt-1">
                {hasExistingFeatures ? 'Review and update your features' : 'Review your selected features'}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-blue-900 px-4 py-2 rounded-full inline-flex items-center">
                <span className="text-sm font-medium text-blue-300 mr-2">
                  {getSelectedCount()} of {frontFeatures.length + backFeatures.length} features selected
                </span>
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm flex items-start ${
              message.includes('Error') 
                ? 'bg-red-900 text-red-300 border border-red-700' 
                : 'bg-green-900 text-green-300 border border-green-700'
            }`}>
              {message.includes('Error') ? (
                <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              ) : (
                <Check className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoadingFeatures}
            className={`w-full py-2 px-6 rounded-xl font-medium text-white transition-all flex items-center justify-center ${
              (isSubmitting || isLoadingFeatures)
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {hasExistingFeatures ? 'Updating Your Design...' : 'Saving Your Design...'}
              </>
            ) : (
              hasExistingFeatures ? 'Update Features' : 'Save Features'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditCardFeatureSelector;