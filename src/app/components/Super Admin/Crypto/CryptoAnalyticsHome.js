'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, CheckCircle, XCircle, AlertCircle, BarChart3, Activity } from 'lucide-react';
import { cryptoApiFetch } from '@/app/lib/api.js';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

function CryptoAnalyticsHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await cryptoApiFetch('/superadmin/crypto/analytics', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch analytics (${response.status})`);
        }

        const payload = await response.json();
        if (payload.status && payload.data) {
          setAnalyticsData(payload.data);
        } else {
          throw new Error('Invalid analytics data received');
        }
      } catch (err) {
        setError(err?.message || 'Failed to load analytics.');
        setAnalyticsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-700/50 text-red-300 rounded-lg px-6 py-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Failed to load analytics</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const summary = analyticsData?.summary || {};
  const validationStatus = analyticsData?.validation_status || {};
  const activity7Days = analyticsData?.activity_7_days || [];

  const successPercentage = Math.round(summary.success_rate || 0);
  const blockedPercentage = summary.total_addresses > 0 
    ? Math.round((validationStatus.blocked / summary.total_addresses) * 100) 
    : 0;

  const pieData = [
    { name: 'Validated', value: validationStatus.validated || 0, color: '#10b981' },
    { name: 'Blocked', value: validationStatus.blocked || 0, color: '#ef4444' },
  ];

  const totalValidations = activity7Days.reduce((sum, day) => sum + (day.validations || 0), 0);
  const totalAlerts = activity7Days.reduce((sum, day) => sum + (day.alerts || 0), 0);
  const avgDailyValidations = activity7Days.length > 0 ? Math.round(totalValidations / activity7Days.length) : 0;

  return (
    <div className="space-y-6 text-white w-full">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Crypto Validation Analytics</h1>
        <p className="text-gray-400">Real-time monitoring of crypto address screening operations</p>
      </div>

      {/* KPI Cards - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Total Screened</p>
              <p className="text-2xl font-bold text-white mt-2">{summary.total_addresses || 0}</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-700/30 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Validated</p>
              <p className="text-2xl font-bold text-green-400 mt-2">{validationStatus.validated || 0}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-900/30 to-red-900/10 border border-red-700/30 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Blocked</p>
              <p className="text-2xl font-bold text-red-400 mt-2">{validationStatus.blocked || 0}</p>
            </div>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-700/30 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-purple-400 mt-2">{successPercentage}%</p>
            </div>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart - spans 2 cols */}
        <div className="lg:col-span-2 bg-black border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" />
              7-Day Trend
            </h2>
            <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">Last 7 days</span>
          </div>

          {activity7Days && activity7Days.length > 0 ? (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activity7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis
                    dataKey="date"
                    stroke="#666"
                    style={{ fontSize: '11px' }}
                    tick={{ fill: '#999' }}
                  />
                  <YAxis stroke="#666" style={{ fontSize: '11px' }} tick={{ fill: '#999' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: '#fff',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#999' }} />
                  <Line
                    type="monotone"
                    dataKey="validations"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Validations"
                  />
                  <Line
                    type="monotone"
                    dataKey="alerts"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    name="Alerts"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>No data available</p>
            </div>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-black border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            Distribution
          </h2>

          {pieData.some(d => d.value > 0) ? (
            <div className="space-y-4">
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-300">Validated</span>
                  </div>
                  <span className="font-semibold text-green-400">{validationStatus.validated || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-gray-300">Blocked</span>
                  </div>
                  <span className="font-semibold text-red-400">{validationStatus.blocked || 0}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5">
          <p className="text-gray-400 text-sm font-medium mb-2">Total Validations</p>
          <p className="text-3xl font-bold text-white">{totalValidations}</p>
          <p className="text-xs text-gray-500 mt-2">Across 7 days</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5">
          <p className="text-gray-400 text-sm font-medium mb-2">Total Alerts</p>
          <p className="text-3xl font-bold text-white">{totalAlerts}</p>
          <p className="text-xs text-gray-500 mt-2">Security flags</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5">
          <p className="text-gray-400 text-sm font-medium mb-2">Average Daily</p>
          <p className="text-3xl font-bold text-white">{avgDailyValidations}</p>
          <p className="text-xs text-gray-500 mt-2">Validations per day</p>
        </div>
      </div>
    </div>
  );
}

export default CryptoAnalyticsHome;
