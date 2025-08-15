'use client'
import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiEdit2, FiMail, FiZap, FiDollarSign, FiFileText } from 'react-icons/fi';
import GraphData from './GraphData';

function HomeScreen({ status, setActiveTab }) {
  const [verificationReason, setVerificationReason] = useState('');

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
          icon: <FiAlertCircle className="text-gray-500 text-xl" />,
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

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
      <div className="bg-black rounded-xl shadow-sm border border-gray-800 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Welcome to Your Dashboard</h2>
          <p className="text-gray-300 mt-1">Manage your account and access services</p>
        </div>
        
        <div className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Status Card */}
            <div className={`${statusStyling.bgColor} ${statusStyling.borderColor} p-5 rounded-lg border transition-all hover:shadow-md`}>
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-full mr-3">
                  {statusStyling.icon}
                </div>
                <h3 className={`font-semibold ${statusStyling.titleColor}`}>Account Status</h3>
              </div>
              <p className={`${statusStyling.textColor} capitalize font-medium mb-2 text-sm`}>
                {status === 'incomplete-profile' ? 'Incomplete Profile' : status.replace('-', ' ')}
              </p>
              <p className={`${statusStyling.textColor} text-sm mb-4`}>{getStatusMessage(status)}</p>

                  {status === 'pending' && (
  <a
    href="mailto:support@cardnest.io?subject=Help with Pending Status&body=Hi Support Team,%0A%0AI need help with my pending status."
    className="mt-3 inline-block px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
  >
    Contact Support
  </a>
)}
              
              {/* Action buttons */}
              {(status === 'incomplete-profile' || status === 'incomplete') && (
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`mt-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${statusStyling.buttonColor} flex items-center`}
                >
                  <FiEdit2 className="mr-2" />
                  {status === 'incomplete-profile' ? 'Complete Profile' : 'Update Profile'}
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
            <div className="bg-gray-900 p-5 rounded-lg border border-gray-700 transition-all hover:shadow-md">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-full mr-3">
                  <FiZap className="text-green-500 text-xl" />
                </div>
                <h3 className="font-semibold text-white">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="w-full flex items-center justify-between text-gray-300 hover:text-white text-sm font-medium p-2 hover:bg-gray-800 rounded transition-colors"
                >
                  <span>{status === 'approved' || status === 'active' ? 'View Profile' : 'Complete Profile'}</span>
                  <span>→</span>
                </button>
                <button 
                  onClick={() => setActiveTab('documents')}
                  className="w-full flex items-center justify-between text-gray-300 hover:text-white text-sm font-medium p-2 hover:bg-gray-800 rounded transition-colors"
                >
                  <span>{status === 'approved' || status === 'active' ? 'View Documents' : 'Upload Documents'}</span>
                  <span>→</span>
                </button>
                <button 
                  onClick={() => setActiveTab('developers')}
                  className="w-full flex items-center justify-between text-gray-300 hover:text-white text-sm font-medium p-2 hover:bg-gray-800 rounded transition-colors"
                >
                  <span>API Access</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Support Card - Simplified */}
            <div className="bg-gray-900 p-5 rounded-lg border border-gray-700 transition-all hover:shadow-md">
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-full mr-3">
                  <FiMail className="text-purple-500 text-xl" />
                </div>
                <h3 className="font-semibold text-white">Need Help?</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Our support team is here to assist you with any questions or issues.
              </p>
              <a 
                href="mailto:support@cardnest.io"
                className="flex items-center text-gray-300 hover:text-white text-sm font-medium p-2 hover:bg-gray-800 rounded transition-colors"
              >
                <FiMail className="mr-2" />
                support@cardnest.io
              </a>
            </div>
          </div>

          {/* Status-specific information */}
          {status === 'incomplete-profile' && (
            <div className="mt-8 p-5 bg-gray-900 border border-gray-700 rounded-lg">
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <FiAlertCircle className="mr-2" />
                Complete Your Business Profile
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Welcome! To get started, please complete your business profile.
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="inline-block bg-gray-700 text-white rounded-full p-1 mr-2">✓</span>
                  Business name and registration details
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-gray-700 text-white rounded-full p-1 mr-2">✓</span>
                  Contact information and address
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-gray-700 text-white rounded-full p-1 mr-2">✓</span>
                  Upload business registration document
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-gray-700 text-white rounded-full p-1 mr-2">✓</span>
                  Bank account information
                </li>
              </ul>
            </div>
          )}

          {status === 'incomplete' && (
            <div className="mt-8 p-5 bg-gray-900 border border-gray-700 rounded-lg">
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <FiAlertCircle className="mr-2" />
                Profile Update Required
              </h3>
              {verificationReason && (
                <div className="mb-4 p-3 bg-black rounded border border-gray-700">
                  <p className="text-red-400 text-sm font-semibold mb-1">Feedback:</p>
                  <p className="text-red-300 text-sm">{verificationReason}</p>
                </div>
              )}
              <p className="text-gray-300 text-sm mb-4">
                Please update your profile based on the feedback above.
              </p>
            </div>
          )}

          {status === 'pending' && (
            <div className="mt-8 p-5 bg-gray-900 border border-gray-700 rounded-lg">
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <FiClock className="mr-2" />
                Review in Progress
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                We are reviewing your application. This typically takes 1-3 business days.
              </p>
            </div>
          )}

          {status === 'approved' && (
            <div className="mt-8 p-5 bg-gray-900 border border-gray-700 rounded-lg">
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <FiCheckCircle className="mr-2" />
                Account Approved!
              </h3>
              <p className="text-gray-300 text-sm mb-4">
        Congratulations! Your account has been approved. If you have not subscribed yet, you can now choose a subscription plan and start using our services.
              </p>
              
            </div>
          )}

          {/* Scan Analytics - Only show for approved users */}
          {status === 'approved' && (
            <div className="mt-8">
              <GraphData />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;