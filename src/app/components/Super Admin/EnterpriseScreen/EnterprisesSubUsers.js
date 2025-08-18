import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Mail, 
  Calendar, 
  MapPin, 
  User, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Phone, 
  CreditCard,
  Hash,
  Globe,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const SubBusinessModal = ({ isOpen, onClose, enterprise }) => {
  const [expandedCards, setExpandedCards] = useState({});
  const [showAesKeys, setShowAesKeys] = useState({});

  if (!isOpen || !enterprise) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      'APPROVED': { color: 'bg-green-900/30 text-green-400 border-green-500/30', icon: CheckCircle },
      'PENDING': { color: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30', icon: Clock },
      'INCOMPLETE': { color: 'bg-red-900/30 text-red-400 border-red-500/30', icon: AlertCircle },
      'INCOMPLETE PROFILE': { color: 'bg-red-900/30 text-red-400 border-red-500/30', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig['PENDING'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const toggleCardExpansion = (merchantId) => {
    setExpandedCards(prev => ({
      ...prev,
      [merchantId]: !prev[merchantId]
    }));
  };

  const toggleAesKeyVisibility = (merchantId) => {
    setShowAesKeys(prev => ({
      ...prev,
      [merchantId]: !prev[merchantId]
    }));
  };

  const openDocument = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const InfoRow = ({ icon: Icon, label, value, copyable = false, clickable = false, onClick }) => {
    if (!value) return null;
    
    return (
      <div className="flex items-start space-x-3 py-2">
        <Icon className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <div className="flex items-center space-x-2">
            <p className={`text-sm text-white break-words ${clickable ? 'cursor-pointer hover:text-blue-400' : ''}`}
               onClick={clickable ? onClick : undefined}>
              {value}
            </p>
            {copyable && (
              <button
                onClick={() => copyToClipboard(value)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="h-3 w-3" />
              </button>
            )}
            {clickable && (
              <ExternalLink className="h-3 w-3 text-gray-500" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-gray-900 rounded-xl shadow-2xl border border-gray-700 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-900/30 rounded-full p-3 border border-blue-500/30">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {enterprise.enterprise_user.business_profile?.business_name || 'Incomplete Profile'}
                </h3>
                <p className="text-gray-400">
                  {enterprise.sub_businesses_count} Sub-business{enterprise.sub_businesses_count !== 1 ? 'es' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {enterprise.sub_businesses.length > 0 ? (
              <div className="space-y-6">
                {enterprise.sub_businesses.map((subBusiness) => (
                  <div 
                    key={subBusiness.merchant_id} 
                    className="border border-gray-700 rounded-xl bg-gray-800 overflow-hidden hover:border-gray-600 transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-gray-700 bg-gray-800/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-900/30 rounded-full p-2.5 border border-green-500/30">
                            <Building2 className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">
                              {subBusiness.business_profile?.business_name || 'Business Name Not Set'}
                            </h4>
                            <p className="text-sm text-gray-400">
                              Merchant ID: {subBusiness.merchant_id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(subBusiness.business_verified)}
                          <button
                            onClick={() => toggleCardExpansion(subBusiness.merchant_id)}
                            className="text-gray-400 hover:text-white transition-colors p-1"
                          >
                            {expandedCards[subBusiness.merchant_id] ? 
                              <ChevronUp className="h-5 w-5" /> : 
                              <ChevronDown className="h-5 w-5" />
                            }
                          </button>
                        </div>
                      </div>
                      
                      {/* Basic Info - Always Visible */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <InfoRow 
                          icon={Mail} 
                          label="Email Address" 
                          value={subBusiness.email} 
                          copyable 
                        />
                        <InfoRow 
                          icon={Calendar} 
                          label="Created Date" 
                          value={formatDate(subBusiness.created_at)} 
                        />
                      </div>
                      
                      {/* AES Key Section */}
                      {subBusiness.aes_key && (
                        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm text-gray-400">AES Encryption Key</span>
                            </div>
                            <button
                              onClick={() => toggleAesKeyVisibility(subBusiness.merchant_id)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              {showAesKeys[subBusiness.merchant_id] ? 
                                <EyeOff className="h-4 w-4" /> : 
                                <Eye className="h-4 w-4" />
                              }
                            </button>
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <code className="flex-1 bg-gray-800 px-3 py-2 rounded text-sm text-green-400 font-mono">
                              {showAesKeys[subBusiness.merchant_id] ? 
                                subBusiness.aes_key : 
                                '●●●●●●●●●●●●●●●●'
                              }
                            </code>
                            <button
                              onClick={() => copyToClipboard(subBusiness.aes_key)}
                              className="text-gray-400 hover:text-white transition-colors p-2 rounded"
                              title="Copy AES Key"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Expanded Content */}
                    {expandedCards[subBusiness.merchant_id] && subBusiness.business_profile && (
                      <div className="p-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Business Information */}
                          <div className="space-y-4">
                            <h5 className="text-sm font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700 pb-2">
                              Business Information
                            </h5>
                            <InfoRow 
                              icon={Hash} 
                              label="Registration Number" 
                              value={subBusiness.business_profile.business_registration_number} 
                              copyable 
                            />
                          </div>
                          
                          {/* Address Information */}
                          <div className="space-y-4">
                            <h5 className="text-sm font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700 pb-2">
                              Address
                            </h5>
                            <InfoRow 
                              icon={MapPin} 
                              label="Street Address" 
                              value={subBusiness.business_profile.street} 
                            />
                            {subBusiness.business_profile.street_line2 && (
                              <InfoRow 
                                icon={MapPin} 
                                label="Address Line 2" 
                                value={subBusiness.business_profile.street_line2} 
                              />
                            )}
                            <InfoRow 
                              icon={MapPin} 
                              label="City" 
                              value={subBusiness.business_profile.city} 
                            />
                            <InfoRow 
                              icon={MapPin} 
                              label="State/Province" 
                              value={subBusiness.business_profile.state} 
                            />
                            <InfoRow 
                              icon={MapPin} 
                              label="ZIP/Postal Code" 
                              value={subBusiness.business_profile.zip_code} 
                            />
                            <InfoRow 
                              icon={Globe} 
                              label="Country" 
                              value={subBusiness.business_profile.country} 
                            />
                          </div>
                          
                          {/* Account Holder Information */}
                          <div className="space-y-4">
                            <h5 className="text-sm font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700 pb-2">
                              Account Holder
                            </h5>
                            <InfoRow 
                              icon={User} 
                              label="First Name" 
                              value={subBusiness.business_profile.account_holder_first_name} 
                            />
                            <InfoRow 
                              icon={User} 
                              label="Last Name" 
                              value={subBusiness.business_profile.account_holder_last_name} 
                            />
                            <InfoRow 
                              icon={Mail} 
                              label="Email" 
                              value={subBusiness.business_profile.account_holder_email} 
                              copyable 
                            />
                            <InfoRow 
                              icon={Calendar} 
                              label="Date of Birth" 
                              value={subBusiness.business_profile.account_holder_date_of_birth ? 
                                new Date(subBusiness.business_profile.account_holder_date_of_birth).toLocaleDateString() : 
                                null
                              } 
                            />
                            <InfoRow 
                              icon={FileText} 
                              label="ID Type" 
                              value={subBusiness.business_profile.account_holder_id_type} 
                            />
                            <InfoRow 
                              icon={Hash} 
                              label="ID Number" 
                              value={subBusiness.business_profile.account_holder_id_number} 
                              copyable 
                            />
                          </div>
                        </div>
                        
                        {/* Documents Section */}
                        {(subBusiness.business_profile.registration_document_url || 
                          subBusiness.business_profile.account_holder_id_document_url) && (
                          <div className="mt-6 pt-6 border-t border-gray-700">
                            <h5 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                              Documents
                            </h5>
                            <div className="grid md:grid-cols-2 gap-4">
                              {subBusiness.business_profile.registration_document_url && (
                                <button
                                  onClick={() => openDocument(subBusiness.business_profile.registration_document_url)}
                                  className="flex items-center space-x-3 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg hover:bg-blue-900/30 transition-colors text-left"
                                >
                                  <FileText className="h-5 w-5 text-blue-400" />
                                  <div>
                                    <p className="text-sm font-medium text-white">Registration Document</p>
                                    <p className="text-xs text-gray-400">Click to view</p>
                                  </div>
                                  <ExternalLink className="h-4 w-4 text-blue-400 ml-auto" />
                                </button>
                              )}
                              
                              {subBusiness.business_profile.account_holder_id_document_url && (
                                <button
                                  onClick={() => openDocument(subBusiness.business_profile.account_holder_id_document_url)}
                                  className="flex items-center space-x-3 p-4 bg-green-900/20 border border-green-500/30 rounded-lg hover:bg-green-900/30 transition-colors text-left"
                                >
                                  <FileText className="h-5 w-5 text-green-400" />
                                  <div>
                                    <p className="text-sm font-medium text-white">ID Document</p>
                                    <p className="text-xs text-gray-400">Click to view</p>
                                  </div>
                                  <ExternalLink className="h-4 w-4 text-green-400 ml-auto" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-800 rounded-full p-6 w-24 h-24 mx-auto mb-6 border border-gray-700">
                  <Building2 className="h-12 w-12 text-gray-600 mx-auto" />
                </div>
                <h4 className="text-xl font-medium text-white mb-2">No Sub-businesses</h4>
                <p className="text-gray-400 max-w-md mx-auto">
                  This enterprise user does not have any sub-businesses registered yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubBusinessModal;