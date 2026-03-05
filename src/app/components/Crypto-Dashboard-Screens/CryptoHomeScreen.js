'use client';

import React, { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiShield,
  FiActivity,
  FiSearch,
} from 'react-icons/fi';

/**
 * Crypto dashboard home screen — mirrors the structure of the card-scan HomeScreen
 * but with crypto-validation specific stats, CTAs, and messaging.
 */
function CryptoHomeScreen({ status, setActiveTab }) {
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
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
        };
      case 'incomplete':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          titleColor: 'text-red-800',
          textColor: 'text-red-700',
          icon: <FiAlertCircle className="text-red-500 text-xl" />,
          buttonColor: 'bg-red-600 hover:bg-red-700',
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700',
          icon: <FiClock className="text-yellow-500 text-xl" />,
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'approved':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700',
          icon: <FiCheckCircle className="text-blue-500 text-xl" />,
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
        };
      case 'active':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          titleColor: 'text-green-800',
          textColor: 'text-green-700',
          icon: <FiCheckCircle className="text-green-500 text-xl" />,
          buttonColor: 'bg-green-600 hover:bg-green-700',
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          titleColor: 'text-gray-800',
          textColor: 'text-gray-700',
          icon: <FiAlertCircle className="text-gray-500 text-xl" />,
          buttonColor: 'bg-gray-600 hover:bg-gray-700',
        };
    }
  };

  const getStatusMessage = (currentStatus) => {
    switch (currentStatus) {
      case 'incomplete-profile':
        return 'Complete your business profile to start validating crypto transactions';
      case 'incomplete':
        return 'Please update your business profile based on feedback';
      case 'pending':
        return 'Your application is under review';
      case 'approved':
        return 'Your account is approved — start screening crypto addresses';
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
        if (reason) setVerificationReason(reason);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
  }, []);

  const styling = getStatusStyling(status);

  return (
    <div className="p-6 space-y-6">
      {/* Status Banner */}
      <div className={`rounded-lg border p-5 ${styling.bgColor} ${styling.borderColor}`}>
        <div className="flex items-start gap-3">
          {styling.icon}
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${styling.titleColor}`}>
              {status === 'incomplete-profile'
                ? 'Complete Your Profile'
                : status === 'pending'
                  ? 'Under Review'
                  : status === 'approved' || status === 'active'
                    ? 'Account Active'
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

      {/* Quick Action Cards */}
      {(status === 'approved' || status === 'active') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('crypto-validation')}
            className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-left hover:border-purple-500 transition-colors"
          >
            <FiShield className="text-purple-400 text-2xl mb-3" />
            <h4 className="text-white font-semibold">Crypto Validation</h4>
            <p className="text-gray-400 text-sm mt-1">Validate wallet addresses and transactions</p>
          </button>

          <button
            onClick={() => setActiveTab('address-screening')}
            className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-left hover:border-purple-500 transition-colors"
          >
            <FiSearch className="text-purple-400 text-2xl mb-3" />
            <h4 className="text-white font-semibold">Address Screening</h4>
            <p className="text-gray-400 text-sm mt-1">Screen addresses against sanctions & risk lists</p>
          </button>

          <button
            onClick={() => setActiveTab('transaction-monitoring')}
            className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-left hover:border-purple-500 transition-colors"
          >
            <FiActivity className="text-purple-400 text-2xl mb-3" />
            <h4 className="text-white font-semibold">Transaction Monitoring</h4>
            <p className="text-gray-400 text-sm mt-1">Real-time monitoring of on-chain transactions</p>
          </button>
        </div>
      )}

      {/* Stats overview placeholder */}
      {(status === 'approved' || status === 'active') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Validations Today', value: '—', color: 'text-purple-400' },
            { label: 'Addresses Screened', value: '—', color: 'text-blue-400' },
            { label: 'Risk Alerts', value: '—', color: 'text-red-400' },
            { label: 'Monitored Txns', value: '—', color: 'text-green-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center"
            >
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CryptoHomeScreen;
