import React from 'react';
import { X, Smartphone, Layers, Wifi, CreditCard, MapPin, Building2 } from 'lucide-react';

const DeviceInfoModal = ({ isOpen, onClose, deviceInfo, recordIndex }) => {
  if (!isOpen || !deviceInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-900/50 px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <Smartphone className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Device Record #{recordIndex + 1}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Building2 className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-400 font-mono">
                  {deviceInfo.merchant_id || 'N/A'}
                </p>
            
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Record Details */}
          

            {/* Device ID & Session ID */}
            {(deviceInfo.device_id || deviceInfo.session_id) && (
              <div className="bg-gray-800/50 rounded-lg p-4">
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
            )}

            {/* Device Specifications */}
            {deviceInfo.device && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
                  <Layers className="w-4 h-4 mr-2 text-green-400" />
                  Device Specifications
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deviceInfo.device.model && (
                    <div>
                      <p className="text-xs text-gray-400">Model</p>
                      <p className="text-sm text-white">{deviceInfo.device.model}</p>
                    </div>
                  )}
                  {deviceInfo.device.manufacturer && (
                    <div>
                      <p className="text-xs text-gray-400">Manufacturer</p>
                      <p className="text-sm text-white capitalize">{deviceInfo.device.manufacturer}</p>
                    </div>
                  )}
               
                  {deviceInfo.device.product && (
                    <div>
                      <p className="text-xs text-gray-400">Product</p>
                      <p className="text-sm text-white">{deviceInfo.device.product}</p>
                    </div>
                  )}
                  {deviceInfo.device.release && (
                    <div>
                      <p className="text-xs text-gray-400">Android Version</p>
                      <p className="text-sm text-white">{deviceInfo.device.release}</p>
                    </div>
                  )}

               
               
               
              
                </div>
              </div>
            )}

            {/* Network Information */}
            {deviceInfo.network && (deviceInfo.network.ipv4?.length > 0 || deviceInfo.network.ipv6?.length > 0 || deviceInfo.network.dns?.length > 0) && (
              <div className="bg-gray-800/50 rounded-lg p-4">
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
                          <span key={idx} className="text-sm text-white bg-gray-700/50 px-2 py-1 rounded font-mono">
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
                          <span key={idx} className="text-sm text-white bg-gray-700/50 px-2 py-1 rounded font-mono break-all">
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
                          <span key={idx} className="text-sm text-white bg-gray-700/50 px-2 py-1 rounded font-mono">
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
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-yellow-400" />
                  SIM Information
                </h5>
                <div className="space-y-2">
                  {deviceInfo.sims.map((sim, idx) => (
                    <div key={idx} className="bg-gray-700/50 p-3 rounded-lg">
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

            {/* Location Information */}
            {deviceInfo.locations && deviceInfo.locations.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-pink-400" />
                  Location Information
                </h5>
                <div className="space-y-3">
                  {deviceInfo.locations.map((location, idx) => (
                    <div key={idx} className="bg-gray-700/50 p-3 rounded-lg">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-400">Address</p>
                          <p className="text-sm text-white">{location.address || 'N/A'}</p>
                        </div>
                       
                        {location.created_at && (
                          <div>
                            <p className="text-xs text-gray-400">Recorded At</p>
                            <p className="text-sm text-white">
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
            {!deviceInfo.device_id && !deviceInfo.session_id && !deviceInfo.device && !deviceInfo.network && !deviceInfo.sims && !deviceInfo.locations?.length && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">No device details available for this record</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-800/50 px-6 py-4 border-t border-gray-700/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoModal;
