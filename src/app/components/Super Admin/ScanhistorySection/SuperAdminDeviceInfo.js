import { apiFetch } from "@/app/lib/api.js";
import React, { useState, useEffect, useMemo } from "react";
import { AlertCircle, ChevronDown, ChevronRight, Smartphone, Building2, Eye, Search, X } from 'lucide-react';
import DeviceInfoModal from './DeviceInfoModal';

const SuperAdminDeviceInfo = () => {
  const [deviceRecords, setDeviceRecords] = useState([]);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [deviceError, setDeviceError] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [yearOptions, setYearOptions] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [businessNameFilter, setBusinessNameFilter] = useState('');

  useEffect(() => {
    // Generate year options (current year and 2 previous years)
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];
    setYearOptions(years);
  }, []);

  useEffect(() => {
    if (accordionOpen) {
      fetchDeviceInfo();
    }
  }, [selectedYear, selectedMonth, selectedDate, accordionOpen]);

  // Open modal with selected device
  const openDeviceModal = (device, index) => {
    setSelectedDevice({ ...device, index });
    setModalOpen(true);
  };

  // Close modal
  const closeDeviceModal = () => {
    setModalOpen(false);
    setSelectedDevice(null);
  };

  // Filter device records based on business name
  const filteredDeviceRecords = useMemo(() => {
    if (!businessNameFilter.trim()) {
      return deviceRecords;
    }
    return deviceRecords.filter(device => 
      device.business_name?.toLowerCase().includes(businessNameFilter.toLowerCase())
    );
  }, [deviceRecords, businessNameFilter]);

  // Fetch device information
  const fetchDeviceInfo = async () => {
    try {
      setDeviceLoading(true);
      setDeviceError(null);

      // Build query parameters based on filters
      const queryParams = `year=${selectedYear}&month=${selectedMonth}&date=${selectedDate}`;
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices?${queryParams}`;

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
        setTotalRecords(result.count || result.data.length);
        setCurrentPage(result.meta?.current_page || 1);
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
    <div className="bg-black/50 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-gray-700/50 mt-8">
      <button
        onClick={toggleAccordion}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-900/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Smartphone className="w-6 h-6 text-green-400" />
          <div className="text-left">
            <h2 className="text-2xl font-semibold text-gray-100">
              Device Information Records
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              View all device information across all merchants
            </p>
          </div>
       
        </div>
        <div className="flex items-center space-x-3">
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              fetchDeviceInfo();
            }}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium px-3 py-1 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            Refresh
          </button> */}
          {accordionOpen ? (
            <ChevronDown className="w-6 h-6 text-gray-400" />
          ) : (
            <ChevronRight className="w-6 h-6 text-gray-400" />
          )}
        </div>
      </button>

      {accordionOpen && (
        <div className="p-6 border-t border-gray-700/50">
          {/* Business Name Filter */}
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by business name..."
                value={businessNameFilter}
                onChange={(e) => setBusinessNameFilter(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {businessNameFilter && (
                <button
                  onClick={() => setBusinessNameFilter('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {businessNameFilter && (
              <p className="text-xs text-gray-400 mt-2">
                Showing {filteredDeviceRecords.length} of {deviceRecords.length} records
              </p>
            )}
          </div>

          {/* Year, Month, Date Filter */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value));
                  setSelectedMonth(0);
                  setSelectedDate(0);
                }}
                className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value={0}>All</option>
                {selectedMonth > 0 && [...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {deviceLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <span className="text-gray-300">Loading device information...</span>
            </div>
          ) : deviceError ? (
            <div className="text-center py-12">
              <div className="bg-red-900/20 backdrop-blur-md border border-red-700/50 rounded-xl p-6 max-w-md mx-auto">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Device Information Found</h3>
                <p className="text-sm text-gray-300 mb-4">{deviceError}</p>
                <button
                  onClick={fetchDeviceInfo}
                  className="bg-red-700/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredDeviceRecords && filteredDeviceRecords.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {filteredDeviceRecords.map((deviceInfo, index) => (
                <div 
                  key={deviceInfo.id || index} 
                  className="bg-black/30 backdrop-blur-md border border-gray-700/50 rounded-xl p-5 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="p-2 bg-blue-900/30 rounded-lg">
                        <Smartphone className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-white">
                          Device Record {index + 1}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-400 font-mono">
                            {deviceInfo.business_name || 'N/A'}
                          </p>
                        
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Updated</p>
                        <p className="text-sm text-gray-300">
                          {deviceInfo.created_at ? new Date(deviceInfo.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                      <button
                        onClick={() => openDeviceModal(deviceInfo, index)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-900/30 backdrop-blur-md border border-gray-700/50 rounded-xl p-8 max-w-md mx-auto">
                <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Device Information</h3>
                <p className="text-sm text-gray-300">
                  {businessNameFilter 
                    ? `No devices found matching "${businessNameFilter}"` 
                    : 'No device information found for the selected filters.'}
                </p>
                {businessNameFilter && (
                  <button
                    onClick={() => setBusinessNameFilter('')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Device Info Modal */}
      <DeviceInfoModal 
        isOpen={modalOpen}
        onClose={closeDeviceModal}
        deviceInfo={selectedDevice}
        recordIndex={selectedDevice?.index || 0}
      />
    </div>
  );
};

export default SuperAdminDeviceInfo;
