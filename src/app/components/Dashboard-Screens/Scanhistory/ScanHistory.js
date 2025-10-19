'use client';

import { useState, useEffect } from 'react';
import { Eye, Calendar, CreditCard, CheckCircle, AlertCircle, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import ScanHistoryModal from './ScanHistoryModal';
import { decryptWithAES128 } from '@/app/lib/decrypt';
import { apiFetch } from '@/app/lib/api.js';

const ScanHistorySection = () => {
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aesKey, setAesKey] = useState(null); // Add state for AES key
  const [expandedSessions, setExpandedSessions] = useState({}); // Track expanded sessions

  useEffect(() => {
    fetchAesKeyAndScanHistory();
  }, []);

// Function to fetch AES key from business verification API
const fetchAesKey = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userObj = userData.user || userData;

    if (!userObj.id) {
      console.warn('⚠️ User ID not found for AES key fetch');
      return null;
    }

    const response = await apiFetch(
      `/business-profile/business-verification-status?user_id=${userObj.id}`,
      {
        headers: {
          Authorization: `Bearer ${userObj.token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const fetchedAesKey = data?.data?.aes_key;
      
      // console.log('🔑 Fetched AES key:', fetchedAesKey ? 'Available' : 'Not available');
      return fetchedAesKey;
    } else {
      console.error('❌ Failed to fetch AES key:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching AES key:', error);
    return null;
  }
};

// Combined function to fetch AES key and then scan history
const fetchAesKeyAndScanHistory = async () => {
  try {
    // First fetch the AES key
    const fetchedAesKey = await fetchAesKey();
    setAesKey(fetchedAesKey);
    
    // console.log('🔑 AES Key status:', fetchedAesKey ? `Available (${fetchedAesKey.substring(0, 4)}...)` : 'Not available');
    
    // Then fetch scan history with the AES key
    await fetchScanHistory(fetchedAesKey);
  } catch (error) {
    console.error('❌ Error in fetchAesKeyAndScanHistory:', error);
    setError(error.message);
    setLoading(false);
  }
};

// Refresh function that uses existing AES key if available
const refreshScanHistory = async () => {
  if (aesKey) {
    // console.log('🔄 Refreshing with existing AES key');
    await fetchScanHistory(aesKey);
  } else {
    // console.log('🔄 Refreshing and fetching new AES key');
    await fetchAesKeyAndScanHistory();
  }
};

const fetchScanHistory = async (encryptionKey = null) => {
  try {
    setLoading(true);
    setError(null);

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const merchantId = userData.user?.merchant_id;

    if (!merchantId) {
      throw new Error('Merchant ID not found');
    }

    const url = `/api/card-scans?id=${merchantId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    // console.log('📊 Full API response:', data);

    if (data.status && data.data) {
      // ✅ Extract the scans array from the API response
      // The API returns data directly in data.data as an array, not wrapped in card_scans
      const cardScans = Array.isArray(data.data)
        ? data.data
        : [];

      // console.log('🔍 Extracted card scans:', cardScans);

      // ✅ Process each scan to decrypt the encrypted_data
      const processedScans = cardScans.map(scan => {
        // console.log('🔍 Processing scan:', scan.id, 'Has encrypted_data:', !!scan.encrypted_data, 'Has encryption_key:', !!scan.encryption_key);
        
        // Use the encryption key from API response, or fall back to the fetched AES key
        const keyToUse = scan.encryption_key || encryptionKey || aesKey;
        
        if (scan.encrypted_data && keyToUse) {
          // console.log('🔑 Using encryption key for scan:', scan.id, 'Source:', scan.encryption_key ? 'API' : 'AES Key');
          
          try {
            // Check if encrypted data is long enough (should be at least 24 characters for IV + some data)
            if (scan.encrypted_data.length < 24) {
              console.warn('⚠️ Encrypted data too short for scan ID:', scan.id, 'Length:', scan.encrypted_data.length);
              return {
                ...scan,
                decrypted_data: null
              };
            }
            
            const decryptedData = decryptWithAES128(scan.encrypted_data, keyToUse);
            // console.log('🔓 Decrypted data for scan ID:', scan.id, decryptedData);
            // console.log('🔍 Type of decrypted data:', typeof decryptedData);
            // console.log('🔍 Decrypted data structure:', JSON.stringify(decryptedData, null, 2));
            
            // Add decrypted data to the scan object
            return {
              ...scan,
              decrypted_data: decryptedData
            };
          } catch (decryptError) {
            console.error('❌ Decryption failed for scan ID:', scan.id, decryptError);
            console.error('❌ Encrypted data:', scan.encrypted_data);
            console.error('❌ Encryption key used:', keyToUse);
            return {
              ...scan,
              decrypted_data: null // Explicitly set to null when decryption fails
            };
          }
        } else {
          if (scan.encrypted_data && !keyToUse) {
            console.warn('⚠️ Encrypted data found but no encryption key available for scan:', scan.id);
          }
          return {
            ...scan,
            decrypted_data: null // Set to null when no encrypted data or key
          };
        }
      });

      setScanHistory(processedScans);
    } else {
      throw new Error(data.message || 'Failed to retrieve scan history');
    }

  } catch (err) {
    console.error('Error fetching scan history:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};




  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <AlertCircle className="w-4 h-4 text-gray-400" />;
    return status === 'success' ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-400" />
    );
  };

  const getStatusBadge = (status) => {
    if (!status) return "px-2 py-1 text-xs font-medium rounded-full bg-gray-900 text-gray-300";
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    return status === 'success' 
      ? `${baseClasses} bg-green-900 text-green-300`
      : `${baseClasses} bg-red-900 text-red-300`;
  };

  // Helper function to truncate long card number messages for list display
  const getTruncatedCardNumber = (cardNumber) => {
    if (!cardNumber) return 'N/A';
    
    // If it's a regular masked card number (like XXXX-XXXX-XXXX-X376), show as is
    if (cardNumber.match(/^[X\d\-\*]+$/)) {
      return cardNumber;
    }
    
    // If it's a long message, truncate to first 3-4 words
    const words = cardNumber.split(' ');
    if (words.length > 4) {
      return words.slice(0, 4).join(' ') + '...';
    }
    
    return cardNumber;
  };

  const handleViewDetails = (scan) => {
    setSelectedScan(scan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScan(null);
  };

  // Group scans by session_id
  const groupScansBySession = (scans) => {
    const grouped = {};
    const ungrouped = [];

    scans.forEach(scan => {
      if (scan.session_id) {
        if (!grouped[scan.session_id]) {
          grouped[scan.session_id] = [];
        }
        grouped[scan.session_id].push(scan);
      } else {
        ungrouped.push(scan);
      }
    });

    return { grouped, ungrouped };
  };

  // Toggle session expansion
  const toggleSession = (sessionId) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  // Get session summary info
  const getSessionSummary = (scans) => {
    const successCount = scans.filter(s => s.status === 'success').length;
    const failureCount = scans.filter(s => s.status === 'failure').length;
    const latestScan = scans.reduce((latest, current) => {
      return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
    }, scans[0]);
    
    return {
      totalScans: scans.length,
      successCount,
      failureCount,
      latestDate: latestScan.created_at
    };
  };

  if (loading) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-700 rounded w-36 sm:w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 sm:h-16 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-4 sm:p-6">
        <div className="text-center py-6 sm:py-8">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-white mb-2">No History Found</h3>
          <p className="text-sm sm:text-base text-gray-300 mb-4 px-4">Something went wrong while fetching scan history.</p>
          <button
            onClick={fetchAesKeyAndScanHistory}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg shadow-sm border border-gray-800">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Card Scan History</h2>
            {/* <p className="text-gray-300 text-sm mt-1">
              Total scans: {scanHistory.length}
            </p> */}
          </div>
          <button
            onClick={refreshScanHistory}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium self-start sm:self-auto"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
     {scanHistory.length === 0 ? (
  <div className="text-center py-6 sm:py-8">
    <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-base sm:text-lg font-medium text-white mb-2">No Scan History Found</h3>
    <p className="text-sm sm:text-base text-gray-300">No scan history found against this merchant.</p>
  </div>
) : (
          <div className="space-y-3">
            {(() => {
              const { grouped, ungrouped } = groupScansBySession(scanHistory);
              
              return (
                <>
                  {/* Render grouped sessions */}
                  {Object.entries(grouped).map(([sessionId, sessionScans]) => {
                    const summary = getSessionSummary(sessionScans);
                    const isExpanded = expandedSessions[sessionId];
                    
                    return (
                      <div key={`session-${sessionId}`} className="border border-gray-700 rounded-lg overflow-hidden">
                        {/* Session Header */}
                        <div
                          onClick={() => toggleSession(sessionId)}
                          className="bg-gray-800 p-3 sm:p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-blue-400 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                              <Layers className="w-5 h-5 text-blue-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                                  <h3 className="text-sm sm:text-base font-medium text-white truncate">
                                    Session: {sessionId}
                                  </h3>
                                 
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  Latest: {formatDate(summary.latestDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Session Scans - Collapsible */}
                        {isExpanded && (
                          <div className="bg-black border-t border-gray-700">
                            {sessionScans.slice(0, 5).map((scan, index) => {
                              if (!scan) return null;
                              
                              const uniqueKey = `scan-${sessionId}-${index}-${scan.id || 'no-id'}`;
                              
                              return (
                                <div
                                  key={uniqueKey}
                                  className="p-3 sm:p-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-900 transition-colors"
                                >
                                  {/* Mobile Layout (stacked) */}
                                  <div className="block sm:hidden space-y-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        {getStatusIcon(scan.status)}
                                        <span className={getStatusBadge(scan.status)}>
                                          {scan.status || 'Unknown'}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => handleViewDetails(scan)}
                                        className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
                                      >
                                        <Eye className="w-4 h-4" />
                                        <span className="hidden xs:inline">Details</span>
                                      </button>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 text-gray-300">
                                      <CreditCard className="w-4 h-4 flex-shrink-0" />
                                      <span className="font-mono text-sm break-all">
                                        {getTruncatedCardNumber(scan.card_number_masked)}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 text-gray-400">
                                      <Calendar className="w-4 h-4 flex-shrink-0" />
                                      <span className="text-sm">
                                        {formatDate(scan.created_at)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Desktop Layout (horizontal) */}
                                  <div className="hidden sm:flex items-center justify-between">
                                    <div className="flex items-center space-x-2 md:space-x-4 flex-wrap gap-y-2">
                                      <div className="flex items-center space-x-2">
                                        {getStatusIcon(scan.status)}
                                        <span className={getStatusBadge(scan.status)}>
                                          {scan.status || 'Unknown'}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2 text-gray-300">
                                        <CreditCard className="w-4 h-4 flex-shrink-0" />
                                        <span className="font-mono text-sm">
                                          {getTruncatedCardNumber(scan.card_number_masked)}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2 text-gray-400">
                                        <Calendar className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm">
                                          {formatDate(scan.created_at)}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <button
                                      onClick={() => handleViewDetails(scan)}
                                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium ml-4"
                                    >
                                      <Eye className="w-4 h-4" />
                                      <span>View Details</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Render ungrouped scans (those without session_id) */}
                  {ungrouped.map((scan, index) => {
                    if (!scan) return null;
                    
                    const uniqueKey = `scan-ungrouped-${index}-${scan.id || 'no-id'}-${scan.created_at || 'no-date'}`;
                    
                    return (
                      <div
                        key={uniqueKey}
                        className="border border-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-gray-600 transition-all"
                      >
                        {/* Mobile Layout (stacked) */}
                        <div className="block sm:hidden space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(scan.status)}
                              <span className={getStatusBadge(scan.status)}>
                                {scan.status || 'Unknown'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleViewDetails(scan)}
                              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden xs:inline">Details</span>
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-300">
                            <CreditCard className="w-4 h-4 flex-shrink-0" />
                            <span className="font-mono text-sm break-all">
                              {getTruncatedCardNumber(scan.card_number_masked)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">
                              {formatDate(scan.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Desktop Layout (horizontal) */}
                        <div className="hidden sm:flex items-center justify-between">
                          <div className="flex items-center space-x-2 md:space-x-4 flex-wrap gap-y-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(scan.status)}
                              <span className={getStatusBadge(scan.status)}>
                                {scan.status || 'Unknown'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-gray-300">
                              <CreditCard className="w-4 h-4 flex-shrink-0" />
                              <span className="font-mono text-sm">
                                {getTruncatedCardNumber(scan.card_number_masked)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-gray-400">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm">
                                {formatDate(scan.created_at)}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleViewDetails(scan)}
                            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium ml-4"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {isModalOpen && selectedScan && (
        <ScanHistoryModal
          scan={selectedScan}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};
 

export default ScanHistorySection;