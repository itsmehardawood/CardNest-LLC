'use client'
import React, { useEffect, useState } from 'react';

function HomeScreen({ status, setActiveTab }) {
    const [verificationReason, setVerificationReason] = useState('');

  // Function to get status-specific styling
  const getStatusStyling = (currentStatus) => {
    switch (currentStatus) {
      case 'incomplete-profile':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          titleColor: 'text-orange-900',
          textColor: 'text-orange-700',
          icon: '🟠'
        };
      case 'incomplete':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          titleColor: 'text-red-900',
          textColor: 'text-red-700',
          icon: '🔴'
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          titleColor: 'text-yellow-900',
          textColor: 'text-yellow-700',
          icon: '🟡'
        };
      case 'approved':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          titleColor: 'text-blue-900',
          textColor: 'text-blue-700',
          icon: '🔵'
        };
      case 'active':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          titleColor: 'text-green-900',
          textColor: 'text-green-700',
          icon: '🟢'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          titleColor: 'text-gray-900',
          textColor: 'text-gray-700',
          icon: '⚪'
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
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Your Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Dynamic Status Card */}
        <div className={`${statusStyling.bgColor} ${statusStyling.borderColor} p-4 rounded-lg border`}>
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">{statusStyling.icon}</span>
            <h3 className={`font-semibold ${statusStyling.titleColor}`}>Account Status</h3>
          </div>
          <p className={`${statusStyling.textColor} capitalize font-medium mb-1`}>
            {status === 'incomplete-profile' ? 'Incomplete Profile' : status}
          </p>
          <p className={`${statusStyling.textColor} text-sm`}>{getStatusMessage(status)}</p>
          
          {/* Action button based on status */}
          {(status === 'incomplete-profile' || status === 'incomplete') && (
            <button 
              onClick={() => setActiveTab('profile')}
              className={`mt-3 px-3 py-1 text-white rounded-md text-sm ${
                status === 'incomplete-profile' 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {status === 'incomplete-profile' ? 'Complete Profile' : 'Update Profile'}
            </button>
          )}
          {status === 'pending' && (
            <button 
              onClick={() => setActiveTab('support')}
              className="mt-3 px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
            >
              Contact Support
            </button>
          )}
          {status === 'approved' && (
            <button 
              onClick={() => setActiveTab('subscriptions')}
              className="mt-3 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Choose Plan
            </button>
          )}
          {status === 'active' && (
            <button 
              onClick={() => setActiveTab('balance')}
              className="mt-3 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              View Balance
            </button>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">⚡</span>
            <h3 className="font-semibold text-green-900">Quick Actions</h3>
          </div>
          <div className="space-y-2">

          {status === 'approved'&&(
            <button 
              onClick={() => setActiveTab('profile')}
              className="block text-green-700 hover:text-green-900 text-sm"
            >
              View Profile →
            </button>
          )}
            <button 
              onClick={() => setActiveTab('profile')}
              className="block text-green-700 hover:text-green-900 text-sm"
            >
              Complete Profile →
            </button>
            <button 
              onClick={() => setActiveTab('documents')}
              className="block text-green-700 hover:text-green-900 text-sm"
            >
              Upload Documents →
            </button>
            {/* if approved */}
            {status === 'approved'&& (
  <button 
              onClick={() => setActiveTab('documents')}
              className="block text-green-700 hover:text-green-900 text-sm"
            >
              Uploaded Documents →
            </button>
            )}
         

            <button 
              onClick={() => setActiveTab('developers')}
              className="block text-green-700 hover:text-green-900 text-sm"
            >
              API Access →
            </button>
          </div>
        </div>

        {/* Support Card */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">💬</span>
            <h3 className="font-semibold text-purple-900">Need Help?</h3>
          </div>
          <p className="text-purple-700 text-sm mb-3">Our support team is here to assist you</p>
          <div className="space-y-2">
              <a 
              href="mailto:support@cardnest.io"
              className="block text-purple-700 hover:text-purple-900 text-sm"
            >
              Email: support@cardnest.io
            </a>
          </div>
        </div>
      </div>

      {/* Additional Status-based Information */}
      {status === 'incomplete-profile' && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="font-semibold text-orange-900 mb-2">Complete Your Business Profile</h3>
          <p className="text-orange-700 text-sm mb-3">
            Welcome! To get started, please complete your business profile with the following information:
          </p>
          <ul className="space-y-1 text-orange-700 text-sm">
            <li>• Business name and registration details</li>
            <li>• Contact information and address</li>
            <li>• Upload business registration document</li>
            <li>• Bank account information</li>
          </ul>
        </div>
      )}

      {status === 'incomplete' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-900 mb-2">Profile Update Required</h3>

          {verificationReason && (
            <div className="mb-3">
              <p className="text-red-600 text-sm font-semibold">Feedback from our team:</p>
              <p className="text-red-700 text-sm">{verificationReason}</p>
            </div>
          )}

          <p className="text-red-700 text-sm mb-3">
            Please update your business profile based on the feedback provided:
          </p>
          <ul className="space-y-1 text-red-700 text-sm">
            <li>• Review and update business information</li>
            <li>• Upload corrected documents if needed</li>
            <li>• Ensure all details are accurate and complete</li>
          </ul>
        </div>
      )}

      {status === 'pending' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">Review in Progress</h3>
          <p className="text-yellow-700 text-sm">
            We are currently reviewing your application. This process typically takes 1-3 business days. 
            We will notify you once the review is complete.
          </p>
        </div>
      )}

      {status === 'approved' && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Account Approved!</h3>
          <p className="text-blue-700 text-sm">
        Congratulations! Your account has been approved. If you have not subscribed yet, you can now choose a subscription plan and start using our services.

          </p>
        </div>
      )}

      {status === 'active' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Welcome! Your Account is Active</h3>
          <p className="text-green-700 text-sm">
            Your account is fully active and ready to use. Explore all the features available 
            in your dashboard and do not hesitate to contact support if you need assistance.
          </p>
        </div>
      )}
    </div>
  );
}

export default HomeScreen;