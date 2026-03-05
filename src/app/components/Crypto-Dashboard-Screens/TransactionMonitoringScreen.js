'use client';

import React, { useState } from 'react';
import { Activity, ArrowUpRight, ArrowDownLeft, Clock, Filter } from 'lucide-react';

/**
 * Transaction Monitoring Screen
 * Real-time view of monitored on-chain transactions.
 * Placeholder — wire to your backend when API is ready.
 */
function TransactionMonitoringScreen() {
  const [filter, setFilter] = useState('all');

  // Placeholder data — replace with API data
  const transactions = [];

  return (
    <div className="p-6 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transaction Monitoring</h2>
          <p className="text-gray-400 mt-1">
            Monitor on-chain transactions in real-time for suspicious activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All</option>
            <option value="flagged">Flagged</option>
            <option value="clean">Clean</option>
          </select>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Monitored Today', value: '—', icon: <Activity className="w-5 h-5 text-purple-400" /> },
          { label: 'Flagged', value: '—', icon: <ArrowUpRight className="w-5 h-5 text-red-400" /> },
          { label: 'Avg Response Time', value: '—', icon: <Clock className="w-5 h-5 text-blue-400" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
            {stat.icon}
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="font-semibold">Recent Transactions</h3>
        </div>

        {transactions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No transactions monitored yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Transactions will appear here once your crypto-validation API is connected.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {transactions.map((tx, idx) => (
              <div key={idx} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {tx.direction === 'in' ? (
                    <ArrowDownLeft className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-red-400" />
                  )}
                  <div>
                    <p className="font-mono text-sm text-gray-300 truncate max-w-xs">{tx.hash}</p>
                    <p className="text-xs text-gray-500">{tx.chain} · {tx.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{tx.amount}</p>
                  <p className={`text-xs ${tx.flagged ? 'text-red-400' : 'text-green-400'}`}>
                    {tx.flagged ? 'Flagged' : 'Clean'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionMonitoringScreen;
