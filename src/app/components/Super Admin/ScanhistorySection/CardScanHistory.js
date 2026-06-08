import { apiFetch } from "@/app/lib/api.js";
import React, { useState, useEffect, useMemo } from "react";
import ScanDetailsModal from "./ScanModal";
import SuperAdminDeviceInfo from "./SuperAdminDeviceInfo";
import { decryptWithAES128 } from "@/app/lib/decrypt";
import { Building, ChevronDown, ChevronRight } from 'lucide-react';

// ─── Merchant List Component ───────────────────────────────────────────────────
// Now receives pre-aggregated merchant data directly from the API
const MerchantList = ({ merchants, onMerchantClick, searchQuery, loadingMerchantId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return merchants;
    return merchants.filter(
      (m) =>
        m.merchant_id?.toLowerCase().includes(q) ||
        m.business_name?.toLowerCase().includes(q)
    );
  }, [merchants, searchQuery]);

  const getStatusBadge = (successRate) => {
    const rate = parseFloat(successRate);
    if (rate >= 95) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-900/50 text-green-300 rounded-full backdrop-blur-sm">
          Excellent
        </span>
      );
    } else if (rate >= 80) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-yellow-900/50 text-yellow-300 rounded-full backdrop-blur-sm">
          Good
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-red-900/50 text-red-300 rounded-full backdrop-blur-sm">
          Needs Attention
        </span>
      );
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-gray-700/50">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div>
          <div className="flex space-x-3">
            <Building></Building>
            <h2 className="text-2xl font-semibold text-gray-100 text-left">
              Merchant Performance
            </h2>
          </div>
          <p className="text-sm text-gray-400 mt-1 text-left">
            Overview of scan activities across all merchants
          </p>
        </div>
        {isOpen ? (
          <ChevronDown className="w-6 h-6 text-gray-400" />
        ) : (
          <ChevronRight className="w-6 h-6 text-gray-400" />
        )}
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-8 pb-8">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-black/30 rounded-lg backdrop-blur-sm">
              <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-300">
                {searchQuery ? "No results found for search" : "No merchant data available"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {searchQuery ? "Try adjusting your search terms" : "Merchant data will appear here once available"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filtered.map((merchant) => {
                const isLoadingThis = loadingMerchantId === merchant.merchant_id;
                return (
                  <div
                    key={merchant.merchant_id}
                    onClick={() => !isLoadingThis && onMerchantClick(merchant.merchant_id)}
                    className={`bg-black/30 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group ${isLoadingThis ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m4 0h4m0 0h2M9 7h6m-6 4h6m-6 4h6" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-100 group-hover:text-blue-300 transition-colors">
                              {merchant.business_name || `Merchant (${merchant.merchant_id})`}
                            </h3>
                            <p className="text-sm text-gray-400 font-mono">
                              ID: {merchant.merchant_id}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {isLoadingThis ? (
                          <div className="flex items-center justify-end space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-400"></div>
                            <span className="text-sm text-blue-400">Loading…</span>
                          </div>
                        ) : (
                          <>
                            <div className="text-3xl font-bold text-blue-400">
                              {merchant.total_scans}
                            </div>
                            <div className="text-sm text-gray-400 uppercase tracking-wide font-medium">
                              Total Scans
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-700/50 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(merchant.success_rate)}
                        <div className="text-sm text-gray-400">
                          Success Rate:{" "}
                          <span className="font-medium text-green-400">
                            {merchant.success_rate}
                          </span>
                        </div>
                        <div className="w-32 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${parseFloat(merchant.success_rate)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Stats Overview Component ──────────────────────────────────────────────────
// Derived from the pre-aggregated merchant list
const StatsOverview = ({ merchants }) => {
  const stats = useMemo(() => {
    const totalMerchants = merchants.length;
    const totalScans = merchants.reduce((sum, m) => sum + (m.total_scans || 0), 0);

    // Average success rate across merchants with data
    const merchantsWithRate = merchants.filter((m) => m.success_rate != null);
    const avgSuccessRate =
      merchantsWithRate.length > 0
        ? (
            merchantsWithRate.reduce(
              (sum, m) => sum + parseFloat(m.success_rate),
              0
            ) / merchantsWithRate.length
          ).toFixed(1)
        : 0;

    return { totalMerchants, totalScans, avgSuccessRate };
  }, [merchants]);

  const cards = [
    {
      label: 'Total Merchants',
      value: stats.totalMerchants,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m4 0h4" />
      ),
    },
    {
      label: 'Total Scans',
      value: stats.totalScans,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/30',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      ),
    },
    {
      label: 'Avg. Success Rate',
      value: `${stats.avgSuccessRate}%`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/30',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {cards.map((card, i) => (
        <div key={i} className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className={`p-3 ${card.bgColor} rounded-lg mr-4`}>
              <svg className={`w-8 h-8 ${card.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {card.icon}
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const CardScanHistory = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Per-merchant scans state (fetched on click)
  const [selectedMerchantId, setSelectedMerchantId] = useState(null);
  const [merchantScans, setMerchantScans] = useState([]);
  const [loadingMerchantId, setLoadingMerchantId] = useState(null);
  const [merchantError, setMerchantError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // ── Step 1: Fetch merchant summary list ──────────────────────────────────────
  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch("/superadmin/access-all-scans");
      const result = await response.json();

      if (result.status && result.data?.merchants) {
        setMerchants(result.data.merchants);
      } else {
        setError(result.message || "Failed to fetch merchant data");
      }
    } catch (err) {
      setError("Error fetching merchants: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Fetch per-merchant scans on click ─────────────────────────────────
  const handleMerchantClick = async (merchantId) => {
    setLoadingMerchantId(merchantId);
    setMerchantError(null);

    try {
      const response = await apiFetch(`/superadmin/access-all-scans/${merchantId}`);
      const result = await response.json();

      if (result.status && result.data?.scans) {
        // Decrypt encrypted_data using encryption_key per scan (same as before)
        const processedScans = result.data.scans.map((scan) => {
          let decryptedData = null;
          const key = scan.encryption_key || scan.merchant_key;
          if (scan.encrypted_data && key) {
            try {
              decryptedData = decryptWithAES128(scan.encrypted_data, key);
            } catch {
              // decryption failure is non-fatal
            }
          }
          return { ...scan, decrypted_data: decryptedData };
        });

        setMerchantScans(processedScans);
        setSelectedMerchantId(merchantId);
        setIsModalOpen(true);
      } else {
        setMerchantError(result.message || "Failed to fetch scans for merchant");
      }
    } catch (err) {
      setMerchantError("Error loading merchant scans: " + err.message);
    } finally {
      setLoadingMerchantId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMerchantId(null);
    setMerchantScans([]);
  };

  // ── Loading / Error states ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h3 className="text-2xl font-medium text-gray-100">Loading Scan Data</h3>
          <p className="text-gray-400 mt-2">Please wait while we fetch the latest information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <div className="bg-red-900/20 backdrop-blur-md border border-red-700/50 rounded-2xl p-8 max-w-md w-full">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-900/30 rounded-lg mr-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-100">Error Loading Data</h3>
          </div>
          <div className="text-red-300 text-sm">{error}</div>
          <button
            onClick={fetchMerchants}
            className="mt-6 bg-red-700/80 hover:bg-red-600 text-gray-100 px-6 py-3 rounded-lg transition-all duration-300 w-full flex items-center justify-center backdrop-blur-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-100">Card Scan History</h1>
          <p className="text-gray-400 mt-2 text-sm">View and manage card scan records by merchant</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Business Name or Merchant ID..."
              className="w-full bg-black/30 border border-gray-700/50 rounded-lg py-3 px-4 pl-10 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Stats */}
        <StatsOverview merchants={merchants} />

        {/* Per-merchant API error banner */}
        {merchantError && (
          <div className="mb-4 bg-red-900/20 border border-red-700/50 rounded-xl p-4 text-red-300 text-sm flex items-center space-x-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{merchantError}</span>
          </div>
        )}

        {/* Merchant List */}
        <MerchantList
          merchants={merchants}
          onMerchantClick={handleMerchantClick}
          searchQuery={searchQuery}
          loadingMerchantId={loadingMerchantId}
        />

        <SuperAdminDeviceInfo />

        {/* Scan Details Modal — receives the fetched per-merchant scans */}
        {isModalOpen && (
          <ScanDetailsModal
            merchantId={selectedMerchantId}
            scanData={merchantScans}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default CardScanHistory;