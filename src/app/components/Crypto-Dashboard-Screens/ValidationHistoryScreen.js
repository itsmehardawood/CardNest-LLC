'use client';

import React, { useState } from 'react';
import { History, Search, Filter, ExternalLink, Copy, CheckCircle, XCircle, Clock } from 'lucide-react';

/**
 * Validation History Screen
 * Shows past crypto address validations and screening results.
 * Placeholder — wire to your backend when API is ready.
 */
function ValidationHistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Placeholder — replace with API data
  const history = [];

  return (
    <div className="p-6 space-y-6 text-white">
      <div>
        <h2 className="text-2xl font-bold">Validation History</h2>
        <p className="text-gray-400 mt-1">
          View all past address validations, screenings, and their results.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by address or transaction hash..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Results</option>
          <option value="clean">Clean</option>
          <option value="flagged">Flagged</option>
          <option value="sanctioned">Sanctioned</option>
        </select>
      </div>

      {/* History Table */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {history.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No validation history yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Your validation results will be logged here once you start screening addresses.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-left px-6 py-3 font-medium">Address</th>
                  <th className="text-left px-6 py-3 font-medium">Chain</th>
                  <th className="text-left px-6 py-3 font-medium">Result</th>
                  <th className="text-left px-6 py-3 font-medium">Risk Score</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">{item.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-300 truncate max-w-[200px]">{item.address}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(item.address)}
                          className="text-gray-500 hover:text-white"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 capitalize">{item.chain}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          item.result === 'clean'
                            ? 'bg-green-900/50 text-green-400'
                            : item.result === 'flagged'
                              ? 'bg-yellow-900/50 text-yellow-400'
                              : 'bg-red-900/50 text-red-400'
                        }`}
                      >
                        {item.result === 'clean' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : item.result === 'flagged' ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {item.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{item.riskScore}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-purple-400 hover:text-purple-300 text-xs">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ValidationHistoryScreen;
