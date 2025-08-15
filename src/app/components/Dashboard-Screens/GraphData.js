'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FiTrendingUp, FiActivity, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { apiFetch } from '@/app/lib/api.js';

const GraphData = () => {
  const [scanData, setScanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalScans: 0,
    successfulScans: 0,
    failedScans: 0,
    successRate: 0
  });

  useEffect(() => {
    fetchScanData();
  }, []);

  const fetchScanData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const merchantId = userData.user?.merchant_id;

      if (!merchantId) {
        throw new Error('Merchant ID not found');
      }

      const response = await apiFetch(`/merchant/getCardScans?id=${merchantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scan data');
      }

      const data = await response.json();

      if (data.status && data.data) {
        setScanData(data.data);
        processData(data.data);
      } else {
        throw new Error(data.message || 'Failed to retrieve scan data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching scan data:', err);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data) => {
    const totalScans = data.length;
    const successfulScans = data.filter(scan => scan.status === 'success').length;
    const failedScans = totalScans - successfulScans;
    const successRate = totalScans > 0 ? Math.round((successfulScans / totalScans) * 100) : 0;

    setStats({
      totalScans,
      successfulScans,
      failedScans,
      successRate
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getLast7DaysData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayScans = scanData.filter(scan => 
        scan.created_at.startsWith(dateStr)
      );
      
      last7Days.push({
        date: formatDate(date),
        scans: dayScans.length,
        successful: dayScans.filter(scan => scan.status === 'success').length,
        failed: dayScans.filter(scan => scan.status !== 'success').length
      });
    }
    
    return last7Days;
  };

  const getStatusDistribution = () => {
    const successful = scanData.filter(scan => scan.status === 'success').length;
    const failed = scanData.filter(scan => scan.status !== 'success').length;
    
    return [
      { name: 'Successful', value: successful, color: '#10B981' },
      { name: 'Failed', value: failed, color: '#EF4444' }
    ];
  };

  const getHourlyDistribution = () => {
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      scans: 0
    }));

    scanData.forEach(scan => {
      const hour = new Date(scan.created_at).getHours();
      hourlyData[hour].scans++;
    });

    return hourlyData.filter(item => item.scans > 0);
  };

  if (loading) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-800 rounded"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-6">
        <div className="text-center py-8">
          <FiActivity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Unable to Load Analytics</h3>
          <p className="text-gray-300 text-sm mb-4">{error}</p>
          <button
            onClick={fetchScanData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (scanData.length === 0) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-6">
        <div className="text-center py-8">
          <FiActivity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Scan Data Available</h3>
          <p className="text-gray-300 text-sm">Start scanning cards to see your analytics here.</p>
        </div>
      </div>
    );
  }

  const statusData = getStatusDistribution();
  const weeklyData = getLast7DaysData();
  const hourlyData = getHourlyDistribution();

  return (
    <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Scan Analytics</h2>
          <p className="text-gray-300 text-sm mt-1">
            Insights from your card scanning activity
          </p>
        </div>
        <button
          onClick={fetchScanData}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Scans</p>
              <p className="text-2xl font-bold text-white">{stats.totalScans}</p>
            </div>
            <FiActivity className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Successful</p>
              <p className="text-2xl font-bold text-green-400">{stats.successfulScans}</p>
            </div>
            <FiCheckCircle className="text-green-500 text-xl" />
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Failed</p>
              <p className="text-2xl font-bold text-red-400">{stats.failedScans}</p>
            </div>
            <FiXCircle className="text-red-500 text-xl" />
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-purple-400">{stats.successRate}%</p>
            </div>
            <FiTrendingUp className="text-purple-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Scan Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Last 7 Days Activity */}
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Last 7 Days Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Bar dataKey="scans" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Distribution */}
        {hourlyData.length > 0 && (
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Hourly Scan Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="scans" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphData;
