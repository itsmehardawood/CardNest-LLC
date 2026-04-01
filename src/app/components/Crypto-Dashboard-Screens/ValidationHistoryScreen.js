'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { History, Search, Copy, CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiFetch } from '@/app/lib/api.js';

/**
 * Validation History Screen
 * Shows past crypto address validations and screening results.
 */
function ValidationHistoryScreen() {
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const getMerchantId = () => {
    try {
      const stored = localStorage.getItem('userData');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      const user = parsed?.user || parsed;
      return user?.merchant_id || null;
    } catch {
      return null;
    }
  };

  const mapRecord = (item) => {
    const result = item?.validation_result || {};
    const resultData = result?.data || {};
    const summary = resultData?.summary || {};
    const sanction = resultData?.sanction_check || {};

    return {
      id: item?.id,
      address: item?.masked_address || resultData?.address || 'N/A',
      network: resultData?.network || 'N/A',
      sanctionStatus: summary?.sanction_status || sanction?.decision || 'UNKNOWN',
      validationPassed: Boolean(summary?.validation_passed),
      timestamp: resultData?.timestamp || item?.created_at || null,
      riskLevel: (resultData?.risk_level || 'UNKNOWN').toUpperCase(),
      chain: result?.chain || item?.chain || 'UNKNOWN',
    };
  };

  const fetchHistory = async (targetPage = 1) => {
    setLoading(true);
    setError('');

    const merchantId = getMerchantId();

    if (!merchantId) {
      setError('Merchant ID not found. Please log in again.');
      setHistory([]);
      setLoading(false);
      return;
    }

    const min = (targetPage - 1) * pageSize + 1;
    const max = targetPage * pageSize;

    try {
      const response = await apiFetch(
        `/crypto/history?merchant_id=${encodeURIComponent(merchantId)}&min=${min}&max=${max}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch history (${response.status})`);
      }

      const payload = await response.json();
      const rows = Array.isArray(payload?.data) ? payload.data.map(mapRecord) : [];

      setHistory(rows);
      setPage(targetPage);
      setHasMore(rows.length === pageSize);
    } catch (err) {
      setError(err?.message || 'Failed to load validation history.');
      setHistory([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const formatTimestamp = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    });
  };

  const getSanctionStatusMeta = (value) => {
    const normalized = (value || 'UNKNOWN').toString().toUpperCase();

    if (normalized === 'CLEAN' || normalized === 'CLEARED') {
      return {
        label: 'CLEARED',
        className: 'bg-green-900/50 text-green-300 border border-green-700/60',
      };
    }

    if (normalized === 'UNKNOWN') {
      return {
        label: 'UNKNOWN',
        className: 'bg-gray-800 text-gray-300 border border-gray-700',
      };
    }

    return {
      label: normalized,
      className: 'bg-red-900/50 text-red-300 border border-red-700/60',
    };
  };

  const getRiskLevelMeta = (value) => {
    const normalized = (value || 'UNKNOWN').toString().toUpperCase();

    if (normalized === 'LOW') {
      return {
        label: 'LOW',
        className: 'bg-green-900/50 text-green-300 border border-green-700/60',
      };
    }

    if (normalized === 'MEDIUM') {
      return {
        label: 'MEDIUM',
        className: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/60',
      };
    }

    if (normalized === 'HIGH' || normalized === 'SEVERE' || normalized === 'CRITICAL') {
      return {
        label: normalized,
        className: 'bg-red-900/50 text-red-300 border border-red-700/60',
      };
    }

    return {
      label: normalized,
      className: 'bg-gray-800 text-gray-300 border border-gray-700',
    };
  };

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return history.filter((item) => {
      const matchesSearch =
        q === '' ||
        item.address.toLowerCase().includes(q) ||
        item.chain.toLowerCase().includes(q) ||
        item.network.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filter === 'passed') return item.validationPassed;
      if (filter === 'failed') return !item.validationPassed;
      if (filter === 'sanctioned') return item.sanctionStatus.toUpperCase() !== 'CLEAN';

      return true;
    });
  }, [history, searchQuery, filter]);

  const canPrev = page > 1 && !loading;
  const canNext = hasMore && !loading;

  return (
    <div className="p-6 space-y-6 text-white">
      <div>
        <h2 className="text-2xl font-bold">Validation History</h2>
        <p className="text-gray-400 mt-1">
          View all past address validations and their outcomes.
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
            placeholder="Search by address, chain, or network..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Results</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="sanctioned">Sanctioned</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* History Table */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-16 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Loading validation history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
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
                  <th className="text-left px-6 py-3 font-medium">Timestamp</th>
                  <th className="text-left px-6 py-3 font-medium">Recipient CryptoAddress</th>
                  <th className="text-left px-6 py-3 font-medium">Chain</th>
                  <th className="text-left px-6 py-3 font-medium">Network</th>
                  <th className="text-left px-6 py-3 font-medium">Sanction Status</th>
                  <th className="text-left px-6 py-3 font-medium">Validation</th>
                  <th className="text-left px-6 py-3 font-medium">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">{formatTimestamp(item.timestamp)}</td>
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
                    <td className="px-6 py-4 text-gray-400 uppercase">{item.chain}</td>
                    <td className="px-6 py-4 text-gray-400">{item.network}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getSanctionStatusMeta(item.sanctionStatus).className}`}
                      >
                        {getSanctionStatusMeta(item.sanctionStatus).label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          item.validationPassed
                            ? 'bg-green-900/50 text-green-400'
                            : 'bg-red-900/50 text-red-400'
                        }`}
                      >
                        {item.validationPassed ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {item.validationPassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getRiskLevelMeta(item.riskLevel).className}`}
                      >
                        {getRiskLevelMeta(item.riskLevel).label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs">Page {page} • Showing up to {pageSize} records</p>
        <div className="flex gap-2">
          <button
            onClick={() => fetchHistory(page - 1)}
            disabled={!canPrev}
            className="px-3 py-1.5 rounded-md border border-gray-700 bg-gray-900 text-sm text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
          >
            Previous
          </button>
          <button
            onClick={() => fetchHistory(page + 1)}
            disabled={!canNext}
            className="px-3 py-1.5 rounded-md border border-gray-700 bg-gray-900 text-sm text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ValidationHistoryScreen;
