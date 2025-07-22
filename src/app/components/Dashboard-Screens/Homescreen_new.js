'use client'
import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiEdit2, FiHelpCircle, FiMail, FiZap, FiDollarSign, FiFileText } from 'react-icons/fi';

function HomeScreen({ status, setActiveTab }) {
  const [verificationReason, setVerificationReason] = useState('');

  // Function to get status-specific styling
  const getStatusStyling = (currentStatus) => {
    switch (currentStatus) {
      case 'incomplete-profile':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          titleColor: 'text-orange-800',
          textColor: 'text-orange-700',
          icon: <FiAlertCircle className="text-orange-500 text-xl" />,
          buttonColor: 'bg-orange-600 hover:bg-orange-700'
        };
      case 'incomplete':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          titleColor: 'text-red-800',
          textColor: 'text-red-700',
          icon: <FiAlertCircle className="text-red-500 text-xl" />,
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700',
          icon: <FiClock className="text-yellow-500 text-xl" />,
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'approved':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700',
          icon: <FiCheckCircle className="text-blue-500 text-xl" />,
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'active':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          titleColor: 'text-green-800',
          textColor: 'text-green-700',
          icon: <FiCheckCircle className="text-green-500 text-xl" />,
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          titleColor: 'text-gray-800',
          textColor: 'text-gray-700',
          icon: <FiHelpCircle className="text-gray-500 text-xl" />,
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  // Function to get status message
  const getStatusMessage = (currentStatus) => {
    switch (currentStatus) {
      case 'incomplete-profile':
        return 'Please complete your business profile to continue';
      case 'incomplete':
        return 'Please update your business profile based on feedback';
      case 'pending':
        return 'Your application is under review';
      case 'approved':
        return 'Your account has been approved';
      case 'active':
        return 'Your account is fully active';
      default:
        return 'Status unknown';
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const user = parsed?.user || parsed;
        const reason = user?.verification_reason;
        if (reason) {
          setVerificationReason(reason);
        }
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
  }, []);

  const statusStyling = getStatusStyling(status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Welcome to Your Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your account and access services</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Dynamic Status Card */}
            <div className={`${statusStyling.bgColor} ${statusStyling.borderColor} p-5 rounded-lg border transition-all hover:shadow-md`}>
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-full bg-white shadow-sm mr-3">
                  {statusStyling.icon}
                </div>
                <h3 className={`font-semibold ${statusStyling.titleColor}`}>Account Status</h3>
              </div>
              <p className={`${statusStyling.textColor} capitalize font-medium mb-2 text-sm`}>
                {status === 'incomplete-profile' ? 'Incomplete Profile' : status.replace('-', ' ')}
              </p>
              <p className={`${statusStyling.textColor} text-sm mb-4`}>{getStatusMessage(status)}</p>
              
              {/* Action button based on status */}
              {(status === 'incomplete-profile' || status === 'incomplete') && (
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`mt-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${statusStyling.buttonColor} flex items-center`}
                >
                  <FiEdit2 className="mr-2" />
                  {status === 'incomplete-profile' ? 'Complete Profile' : 'Update Profile'}
                </button>
              )}
              {status === 'pending' && (
                <button 
                  onClick={() => setActiveTab('support')}
                  className={`mt-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${statusStyling.buttonColor} flex items-center`}
                >
                  <FiHelpCircle className="mr-2" />
                  Contact Support
                </button>
              )}
              {status === 'approved' && (
                <button 
                  onClick={() => setActiveTab('subscriptions')}
                  className={`mt-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${statusStyling.buttonColor} flex items-center`}
                >
                  <FiDollarSign className="mr-2" />
                  Choose Plan
                </button>
              )}
              {status === 'active' && (
                <button 
                  onClick={() => setActiveTab('balance')}
                  className={`mt-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${statusStyling.buttonColor} flex items-center`}
                >
                  <FiFileText className="mr-2" />
                  View Balance
                </button>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-green-50 p-5 rounded-lg border border-green-200 transition-all hover:shadow-md">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-full bg-white shadow-sm mr-3">
                  <FiZap className="text-green-500 text-xl" />
                </div>
                <h3 className="font-semibold text-green-800">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                {status === 'approved' && (
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="w-full flex items-center justify-between text-green-700 hover:text-green-900 text-sm font-medium p-2 hover:bg-green-100 rounded transition-colors"
                  >
                    <span>View Profile</span>
                    <span>→</span>
                  </button>
                )}
                {status === 'approved' && (
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="w-full flex items-center justify-between text-green-700 hover:text-green-900 text-sm font-medium p-2 hover:bg-green-100 rounded transition-colors"
                  >
                    <span>View Documents</span>
                    <span>→</span>
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('developers')}
                  className="w-full flex items-center justify-between text-green-700 hover:text-green-900 text-sm font-medium p-2 hover:bg-green-100 rounded transition-colors"
                >
                  <span>API Access</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-purple-50 p-5 rounded-lg border border-purple-200 transition-all hover:shadow-md">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-full bg-white shadow-sm mr-3">
                  <FiHelpCircle className="text-purple-500 text-xl" />
                </div>
                <h3 className="font-semibold text-purple-800">Need Help?</h3>
              </div>
              <p className="text-purple-700 text-sm mb-4">Our support team is here to assist you with any questions or issues.</p>
              <div className="space-y-3">
                <a 
                  href="mailto:support@cardnest.io"
                  className="flex items-center text-purple-700 hover:text-purple-900 text-sm font-medium p-2 hover:bg-purple-100 rounded transition-colors"
                >
                  <FiMail className="mr-2" />
                  support@cardnest.io
                </a>
                <button 
                  onClick={() => setActiveTab('support')}
                  className="w-full flex items-center justify-between text-purple-700 hover:text-purple-900 text-sm font-medium p-2 hover:bg-purple-100 rounded transition-colors"
                >
                  <span>Help Center</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Additional Status-based Information */}
          {status === 'incomplete-profile' && (
            <div className="mt-8 p-5 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-3 flex items-center">
                <FiAlertCircle className="mr-2" />
                Complete Your Business Profile
              </h3>
              <p className="text-orange-700 text-sm mb-4">
                Welcome! To get started, please complete your business profile with the following information:
              </p>
              <ul className="space-y-2 text-orange-700 text-sm">
                <li className="flex items-start">
                  <span className="inline-block bg-orange-200 text-orange-800 rounded-full p-1 mr-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Business name and registration details
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-orange-200 text-orange-800 rounded-full p-1 mr-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Contact information and address
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-orange-200 text-orange-800 rounded-full p-1 mr-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Upload business registration document
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-orange-200 text-orange-800 rounded-full p-1 mr-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Bank account information
                </li>
              </ul>
            </div>
          )}

          {status === 'incomplete' && (
            <div className="mt-8 p-5 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                <FiAlertCircle className="mr-2" />
                Profile Update Required
              </h3>

              {verificationReason && (
                <div className="mb-4 p-3 bg-white rounded border border-red-100">
                  <p className="text-red-600 text-sm font-semibold mb-1">Feedback from our team:</p>
                  <p className="text-red-700 text-sm">{verificationReason}</p>
                </div>
              )}

              <p className="text-red-700 text-sm mb-4">
                Please update your business profile based on the feedback provided:
              </p>
              <ul className="space-y-2 text-red-700 text-sm">
                <li className="flex items-start">
                  <span className="inline-block bg-red-200 text-red-800 rounded-full p-1 mr-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Review and update business information
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-red-200 text-red-800 rounded-full p-1 mr-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Upload corrected documents if needed
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-red-200 text-red-800 rounded-full p-1 mr-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Ensure all details are accurate and complete
                </li>
              </ul>
            </div>
          )}

          {status === 'pending' && (
            <div className="mt-8 p-5 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                <FiClock className="mr-2" />
                Review in Progress
              </h3>
              <p className="text-yellow-700 text-sm mb-3">
                We are currently reviewing your application. This process typically takes 1-3 business days. 
                We will notify you once the review is complete.
              </p>
              <div className="bg-white p-3 rounded border border-yellow-100 mt-3">
                <p className="text-yellow-700 text-sm font-medium">What happens next?</p>
                <ul className="mt-2 space-y-1 text-yellow-700 text-sm">
                  <li className="flex items-start">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded-full p-1 mr-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Our team verifies your business details
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded-full p-1 mr-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    We check your uploaded documents
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block bg-yellow-200 text-yellow-800 rounded-full p-1 mr-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    You will receive an email notification with the result
                  </li>
                </ul>
              </div>
            </div>
          )}

          {status === 'approved' && (
            <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <FiCheckCircle className="mr-2" />
                Account Approved!
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                Congratulations! Your account has been approved. If you have not subscribed yet, 
                you can now choose a subscription plan and start using our services.
              </p>
              <div className="bg-white p-3 rounded border border-blue-100">
                <p className="text-blue-700 text-sm font-medium mb-2">Next steps:</p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setActiveTab('subscriptions')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors hover:bg-blue-700 flex items-center"
                  >
                    <FiDollarSign className="mr-2" />
                    Choose Plan
                  </button>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 flex items-center"
                  >
                    <FiFileText className="mr-2" />
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {status === 'active' && (
            <div className="mt-8 p-5 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <FiCheckCircle className="mr-2" />
                Welcome! Your Account is Active
              </h3>
              <p className="text-green-700 text-sm mb-4">
                Your account is fully active and ready to use. Explore all the features available 
                in your dashboard and do not hesitate to contact support if you need assistance.
              </p>
              <div className="bg-white p-3 rounded border border-green-100">
                <p className="text-green-700 text-sm font-medium mb-2">Quick links:</p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setActiveTab('balance')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium transition-colors hover:bg-green-700 flex items-center"
                  >
                    <FiDollarSign className="mr-2" />
                    View Balance
                  </button>
                  <button 
                    onClick={() => setActiveTab('transactions')}
                    className="px-4 py-2 bg-white text-green-600 border border-green-200 rounded-lg text-sm font-medium transition-colors hover:bg-green-50 flex items-center"
                  >
                    <FiFileText className="mr-2" />
                    View Transactions
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;