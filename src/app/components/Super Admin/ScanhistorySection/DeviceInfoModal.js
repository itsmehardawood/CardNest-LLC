import React from 'react';
import { X, Smartphone, Layers, Wifi, CreditCard, MapPin, Building2 } from 'lucide-react';

const DeviceInfoModal = ({ isOpen, onClose, deviceInfo, recordIndex }) => {
  if (!isOpen || !deviceInfo) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-lg lg:max-w-4xl max-h-[78vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-900/50 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-700/50 flex items-center justify-between flex-shrink-0 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-blue-900/30 rounded-lg flex-shrink-0">
              <Smartphone className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-xl font-semibold text-white truncate">
                Device Record #{recordIndex + 1}
              </h3>
              <div className="flex items-center space-x-1.5 mt-0.5 sm:mt-1 min-w-0">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-gray-400 font-mono truncate">
                  {deviceInfo.business_name || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Record Details */}
          

            {/* Device ID & Session ID */}
            {(deviceInfo.device_id || deviceInfo.session_id) && (
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
                <h5 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                  Device Identification
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Device ID</p>
                    <p className="text-xs sm:text-sm text-white font-mono break-all">{deviceInfo.device_id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Session ID</p>
                    <p className="text-xs sm:text-sm text-white font-mono break-all">{deviceInfo.session_id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Device Specifications */}
            {deviceInfo.device && (
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
                <h5 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  Device Specifications
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {deviceInfo.device.model && (
                    <div>
                      <p className="text-xs text-gray-400">Model</p>
                      <p className="text-xs sm:text-sm text-white break-words">{deviceInfo.device.model}</p>
                    </div>
                  )}
                  {deviceInfo.device.manufacturer && (
                    <div>
                      <p className="text-xs text-gray-400">Manufacturer</p>
                      <p className="text-xs sm:text-sm text-white capitalize">{deviceInfo.device.manufacturer}</p>
                    </div>
                  )}
                    {deviceInfo.device.buildId && (
                    <div>
                      <p className="text-xs text-gray-400">Build ID</p>
                      <p className="text-xs sm:text-sm text-white capitalize">{deviceInfo.device.buildId}</p>
                    </div>
                  )}
               
                  {deviceInfo.device.product && (
                    <div>
                      <p className="text-xs text-gray-400">Product</p>
                      <p className="text-xs sm:text-sm text-white break-words">{deviceInfo.device.product}</p>
                    </div>
                  )}
                  {deviceInfo.device.release && (
                    <div>
                      <p className="text-xs text-gray-400">Android Version</p>
                      <p className="text-xs sm:text-sm text-white">{deviceInfo.device.release}</p>
                    </div>
                  )}
                    {deviceInfo.device.buildFingerprint && (
                    <div>
                      <p className="text-xs text-gray-400">Build Fingerprint</p>
                      <p className="text-xs sm:text-sm text-white break-words">{deviceInfo.device.buildFingerprint}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Network Information */}
            {deviceInfo.network && (deviceInfo.network.ipv4?.length > 0 || deviceInfo.network.ipv6?.length > 0 || deviceInfo.network.dns?.length > 0) && (
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
                <h5 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                  Network Information
                </h5>
                <div className="space-y-2 sm:space-y-3">
                  {deviceInfo.network.ipv4 && deviceInfo.network.ipv4.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">IPv4 Addresses</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {deviceInfo.network.ipv4.map((ip, idx) => (
                          <span key={idx} className="text-xs sm:text-sm text-white bg-gray-700/50 px-2 py-0.5 sm:py-1 rounded font-mono break-all">
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {deviceInfo.network.ipv6 && deviceInfo.network.ipv6.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">IPv6 Addresses</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {deviceInfo.network.ipv6.map((ip, idx) => (
                          <span key={idx} className="text-xs sm:text-sm text-white bg-gray-700/50 px-2 py-0.5 sm:py-1 rounded font-mono break-all">
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {deviceInfo.network.dns && deviceInfo.network.dns.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">DNS Servers</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {deviceInfo.network.dns.map((dns, idx) => (
                          <span key={idx} className="text-xs sm:text-sm text-white bg-gray-700/50 px-2 py-0.5 sm:py-1 rounded font-mono break-all">
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
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
                <h5 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
                  SIM Information
                </h5>
                <div className="space-y-2">
                  {deviceInfo.sims.map((sim, idx) => (
                    <div key={idx} className="bg-gray-700/50 p-2 sm:p-3 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-400">SIM {idx + 1} Type</p>
                          <p className="text-xs sm:text-sm text-white capitalize break-words">{sim.simType || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Phone Number</p>
                          <p className="text-xs sm:text-sm text-white font-mono break-all">{sim.sim || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">MCC/MNC</p>
                          <p className="text-xs sm:text-sm text-white font-mono">{sim.mccmmc || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Carrier ID</p>
                          <p className="text-xs sm:text-sm text-white">{sim.carrierId || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Subscription ID</p>
                          <p className="text-xs sm:text-sm text-white">{sim.subscriptionId || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Information */}
            {deviceInfo.locations && deviceInfo.locations.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
                <h5 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 flex-shrink-0" />
                  Location Information
                </h5>
                <div className="space-y-2 sm:space-y-3">
                  {deviceInfo.locations.map((location, idx) => (
                    <div key={idx} className="bg-gray-700/50 p-2 sm:p-3 rounded-lg">
                      <div className="space-y-1.5 sm:space-y-2">
                        <div>
                          <p className="text-xs text-gray-400">Address</p>
                          <p className="text-xs sm:text-sm text-white break-words">{location.address || 'N/A'}</p>
                        </div>
                       
                        {location.created_at && (
                          <div>
                            <p className="text-xs text-gray-400">Recorded At</p>
                            <p className="text-xs sm:text-sm text-white">
                              {new Date(location.created_at).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show message if no device details available */}
            {!deviceInfo.device_id && !deviceInfo.session_id && !deviceInfo.device && (!deviceInfo.sims || deviceInfo.sims.length === 0) && (!deviceInfo.network || ((!deviceInfo.network.ipv4 || deviceInfo.network.ipv4.length === 0) && (!deviceInfo.network.ipv6 || deviceInfo.network.ipv6.length === 0) && (!deviceInfo.network.dns || deviceInfo.network.dns.length === 0))) && (!deviceInfo.locations || deviceInfo.locations.length === 0) && (
              <div className="flex flex-col items-center justify-center py-6 sm:py-12">
                <div className="backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-8 max-w-xs mx-auto text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-900/90 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">Data Not Available</h4>
                  <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
                    No device information is available for this record.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-800/50 px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-700/50 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoModal;
