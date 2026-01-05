'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, Layers, Smartphone, CreditCard, Wifi } from 'lucide-react';
import { apiFetch } from '@/app/lib/api.js';

const DeviceInfo = () => {
  const [deviceRecords, setDeviceRecords] = useState([]);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [deviceError, setDeviceError] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [yearOptions, setYearOptions] = useState([]);
  const [expandedRecords, setExpandedRecords] = useState({});

  useEffect(() => {
    // Generate year options (current year and 2 previous years)
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];
    setYearOptions(years);
  }, []);

  useEffect(() => {
    fetchDeviceInfo();
  }, [selectedYear, selectedMonth, selectedDate]);

  // Toggle individual record expansion
  const toggleRecord = (index) => {
    setExpandedRecords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Fetch device information
  const fetchDeviceInfo = async () => {
    try {
      setDeviceLoading(true);
      setDeviceError(null);

      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const merchantId = userData.user?.merchant_id;

      if (!merchantId) {
        setDeviceError('Merchant ID not found');
        setDeviceLoading(false);
        return;
      }

      // Build query parameters based on year selection
      const queryParams = `year=${selectedYear}&month=${selectedMonth}&date=${selectedDate}`;
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/device/merchant/${merchantId}?${queryParams}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch device info: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        setDeviceRecords(Array.isArray(result.data) ? result.data : []);
      } else {
        setDeviceError('No device information found');
      }
    } catch (err) {
      console.error('Error fetching device info:', err);
      setDeviceError(err.message);
    } finally {
      setDeviceLoading(false);
    }
  };

  // Toggle accordion
  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
  };

  return (
    <div className="border-b border-gray-700">
      <button
        onClick={toggleAccordion}
        className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-900 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Smartphone className="w-5 h-5 text-green-400" />
          <h3 className="text-base sm:text-lg font-semibold text-white">Device Information Details</h3>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchDeviceInfo();
            }}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Refresh
          </button>
          {accordionOpen ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {accordionOpen && (
        <div className="p-4 sm:p-6">
          {/* Year, Month, Date Filter */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value));
                  setSelectedMonth(0);
                  setSelectedDate(0);
                }}
                className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(Number(e.target.value));
                  setSelectedDate(0);
                }}
                className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>All</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString('en-US', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Date:</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(Number(e.target.value))}
                disabled={selectedMonth === 0}
                className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value={0}>All</option>
                {selectedMonth > 0 && [...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {deviceLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-300">Loading device information...</span>
            </div>
          ) : deviceError ? (
            <div className="text-center py-6 sm:py-8">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">No Device Information Found</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4">{deviceError}</p>
              <button
                onClick={fetchDeviceInfo}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          ) : deviceRecords && deviceRecords.length > 0 ? (
            <div className="space-y-3">
              {deviceRecords.map((deviceInfo, index) => {
                const isExpanded = expandedRecords[index];
                return (
                  <div key={index} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                    {/* Collapsible Header */}
                    <button
                      onClick={() => toggleRecord(index)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                        <Smartphone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <h4 className="text-sm sm:text-base font-semibold text-white">
                            Device Record #{index + 1}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs text-gray-400 font-mono">
                              {deviceInfo.device_id || 'No Device ID'} • {deviceInfo.session_id || 'No Session'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-400">
                          {deviceInfo.created_at ? new Date(deviceInfo.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-gray-700 p-4 bg-black">
                        {/* Device ID & Session ID */}
                        <div className="mb-4 bg-gray-800 rounded-lg p-4">
                          <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
                            <Smartphone className="w-4 h-4 mr-2 text-blue-400" />
                            Device Identification
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-400">Device ID</p>
                              <p className="text-sm text-white font-mono">{deviceInfo.device_id || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Session ID</p>
                              <p className="text-sm text-white font-mono">{deviceInfo.session_id || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Device Specifications */}
                        {deviceInfo.device && (
                          <div className="mb-4 bg-gray-800 rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
                              <Layers className="w-4 h-4 mr-2 text-green-400" />
                              Device Specifications
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-400">Model</p>
                                <p className="text-sm text-white">{deviceInfo.device.model || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Manufacturer</p>
                                <p className="text-sm text-white capitalize">{deviceInfo.device.manufacturer || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Brand</p>
                                <p className="text-sm text-white capitalize">{deviceInfo.device.brand || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Product</p>
                                <p className="text-sm text-white">{deviceInfo.device.product || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Android Version</p>
                                <p className="text-sm text-white">{deviceInfo.device.release || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">SDK Version</p>
                                <p className="text-sm text-white">{deviceInfo.device.sdkInt || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Security Patch</p>
                                <p className="text-sm text-white">{deviceInfo.device.securityPatch || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Build ID</p>
                                <p className="text-sm text-white font-mono">{deviceInfo.device.buildId || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Boot Count</p>
                                <p className="text-sm text-white">{deviceInfo.device.bootCount || 'N/A'}</p>
                              </div>
                              <div className="sm:col-span-2">
                                <p className="text-xs text-gray-400">Build Fingerprint</p>
                                <p className="text-sm text-white font-mono break-all">{deviceInfo.device.buildFingerprint || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Network Information */}
                        {deviceInfo.network && (
                          <div className="mb-4 bg-gray-800 rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
                              <Wifi className="w-4 h-4 mr-2 text-purple-400" />
                              Network Information
                            </h5>
                            <div className="space-y-3">
                              {deviceInfo.network.ipv4 && deviceInfo.network.ipv4.length > 0 && (
                                <div>
                                  <p className="text-xs text-gray-400 mb-1">IPv4 Addresses</p>
                                  <div className="flex flex-wrap gap-2">
                                    {deviceInfo.network.ipv4.map((ip, idx) => (
                                      <span key={idx} className="text-sm text-white bg-gray-700 px-2 py-1 rounded font-mono">
                                        {ip}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {deviceInfo.network.ipv6 && deviceInfo.network.ipv6.length > 0 && (
                                <div>
                                  <p className="text-xs text-gray-400 mb-1">IPv6 Addresses</p>
                                  <div className="flex flex-wrap gap-2">
                                    {deviceInfo.network.ipv6.map((ip, idx) => (
                                      <span key={idx} className="text-sm text-white bg-gray-700 px-2 py-1 rounded font-mono break-all">
                                        {ip}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {deviceInfo.network.dns && deviceInfo.network.dns.length > 0 && (
                                <div>
                                  <p className="text-xs text-gray-400 mb-1">DNS Servers</p>
                                  <div className="flex flex-wrap gap-2">
                                    {deviceInfo.network.dns.map((dns, idx) => (
                                      <span key={idx} className="text-sm text-white bg-gray-700 px-2 py-1 rounded font-mono">
                                        {dns}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* SIM Information */}
                        {deviceInfo.sims && deviceInfo.sims.length > 0 && (
                          <div className="bg-gray-800 rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
                              <CreditCard className="w-4 h-4 mr-2 text-yellow-400" />
                              SIM Information
                            </h5>
                            <div className="space-y-2">
                              {deviceInfo.sims.map((sim, idx) => (
                                <div key={idx} className="bg-gray-700 p-3 rounded">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div>
                                      <p className="text-xs text-gray-400">SIM {idx + 1} Type</p>
                                      <p className="text-sm text-white capitalize">{sim.simType || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-400">Phone Number</p>
                                      <p className="text-sm text-white font-mono">{sim.sim || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-400">MCC/MNC</p>
                                      <p className="text-sm text-white font-mono">{sim.mccmmc || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-400">Carrier ID</p>
                                      <p className="text-sm text-white">{sim.carrierId || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-400">Subscription ID</p>
                                      <p className="text-sm text-white">{sim.subscriptionId || 'N/A'}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <Smartphone className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">No Device Information</h3>
              <p className="text-sm sm:text-base text-gray-300">No device information found for this merchant.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceInfo;
