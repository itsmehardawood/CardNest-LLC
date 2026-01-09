
import React, { useMemo, useState } from 'react';

const ScanDetailsModal = ({ merchantId, scanData, onClose }) => {
  const [expandedSessions, setExpandedSessions] = useState({});
  const [selectedScan, setSelectedScan] = useState(null);
  const [showScanDetailModal, setShowScanDetailModal] = useState(false);

  const merchantScans = useMemo(() => {
    const filtered = scanData.filter(scan => scan.merchant_id === merchantId);
    // Sort by created_at in descending order (latest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
  }, [scanData, merchantId]);

  const merchantInfo = merchantScans[0];
  
  // Group scans by session_id for better display
  const groupedBySession = useMemo(() => {
    const grouped = {};
    const ungrouped = [];

    merchantScans.forEach(scan => {
      if (scan.session_id) {
        if (!grouped[scan.session_id]) {
          grouped[scan.session_id] = [];
        }
        grouped[scan.session_id].push(scan);
      } else {
        ungrouped.push(scan);
      }
    });

    // Sort scans within each session by created_at (latest first)
    Object.keys(grouped).forEach(sessionId => {
      grouped[sessionId].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
    });

    // Sort ungrouped scans by created_at (latest first)
    ungrouped.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });

    return { grouped, ungrouped };
  }, [merchantScans]);
  
  // Group scans for better display (legacy - keep for backward compatibility)
  const groupedScans = useMemo(() => {
    const grouped = merchantScans.reduce((acc, scan) => {
      const key = `${scan.user_id}-${scan.card_number_masked}`;
      if (!acc[key]) {
        acc[key] = {
          user_id: scan.user_id,
          card_number_masked: scan.card_number_masked,
          merchant_key: scan.merchant_key,
          status: scan.status,
          scan_count: 0,
          all_scans: []
        };
      }
      acc[key].scan_count++;
      acc[key].all_scans.push(scan);
      return acc;
    }, {});
    
    return Object.values(grouped);
  }, [merchantScans]);

  const stats = useMemo(() => {
    const uniqueUsers = new Set(merchantScans.map(scan => scan.user_id)).size;
    const uniqueCards = new Set(merchantScans.map(scan => scan.card_number_masked)).size;
    const successCount = merchantScans.filter(scan => scan.status === 'success').length;
    const failedCount = merchantScans.filter(scan => scan.status === 'failed').length;
    const validScans = successCount + failedCount;
    const successRate = validScans > 0 ? ((successCount / validScans) * 100).toFixed(1) : 0;
    
    return { uniqueUsers, uniqueCards, successCount, failedCount, successRate };
  }, [merchantScans]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleSession = (sessionId) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  const handleViewScanDetails = (scan) => {
    setSelectedScan(scan);
    setShowScanDetailModal(true);
  };

  const closeScanDetailModal = () => {
    setShowScanDetailModal(false);
    setSelectedScan(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    return status === 'success' ? (
      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  const getCardIcon = () => (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  const getUserIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4" 
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"></div>
      
      {/* Modal Container */}
      <div 
        className="relative bg-black rounded-2xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-gray-800/50 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black/80 backdrop-blur-md px-6 py-5 sm:px-8 sm:py-6 flex-shrink-0 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-900/30 p-2.5 rounded-xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {merchantId}
                </h3>
                <p className="text-blue-300 text-sm sm:text-base mt-1">
                  {merchantScans.length} total scan records
                </p>
                  <span className="text-sm font-medium text-gray-400">Merchant Key:</span>
                <span className="text-xs font-mono text-gray-200 bg-black/50 px-3 py-1.5 rounded-lg border border-gray-700/50 truncate max-w-xs sm:max-w-md">
                  {merchantInfo?.merchant_key}
                </span>



              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-black/50 hover:bg-gray-700/50 rounded-xl p-2.5 text-white transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-black/50 px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-800/50 flex-shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[
              { value: stats.uniqueUsers, label: 'Unique Users', color: 'text-blue-400' },
              { value: stats.uniqueCards, label: 'Unique Cards', color: 'text-purple-400' },
              { value: stats.successCount, label: 'Successful', color: 'text-green-400' },
              { value: stats.failedCount, label: 'Failed', color: 'text-red-400' },
              { value: stats.successRate, label: 'Success Rate', color: 'text-indigo-400', unit: '%' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-black/80 rounded-xl p-4 sm:p-5 shadow-md border border-gray-800/50 hover:shadow-lg transition-shadow duration-200"
              >
                <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                  {stat.value}{stat.unit || ''}
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

      

        {/* Card Scan Records */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 bg-black flex-1 overflow-y-auto">
          <h4 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-5">Card Scan Records</h4>
          <div className="space-y-4">
            {/* Render grouped sessions */}
            {Object.entries(groupedBySession.grouped)
              .sort(([, scansA], [, scansB]) => {
                // Sort sessions by the latest scan date in each session
                const latestDateA = new Date(scansA[0].created_at);
                const latestDateB = new Date(scansB[0].created_at);
                return latestDateB - latestDateA;
              })
              .map(([sessionId, sessionScans]) => {
              const isExpanded = expandedSessions[sessionId];
              const latestScan = sessionScans[0];
              
              return (
                <div key={`session-${sessionId}`} className="border border-gray-700/50 rounded-xl overflow-hidden">
                  {/* Session Header */}
                  <div
                    onClick={() => toggleSession(sessionId)}
                    className="bg-gray-800/50 p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <svg className={`w-5 h-5 text-blue-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <div>
                          <h5 className="text-sm font-semibold text-white">Session: {sessionId}</h5>
                          <p className="text-xs text-gray-400">{sessionScans.length} scans - {formatDate(latestScan.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          sessionScans.every(s => s.status === 'success') 
                            ? 'bg-green-900/50 text-green-300' 
                            : 'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {sessionScans.filter(s => s.status === 'success').length}/{sessionScans.length} Success
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Session Scans - Collapsible */}
                  {isExpanded && (
                    <div className="bg-black/30 border-t border-gray-700/50">
                      {sessionScans.map((scan, index) => (
                        <div
                          key={`scan-${sessionId}-${index}`}
                          className="p-4 border-b border-gray-700/30 last:border-b-0 hover:bg-gray-800/30 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {/* Status Icon */}
                              <div>
                                {scan.status === 'success' ? (
                                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </div>
                              
                              {/* Card Info */}
                              <div className="flex items-center space-x-3 bg-blue-900/30 rounded-lg px-3 py-2">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <span className="text-sm font-mono text-white">{scan.card_number_masked}</span>
                              </div>

                              {/* User Info */}
                              {/* <div className="text-xs text-gray-400">
                                User: <span className="text-white font-medium">{scan.user_id}</span>
                              </div> */}

                              {/* OCR Data Preview */}
                              {scan.decrypted_data?.final_ocr && (
                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-green-400">OCR Data Available</span>
                                </div>
                              )}
                            </div>

                            {/* View Details Button */}
                            <button
                              onClick={() => handleViewScanDetails(scan)}
                              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>View Details</span>
                            </button>
                          </div>

                          {/* Show failure info if present */}
                          {scan.status === 'failure' && (scan.failure_reason || scan.failure_stage) && (
                            <div className="mt-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                              {scan.failure_reason && (
                                <p className="text-xs text-red-300 mb-1">
                                  <span className="font-medium">Reason:</span> {scan.failure_reason}
                                </p>
                              )}
                              {scan.failure_stage && (
                                <p className="text-xs text-red-300">
                                  <span className="font-medium">Stage:</span> {scan.failure_stage} side
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Render ungrouped scans (without session_id) */}
            {groupedBySession.ungrouped.map((scan, index) => (
              <div 
                key={`ungrouped-${index}`} 
                className="border border-gray-700/50 rounded-xl p-4 hover:bg-black/30 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Status Icon */}
                    <div>
                      {scan.status === 'success' ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Card Info */}
                    <div className="flex items-center space-x-3 bg-blue-900/30 rounded-lg px-3 py-2">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-sm font-mono text-white">{scan.card_number_masked}</span>
                    </div>

                    {/* User Info */}
                    {/* <div className="text-xs text-gray-400">
                      User: <span className="text-white font-medium">{scan.user_id}</span>
                    </div> */}

                    {/* Date */}
                    <div className="text-xs text-gray-400">
                      {formatDate(scan.created_at)}
                    </div>

                    {/* OCR Data Preview */}
                    {scan.decrypted_data?.final_ocr && (
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-400">OCR Data Available</span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewScanDetails(scan)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View Details</span>
                  </button>
                </div>

                {/* Show failure info if present */}
                {scan.status === 'failure' && (scan.failure_reason || scan.failure_stage) && (
                  <div className="mt-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                    {scan.failure_reason && (
                      <p className="text-xs text-red-300 mb-1">
                        <span className="font-medium">Reason:</span> {scan.failure_reason}
                      </p>
                    )}
                    {scan.failure_stage && (
                      <p className="text-xs text-red-300">
                        <span className="font-medium">Stage:</span> {scan.failure_stage} side
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Legacy grouped view - kept for backward compatibility */}
            {Object.keys(groupedBySession.grouped).length === 0 && groupedBySession.ungrouped.length === 0 && (
              <>
                {groupedScans.map((group, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-700/50 rounded-xl p-4 sm:p-5 hover:bg-black/30 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 bg-black/50 rounded-lg px-3 py-2.5">
                          {getUserIcon()}
                          <div>
                            <div className="text-xs text-gray-400">User ID</div>
                            <div className="text-sm font-semibold text-white">{group.user_id}</div>
                          </div>
                        </div>
                        
                        {/* Card Info */}
                        <div className="flex items-center space-x-3 bg-blue-900/30 rounded-lg px-3 py-2.5">
                          {getCardIcon()}
                          <div>
                            <div className="text-xs text-blue-300">Card Number</div>
                            <div className="text-sm font-mono font-semibold text-white">{group.card_number_masked}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 sm:space-x-6">
                        {/* Scan Count */}
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-white">{group.scan_count}</div>
                          <div className="text-xs text-gray-400">Scans</div>
                        </div>
                        
                        {/* Status */}
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(group.status)}
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            group.status === 'success' 
                              ? 'bg-green-900/50 text-green-300' 
                              : 'bg-red-900/50 text-red-300'
                          }`}>
                            {group.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Merchant Key for this specific scan */}
                    <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-700/50">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-400">Key:</span>
                        <span className="font-mono bg-black/50 px-3 py-1.5 rounded-lg text-gray-200 border border-gray-700/50">
                          {group.merchant_key}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/50 px-6 sm:px-8 py-4 sm:py-5 border-t border-gray-800/50 flex-shrink-0">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Individual Scan Detail Modal */}
      {showScanDetailModal && selectedScan && (
        <IndividualScanModal
          scan={selectedScan}
          isOpen={showScanDetailModal}
          onClose={closeScanDetailModal}
        />
      )}
    </div>
  );
};

// Individual Scan Detail Modal Component (similar to user admin ScanHistoryModal)
const IndividualScanModal = ({ scan, isOpen, onClose }) => {
  if (!isOpen || !scan) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    return status === "success"
      ? "text-green-300 bg-green-900 border-green-700"
      : "text-red-300 bg-red-900 border-red-700";
  };

  const getStatusIcon = (status) => {
    return status === "success" ? (
      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  };

  const maskMerchantKey = (key) => {
    if (!key || key.length <= 6) return key;
    const start = key.substring(0, 3);
    const end = key.substring(key.length - 3);
    return `${start}${"*".repeat(Math.min(8, key.length - 6))}${end}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-[60] p-2 sm:p-4">
      <div className="bg-black rounded-lg sm:rounded-xl shadow-2xl border border-gray-800 w-full max-w-sm sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-900 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Scan Details
              </h2>
              {/* <p className="text-xs sm:text-sm text-gray-300">
                Scan ID: #{scan.id || 'N/A'}
              </p> */}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Status Section */}
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {getStatusIcon(scan.status)}
                <div>
                  <h3 className="font-medium text-white text-sm sm:text-base">
                    Scan Status
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Current processing status
                  </p>
                </div>
              </div>
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border self-start sm:self-auto ${getStatusColor(
                  scan.status
                )}`}
              >
                {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
              </span>
            </div>

            {scan.status === 'failure' && (scan.failure_reason || scan.failure_stage) && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                {scan.failure_reason && (
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-gray-300">
                        Failure Reason
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <p className="text-xs sm:text-sm text-red-300 break-words mr-2 w-[90%]">
                        {scan.failure_reason}
                      </p>
                    </div>
                  </div>
                )}
                
                {scan.failure_stage && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-gray-300">
                        Failure Location
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-red-300">
                        ({scan.failure_stage}) side
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Information */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-white border-b border-gray-700 pb-2">
              Card Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-gray-300">
                    Card Number
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-lg text-white break-all">
                    {scan.card_number_masked || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* OCR Extracted Information */}
          {scan.decrypted_data?.final_ocr ? (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-white border-b border-gray-700 pb-2">
                OCR Extracted Information
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {/* Cardholder Name */}
                {scan.decrypted_data.final_ocr.cardholder_name?.value && (
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-gray-300">
                        Cardholder Name
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-lg text-white">
                        {scan.decrypted_data.final_ocr.cardholder_name.value}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Confidence: {(scan.decrypted_data.final_ocr.cardholder_name.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                )}

                {/* Expiry Date */}
                {scan.decrypted_data.final_ocr.expiry_date?.value && (
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-gray-300">
                        Expiry Date
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-lg text-white">
                        {scan.decrypted_data.final_ocr.expiry_date.value}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Confidence: {(scan.decrypted_data.final_ocr.expiry_date.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                )}

                {/* Bank Name */}
                {scan.decrypted_data.final_ocr.bank_name?.value && (
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-gray-300">
                        Bank Name
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-lg text-white">
                        {scan.decrypted_data.final_ocr.bank_name.value}
                      </span>
                    </div>
                    {scan.decrypted_data.final_ocr.bank_name.confidence && (
                      <p className="text-xs text-gray-400 mt-1">
                        Confidence: {(scan.decrypted_data.final_ocr.bank_name.confidence * 100).toFixed(0)}%
                      </p>
                    )}
                  </div>
                )}

                {/* Card Type */}
                {scan.decrypted_data.final_ocr.bin_details && 
                 (scan.decrypted_data.final_ocr.bin_details.card || scan.decrypted_data.final_ocr.bin_details.type) && (
                  <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-gray-300">
                        Card Type
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-lg text-white">
                        {scan.decrypted_data.final_ocr.bin_details.card && 
                         scan.decrypted_data.final_ocr.bin_details.type
                          ? `${scan.decrypted_data.final_ocr.bin_details.card} ${scan.decrypted_data.final_ocr.bin_details.type}`
                          : scan.decrypted_data.final_ocr.bin_details.card || scan.decrypted_data.final_ocr.bin_details.type
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : scan.encrypted_data ? (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-white border-b border-gray-700 pb-2">
                OCR Extracted Information
              </h3>
              <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm font-medium text-yellow-300">
                    Decryption Failed
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  The encrypted data could not be decrypted. This may be due to corrupted data, or an incomplete encrypted data.
                </p>
                <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-600">
                  <p className="text-xs text-gray-400 mb-1">
                    <span className="font-medium">Encrypted Data Length:</span> {scan.encrypted_data.length} characters
                  </p>
                  <p className="text-xs text-gray-400">
                    <span className="font-medium">Merchant Key:</span> {scan.merchant_key || 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Merchant Information */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-white border-b border-gray-700 pb-2">
              Merchant Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-gray-300">
                    Merchant ID
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-base text-white break-all">
                    {scan.merchant_id}
                  </span>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-gray-300">
                    Merchant Key
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs sm:text-sm text-white break-all mr-2">
                    {maskMerchantKey(scan.merchant_key)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Used for data decryption
                </p>
              </div>

              {scan.business_name && (
                <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-gray-300">
                      Business Name
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-white">
                      {scan.business_name}
                    </span>
                  </div>
                </div>
              )}

              {/* <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-gray-300">
                    User ID
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base text-white">
                    {scan.user_id}
                  </span>
                </div>
              </div> */}

              {scan.session_id && (
                <div className="bg-gray-900 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-gray-300">
                      Session ID
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-mono text-white break-all">
                      {scan.session_id}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-white border-b border-gray-700 pb-2">
              Timeline
            </h3>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 space-y-1 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-gray-300">
                      Created
                    </span>
                    <p className="text-xs text-gray-400">
                      When the scan was initiated
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-white ml-5 sm:ml-0">
                  {formatDate(scan.created_at)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 space-y-1 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-gray-300">
                      Last Updated
                    </span>
                    <p className="text-xs text-gray-400">
                      Most recent status change
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-white ml-5 sm:ml-0">
                  {formatDate(scan.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-700 bg-gray-900">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-300 bg-black border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base order-2 sm:order-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanDetailsModal;