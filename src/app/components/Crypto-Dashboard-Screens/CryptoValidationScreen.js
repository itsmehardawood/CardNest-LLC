'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Copy, Search } from 'lucide-react';

/**
 * Crypto Validation Screen
 * Allows users to validate crypto wallet addresses / transactions.
 * Placeholder UI — wire up to your crypto-validation API when ready.
 */
function CryptoValidationScreen() {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const supportedChains = [
    { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'bitcoin', label: 'Bitcoin (BTC)' },
    { value: 'polygon', label: 'Polygon (MATIC)' },
    { value: 'solana', label: 'Solana (SOL)' },
    { value: 'tron', label: 'Tron (TRX)' },
    { value: 'bsc', label: 'BNB Smart Chain' },
  ];

  const handleValidate = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setResult(null);

    // TODO: Replace with actual API call to your crypto-validation backend
    // Example:
    // const response = await apiFetch('/crypto/validate-address', {
    //   method: 'POST',
    //   body: JSON.stringify({ address, chain }),
    // });
    // const data = await response.json();

    // Simulated result for UI demo
    setTimeout(() => {
      setResult({
        address,
        chain,
        risk_score: 'N/A',
        risk_level: 'pending',
        sanctions_match: false,
        labels: [],
        message: 'Connect your crypto-validation API to see real results.',
      });
      setLoading(false);
    }, 1200);
  };

  const getRiskBadge = (level) => {
    const badges = {
      low: { bg: 'bg-green-900/50', text: 'text-green-400', icon: <CheckCircle className="w-4 h-4" /> },
      medium: { bg: 'bg-yellow-900/50', text: 'text-yellow-400', icon: <AlertTriangle className="w-4 h-4" /> },
      high: { bg: 'bg-red-900/50', text: 'text-red-400', icon: <XCircle className="w-4 h-4" /> },
      pending: { bg: 'bg-gray-800', text: 'text-gray-400', icon: <ShieldCheck className="w-4 h-4" /> },
    };
    return badges[level] || badges.pending;
  };

  return (
    <div className="p-6 space-y-6 text-white">
      <div>
        <h2 className="text-2xl font-bold">Crypto Address Validation</h2>
        <p className="text-gray-400 mt-1">
          Enter a wallet address to check its risk profile, sanctions status, and labels.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Blockchain</label>
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
          >
            {supportedChains.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Wallet Address</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter wallet address (e.g. 0x...)"
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleValidate}
              disabled={loading || !address.trim()}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Validate
            </button>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            Validation Result
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-mono text-gray-300 truncate">{result.address}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.address)}
                    className="text-gray-500 hover:text-white transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Chain</p>
                <p className="text-sm text-gray-300 mt-1 capitalize">{result.chain}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Risk Score</p>
                <p className="text-sm text-gray-300 mt-1">{result.risk_score}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Risk Level</p>
                <div className="mt-1">
                  {(() => {
                    const badge = getRiskBadge(result.risk_level);
                    return (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                        {badge.icon}
                        {result.risk_level === 'pending' ? 'Awaiting API' : result.risk_level.toUpperCase()}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Sanctions Match</p>
                <p className="text-sm text-gray-300 mt-1">{result.sanctions_match ? 'Yes ⚠️' : 'No ✓'}</p>
              </div>
            </div>
          </div>

          {result.message && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg text-sm text-gray-400 border border-gray-700">
              ℹ️ {result.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CryptoValidationScreen;
