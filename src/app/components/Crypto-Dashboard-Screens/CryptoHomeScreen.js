'use client';

import React, { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiShield,
  FiActivity,
  FiTrendingUp,
  FiBarChart2,
} from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Crypto dashboard home screen — minimal, clean design with welcome message,
 * account status, analytics cards, and key charts.
 */
function CryptoHomeScreen({ status, setActiveTab }) {
  const [verificationReason, setVerificationReason] = useState('');
  const [userData, setUserData] = useState(null);
  const [cryptoStats, setCryptoStats] = useState({
    totalAddresses: 0,
    validationsPending: 0,
    riskAlerts: 0,
    successRate: 0,
  });

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
        setUserData(user);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }

    // Initialize with sample data — replace with API calls as needed
    setCryptoStats({
      totalAddresses: 234,
      validationsPending: 12,
      riskAlerts: 3,
      successRate: 98,
    });
  }, []);

  const styling = getStatusStyling(status);
  const userName = userData?.business_name || 'Welcome';

  // Sample data for pie chart (validation status distribution)
  const validationData = [
    { name: 'Validated', value: 189, color: '#10B981' },
    { name: 'Pending', value: 12, color: '#F59E0B' },
    { name: 'Failed', value: 3, color: '#EF4444' },
  ];

  // Sample data for bar chart (activity over last 7 days)
  const activityData = [
    { day: 'Mon', validations: 28, alerts: 2 },
    { day: 'Tue', validations: 35, alerts: 1 },
    { day: 'Wed', validations: 31, alerts: 3 },
    { day: 'Thu', validations: 42, alerts: 2 },
    { day: 'Fri', validations: 38, alerts: 0 },
    { day: 'Sat', validations: 22, alerts: 1 },
    { day: 'Sun', validations: 25, alerts: 1 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {userName}</h1>
        <p className="text-gray-400 text-sm mt-1">
          {status === 'active' || status === 'approved'
            ? 'Your crypto validation dashboard is active and ready to use'
            : 'Complete your profile to start validating crypto transactions'}
        </p>
      </div>

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

      {/* Analytics Cards - Only show when active/approved */}
      {(status === 'approved' || status === 'active') && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Addresses */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Addresses</p>
                  <p className="text-3xl font-bold text-purple-400 mt-1">{cryptoStats.totalAddresses}</p>
                </div>
                <FiShield className="text-purple-500 text-2xl opacity-50" />
              </div>
            </div>

            {/* Card 2: Validations Pending */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-1">{cryptoStats.validationsPending}</p>
                </div>
                <FiClock className="text-yellow-500 text-2xl opacity-50" />
              </div>
            </div>

            {/* Card 3: Risk Alerts */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Risk Alerts</p>
                  <p className="text-3xl font-bold text-red-400 mt-1">{cryptoStats.riskAlerts}</p>
                </div>
                <FiAlertCircle className="text-red-500 text-2xl opacity-50" />
              </div>
            </div>

            {/* Card 4: Success Rate */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">{cryptoStats.successRate}%</p>
                </div>
                <FiCheckCircle className="text-green-500 text-2xl opacity-50" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart: Validation Status Distribution */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiBarChart2 className="text-purple-400" />
                <h3 className="text-white font-semibold">Validation Status</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={validationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {validationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {validationData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }}></div>
                    <p className="text-gray-400 text-xs">{item.name}</p>
                    <p className="text-white font-semibold text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart: Activity Over 7 Days */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiTrendingUp className="text-blue-400" />
                <h3 className="text-white font-semibold">Activity (7 Days)</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="validations" fill="#8b5cf6" />
                  <Bar dataKey="alerts" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CryptoHomeScreen;
