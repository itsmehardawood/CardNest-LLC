'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { History, Search, Copy, CheckCircle, XCircle } from 'lucide-react';
import { cryptoApiFetch } from '@/app/lib/api.js';

function CryptoValidationHistory() {
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const mapRecord = (item) => {
    const result = item?.validation_result || {};
    const resultData = result?.data || {};
    const summary = resultData?.summary || {};
    const sanction = resultData?.sanction_check || {};

    return {
      id: item?.id,
      merchantId: item?.merchant_id || 'UNKNOWN',
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

    const min = (targetPage - 1) * pageSize + 1;
    const max = targetPage * pageSize;

    try {
      const response = await cryptoApiFetch(
        `/superadmin/crypto/history?min=${min}&max=${max}`,
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

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return history.filter((item) => {
      const matchesSearch =
        q === '' ||
        item.merchantId.toLowerCase().includes(q) ||
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
    <div className="space-y-6 text-white w-full">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Validation History</h2>
        <p className="text-gray-400">
          View all past crypto address validations across all merchants.
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
            placeholder="Search by merchant ID, address, chain, or network..."
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
      <div className="bg-black border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-16 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Loading history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No validation history found.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#111111]">
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="text-left px-6 py-4 font-medium">Timestamp</th>
                  <th className="text-left px-6 py-4 font-medium">Account ID</th>
                  <th className="text-left px-6 py-4 font-medium">Recipient Crypto Address</th>
                  <th className="text-left px-6 py-4 font-medium">Chain</th>
                  <th className="text-left px-6 py-4 font-medium">Network</th>
                  <th className="text-left px-6 py-4 font-medium">Sanction Status</th>
                  <th className="text-left px-6 py-4 font-medium">Validation</th>
                  <th className="text-left px-6 py-4 font-medium">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-black">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">{formatTimestamp(item.timestamp)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-300 truncate">{item.merchantId}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(item.merchantId)}
                          className="text-gray-500 hover:text-white"
                          title="Copy Merchant ID"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-300 truncate max-w-[200px]" title={item.address}>{item.address}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(item.address)}
                          className="text-gray-500 hover:text-white"
                          title="Copy Address"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 uppercase">{item.chain}</td>
                    <td className="px-6 py-4 text-gray-400">{item.network}</td>
                    <td className="px-6 py-4 text-gray-400 uppercase">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        item.sanctionStatus.toUpperCase() === 'CLEAN' 
                          ? 'text-green-400 bg-green-400/10'
                          : 'text-red-400 bg-red-400/10'
                      }`}>
                        {item.sanctionStatus.toUpperCase() === 'CLEAN' ? 'CLEARED' : item.sanctionStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                          item.validationPassed
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {item.validationPassed ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {item.validationPassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        item.riskLevel === 'HIGH' ? 'text-red-400 bg-red-400/10' :
                        item.riskLevel === 'MEDIUM' ? 'text-yellow-400 bg-yellow-400/10' :
                        'text-green-400 bg-green-400/10'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-gray-400 text-sm">Page {page} • Showing up to {pageSize} records</p>
        <div className="flex gap-2">
          <button
            onClick={() => fetchHistory(page - 1)}
            disabled={!canPrev}
            className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => fetchHistory(page + 1)}
            disabled={!canNext}
            className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CryptoValidationHistory;
