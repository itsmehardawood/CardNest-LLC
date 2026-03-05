'use client';

import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, XCircle, Copy } from 'lucide-react';

/**
 * Address Screening Screen
 * Screen crypto addresses against sanctions lists, OFAC, and risk databases.
 * Placeholder — wire to your backend when API is ready.
 */
function AddressScreeningScreen() {
  const [addresses, setAddresses] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleScreen = async () => {
    if (!addresses.trim()) return;
    setLoading(true);
    setResults([]);

    const addrList = addresses
      .split('\n')
      .map((a) => a.trim())
      .filter(Boolean);

    // TODO: Replace with actual API call
    // const response = await apiFetch('/crypto/screen-addresses', {
    //   method: 'POST',
    //   body: JSON.stringify({ addresses: addrList }),
    // });

    setTimeout(() => {
      setResults(
        addrList.map((addr) => ({
          address: addr,
          sanctioned: false,
          risk: 'N/A',
          source: 'Awaiting API connection',
        }))
      );
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6 text-white">
      <div>
        <h2 className="text-2xl font-bold">Address Screening</h2>
        <p className="text-gray-400 mt-1">
          Batch screen wallet addresses against OFAC, sanctions lists, and known-risk databases.
        </p>
      </div>

      {/* Input */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Wallet Addresses (one per line)
          </label>
          <textarea
            value={addresses}
            onChange={(e) => setAddresses(e.target.value)}
            rows={5}
            placeholder={'0x742d35Cc6634C0532925a3b844Bc9e7595f...\nbc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh\n...'}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>
        <button
          onClick={handleScreen}
          disabled={loading || !addresses.trim()}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          Screen Addresses
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="font-semibold">Screening Results ({results.length})</h3>
          </div>
          <div className="divide-y divide-gray-700">
            {results.map((r, idx) => (
              <div key={idx} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {r.sanctioned ? (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  )}
                  <span className="font-mono text-sm text-gray-300 truncate">{r.address}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-500">{r.source}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      r.sanctioned
                        ? 'bg-red-900/50 text-red-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {r.sanctioned ? 'MATCH' : r.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressScreeningScreen;
