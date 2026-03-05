'use client';

import React, { useState } from 'react';
import { AlertTriangle, Bell, Clock, Shield, CheckCircle, XCircle, Filter } from 'lucide-react';

/**
 * Risk Alerts Screen
 * Shows risk alerts triggered by address screening and transaction monitoring.
 * Placeholder — wire to your backend when API is ready.
 */
function RiskAlertsScreen() {
  const [filter, setFilter] = useState('all');

  // Placeholder — replace with API data
  const alerts = [];

  return (
    <div className="p-6 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Risk Alerts</h2>
          <p className="text-gray-400 mt-1">
            Review alerts triggered by sanctioned addresses, high-risk transactions, and anomalies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Alerts</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', value: '—', icon: <Bell className="w-5 h-5 text-purple-400" />, color: 'text-purple-400' },
          { label: 'Critical', value: '—', icon: <XCircle className="w-5 h-5 text-red-400" />, color: 'text-red-400' },
          { label: 'Pending Review', value: '—', icon: <Clock className="w-5 h-5 text-yellow-400" />, color: 'text-yellow-400' },
          { label: 'Resolved', value: '—', icon: <CheckCircle className="w-5 h-5 text-green-400" />, color: 'text-green-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="font-semibold">Alert Feed</h3>
        </div>

        {alerts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No risk alerts yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Alerts will appear here as your crypto-validation system detects risks.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {alerts.map((alert, idx) => (
              <div key={idx} className="px-6 py-4 flex items-start gap-4">
                <AlertTriangle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    alert.severity === 'critical'
                      ? 'text-red-400'
                      : alert.severity === 'high'
                        ? 'text-orange-400'
                        : 'text-yellow-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{alert.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                    alert.severity === 'critical'
                      ? 'bg-red-900/50 text-red-400'
                      : alert.severity === 'high'
                        ? 'bg-orange-900/50 text-orange-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                  }`}
                >
                  {alert.severity?.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RiskAlertsScreen;
