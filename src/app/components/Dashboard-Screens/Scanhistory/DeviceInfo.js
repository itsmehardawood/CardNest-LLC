'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, Smartphone, Eye } from 'lucide-react';
import { apiFetch } from '@/app/lib/api.js';
import DeviceInfoModal from './DeviceInfoModal';

const DeviceInfo = () => {
  const [deviceRecords, setDeviceRecords] = useState([]);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [deviceError, setDeviceError] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Generate year options (current year and 2 previous years)
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];
    setYearOptions(years);
  }, []);

  useEffect(() => {
    fetchDeviceInfo();
  }, [selectedYear, selectedMonth, selectedDate]);

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
              {deviceRecords.map((deviceInfo, index) => (
                <div key={index} className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <Smartphone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-semibold text-white">
                          Device Record #{index + 1}
                        </h4>
                        <p className="text-xs text-gray-400 font-mono mt-1">
                          {deviceInfo.device_id || 'No Device ID'} • {deviceInfo.session_id || 'No Session'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Created</p>
                        <p className="text-sm text-gray-300">
                          {deviceInfo.created_at ? new Date(deviceInfo.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
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
            <div className="text-center py-6 sm:py-8">
              <Smartphone className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-white mb-2">No Device Information</h3>
              <p className="text-sm sm:text-base text-gray-300">No device information found for this merchant.</p>
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

export default DeviceInfo;
