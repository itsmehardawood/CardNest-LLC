import { apiFetch } from "@/app/lib/api.js";
import React, { useState, useEffect, useMemo } from "react";
import ScanDetailsModal from "./ScanModal";

// Merchant List Component
const MerchantList = ({ scanData, onMerchantClick, searchQuery }) => {
  const merchantStats = useMemo(() => {
    const grouped = scanData.reduce((acc, scan) => {
      const merchantId = scan.merchant_id;

      if (!acc[merchantId]) {
        acc[merchantId] = {
          merchant_id: merchantId,
          business_name: scan.business_name,
          merchant_key: scan.merchant_key,
          total_scans: 0,
          unique_users: new Set(),
          unique_cards: new Set(),
          success_count: 0,
          failed_count: 0,
          latest_scan: null,
        };
      }

      acc[merchantId].total_scans++;
      acc[merchantId].unique_users.add(scan.user_id);
      acc[merchantId].unique_cards.add(scan.card_number_masked);

      if (scan.status === "success") {
        acc[merchantId].success_count++;
      } else {
        acc[merchantId].failed_count++;
      }

      acc[merchantId].latest_scan = scan;

      return acc;
    }, {});

    return (
      Object.values(grouped)
        .map((merchant) => ({
          ...merchant,
          unique_users: merchant.unique_users.size,
          unique_cards: merchant.unique_cards.size,
          success_rate: (
            (merchant.success_count / merchant.total_scans) *
            100
          ).toFixed(1),
        }))
        // Fixed implementation with proper null checking
        .filter((merchant) => {
          const query = searchQuery.toLowerCase();
          return (
            merchant.merchant_id?.toLowerCase().includes(query) ||
            merchant.merchant_key?.toLowerCase().includes(query) ||
            merchant.business_name?.toLowerCase().includes(query)
          );
        })
    );
  }, [scanData, searchQuery]);

  const getStatusBadge = (successRate) => {
    if (successRate >= 95) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-900/50 text-green-300 rounded-full backdrop-blur-sm">
          Excellent
        </span>
      );
    } else if (successRate >= 80) {
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
    <div className="bg-black/50 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-gray-700/50 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-100">
          Merchant Performance
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Overview of scan activities across all merchants
        </p>
      </div>
      <div>
        {merchantStats.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-black/30 rounded-lg backdrop-blur-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-300">
              {searchQuery
                ? "No results found for search"
                : "No scan data available"}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Scan data will appear here once available"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {merchantStats.map((merchant) => (
              <div
                key={merchant.merchant_id}
                onClick={() => onMerchantClick(merchant.merchant_id)}
                className="bg-black/30 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl cursor-pointer transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-900/30 rounded-lg">
                        <svg
                          className="w-6 h-6 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m4 0h4m0 0h2M9 7h6m-6 4h6m-6 4h6"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-100 group-hover:text-blue-300 transition-colors">
                          {merchant.business_name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-400 font-mono">
                            Key: {merchant.merchant_key.substring(0, 20)}...
                          </p>
                          <button className="text-gray-400 hover:text-blue-300 transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-400">
                      {merchant.total_scans}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide font-medium">
                      Total Scans
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700/50 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(merchant.success_rate)}
                    <div className="text-sm text-gray-400">
                      Success Rate:{" "}
                      <span className="font-medium text-green-400">
                        {merchant.success_rate}%
                      </span>
                    </div>
                    <div className="w-32 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${merchant.success_rate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-gray-100">
                        {merchant.unique_users}
                      </div>
                      <div className="text-xs text-gray-400">Users</div>
                    </div>
                    <div className="w-px h-6 bg-gray-700/50"></div>
                    <div className="text-center">
                      <div className="font-medium text-gray-100">
                        {merchant.unique_cards}
                      </div>
                      <div className="text-xs text-gray-400">Cards</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Overview Component
const StatsOverview = ({ scanData }) => {
  const stats = useMemo(() => {
    const totalScans = scanData.length;
    const uniqueUsers = new Set(scanData.map((scan) => scan.user_id)).size;
    const uniqueCards = new Set(scanData.map((scan) => scan.card_number_masked))
      .size;
    const successCount = scanData.filter(
      (scan) => scan.status === "success"
    ).length;
    const successRate =
      totalScans > 0 ? ((successCount / totalScans) * 100).toFixed(1) : 0;

    return { totalScans, uniqueUsers, uniqueCards, successRate };
  }, [scanData]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-blue-900/30 rounded-lg mr-4">
            <svg
              className="w-8 h-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Scans</p>
            <p className="text-3xl font-bold text-gray-100">
              {stats.totalScans}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-purple-900/30 rounded-lg mr-4">
            <svg
              className="w-8 h-8 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-400">Unique Users</p>
            <p className="text-3xl font-bold text-gray-100">
              {stats.uniqueUsers}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-green-900/30 rounded-lg mr-4">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-400">Unique Cards</p>
            <p className="text-3xl font-bold text-gray-100">
              {stats.uniqueCards}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-yellow-900/30 rounded-lg mr-4">
            <svg
              className="w-8 h-8 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-400">Success Rate</p>
            <p className="text-3xl font-bold text-gray-100">
              {stats.successRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CardScanHistory = () => {
  const [scanData, setScanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchScanData();
  }, []);

  const fetchScanData = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/superadmin/access-all-scans");
      const result = await response.json();

      if (result.status) {
        setScanData(result.data);
        console.log("Fetched scan data:", result.data);
      } else {
        setError("Failed to fetch scan data");
      }
    } catch (err) {
      setError("Error fetching scan data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMerchantClick = (merchantId) => {
    setSelectedMerchant(merchantId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMerchant(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h3 className="text-2xl font-medium text-gray-100">
            Loading Scan Data
          </h3>
          <p className="text-gray-400 mt-2">
            Please wait while we fetch the latest information
          </p>
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
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-100">
              Error Loading Data
            </h3>
          </div>
          <div className="text-red-300 text-sm">{error}</div>
          <button
            onClick={fetchScanData}
            className="mt-6 bg-red-700/80 hover:bg-red-600 text-gray-100 px-6 py-3 rounded-lg transition-all duration-300 w-full flex items-center justify-center backdrop-blur-sm"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
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
          <h1 className="text-4xl font-bold text-gray-100">
            Card Scan History
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            View and manage card scan records by merchant
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by Business Name, Merchant ID or Key..."
              className="w-full bg-black/30 border border-gray-700/50 rounded-lg py-3 px-4 pl-10 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <StatsOverview scanData={scanData} />

        <MerchantList
          scanData={scanData}
          onMerchantClick={handleMerchantClick}
          searchQuery={searchQuery}
        />

        {isModalOpen && (
          <ScanDetailsModal
            merchantId={selectedMerchant}
            scanData={scanData}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default CardScanHistory;