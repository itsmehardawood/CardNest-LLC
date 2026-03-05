'use client';

import React, { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEdit2,
} from 'react-icons/fi';
import { ShieldCheck, Eye, FileCheck } from 'lucide-react';

/**
 * Home screen for the KYC dashboard (kyc.cardnest.io).
 * Shows account status + quick-access cards to the three KYC sections.
 */
function KYCHomeScreen({ status, setActiveTab }) {
  const [verificationReason, setVerificationReason] = useState('');

  const getStatusStyling = (currentStatus) => {
    switch (currentStatus) {
      case 'incomplete-profile':
        return {
          bgColor: 'bg-orange-50', borderColor: 'border-orange-200',
          titleColor: 'text-orange-800', textColor: 'text-orange-700',
          icon: <FiAlertCircle className="text-orange-500 text-xl" />,
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
        };
      case 'incomplete':
        return {
          bgColor: 'bg-red-50', borderColor: 'border-red-200',
          titleColor: 'text-red-800', textColor: 'text-red-700',
          icon: <FiAlertCircle className="text-red-500 text-xl" />,
          buttonColor: 'bg-red-600 hover:bg-red-700',
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200',
          titleColor: 'text-yellow-800', textColor: 'text-yellow-700',
          icon: <FiClock className="text-yellow-500 text-xl" />,
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'approved':
      case 'active':
        return {
          bgColor: 'bg-blue-50', borderColor: 'border-blue-200',
          titleColor: 'text-blue-800', textColor: 'text-blue-700',
          icon: <FiCheckCircle className="text-blue-500 text-xl" />,
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
        };
      default:
        return {
          bgColor: 'bg-gray-50', borderColor: 'border-gray-200',
          titleColor: 'text-gray-800', textColor: 'text-gray-700',
          icon: <FiAlertCircle className="text-gray-500 text-xl" />,
          buttonColor: 'bg-gray-600 hover:bg-gray-700',
        };
    }
  };

  const getStatusMessage = (currentStatus) => {
    switch (currentStatus) {
      case 'incomplete-profile': return 'Complete your business profile to start running KYC verifications';
      case 'incomplete': return 'Please update your business profile based on the feedback received';
      case 'pending': return 'Your application is under review — KYC features will unlock once approved';
      case 'approved':
      case 'active': return 'Your account is approved — all KYC verification tools are available';
      default: return 'Status unknown';
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const user = parsed?.user || parsed;
        if (user?.verification_reason) setVerificationReason(user.verification_reason);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
  }, []);

  const styling = getStatusStyling(status);
  const isActive = status === 'approved' || status === 'active';

  return (
    <div className="p-6 space-y-6">
      {/* Status Banner */}
      <div className={`rounded-lg border p-5 ${styling.bgColor} ${styling.borderColor}`}>
        <div className="flex items-start gap-3">
          {styling.icon}
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${styling.titleColor}`}>
              {status === 'incomplete-profile' ? 'Complete Your Profile'
                : status === 'pending' ? 'Under Review'
                : isActive ? 'Account Active'
                : 'Action Required'}
            </h3>
            <p className={`mt-1 ${styling.textColor}`}>{getStatusMessage(status)}</p>
            {verificationReason && status === 'incomplete' && (
              <p className={`mt-2 text-sm italic ${styling.textColor}`}>
                Reason: {verificationReason}
              </p>
            )}
            {(status === 'incomplete-profile' || status === 'incomplete') && (
              <button
                onClick={() => setActiveTab('profile')}
                className={`mt-3 px-4 py-2 rounded-lg text-white text-sm font-medium ${styling.buttonColor}`}
              >
                <FiEdit2 className="inline mr-1" /> Go to Business Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      {isActive && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('kyc-dashboard')}
            className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-left hover:border-teal-500 transition-colors"
          >
            <ShieldCheck className="text-teal-400 text-2xl mb-3 w-6 h-6" />
            <h4 className="text-white font-semibold">KYC Dashboard</h4>
            <p className="text-gray-400 text-sm mt-1">
              Overview of all verifications, usage stats, and recent activity
            </p>
          </button>

          <button
            onClick={() => setActiveTab('face-verification')}
            className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-left hover:border-teal-500 transition-colors"
          >
            <Eye className="text-teal-400 text-2xl mb-3 w-6 h-6" />
            <h4 className="text-white font-semibold">Face Verification</h4>
            <p className="text-gray-400 text-sm mt-1">
              View facial recognition and liveness check results
            </p>
          </button>

          <button
            onClick={() => setActiveTab('documents-verifications')}
            className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-left hover:border-teal-500 transition-colors"
          >
            <FileCheck className="text-teal-400 text-2xl mb-3 w-6 h-6" />
            <h4 className="text-white font-semibold">Documents Results</h4>
            <p className="text-gray-400 text-sm mt-1">
              Browse document verification records including passports and IDs
            </p>
          </button>
        </div>
      )}
    </div>
  );
}

export default KYCHomeScreen;
