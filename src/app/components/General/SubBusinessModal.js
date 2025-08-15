'use client';

import React from 'react';
import { 
  FiX, 
  FiMail, 
  FiMapPin, 
  FiCalendar, 
  FiHome, 
  FiUser, 
  FiFileText, 
  FiCreditCard,
  FiPhone,
  FiGlobe,
  FiHash
} from 'react-icons/fi';

const SubBusinessModal = ({ subBusiness, isOpen, onClose }) => {
  if (!isOpen || !subBusiness) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const { business_profile } = subBusiness;

  const InfoRow = ({ icon: Icon, label, value, isLink = false, linkUrl = null }) => (
    <div className="flex items-start space-x-3 py-2">
      <Icon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        {isLink && linkUrl ? (
          <a 
            href={linkUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline break-all"
          >
            {value || 'Not provided'}
          </a>
        ) : (
          <p className="text-white break-words">{value || 'Not provided'}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {business_profile?.business_name || 'Unnamed Business'}
              </h2>
              <p className="text-gray-400 mt-1">Business Details</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Business Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FiHome className="w-5 h-5 mr-2 text-blue-400" />
                    Business Information
                  </h3>
                  <div className="space-y-1 bg-gray-800 rounded-lg p-4">
                    <InfoRow 
                      icon={FiHash} 
                      label="Merchant ID" 
                      value={subBusiness.merchant_id} 
                    />
                    <InfoRow 
                      icon={FiFileText} 
                      label="Registration Number" 
                      value={business_profile?.business_registration_number} 
                    />
                    <InfoRow 
                      icon={FiMail} 
                      label="Business Email" 
                      value={subBusiness.email} 
                    />
                    <InfoRow 
                      icon={FiCalendar} 
                      label="Created Date" 
                      value={formatDateTime(subBusiness.created_at)} 
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FiMapPin className="w-5 h-5 mr-2 text-blue-400" />
                    Address Information
                  </h3>
                  <div className="space-y-1 bg-gray-800 rounded-lg p-4">
                    <InfoRow 
                      icon={FiMapPin} 
                      label="Street Address" 
                      value={business_profile?.street} 
                    />
                    {business_profile?.street_line2 && (
                      <InfoRow 
                        icon={FiMapPin} 
                        label="Street Line 2" 
                        value={business_profile?.street_line2} 
                      />
                    )}
                    <InfoRow 
                      icon={FiMapPin} 
                      label="City" 
                      value={business_profile?.city} 
                    />
                    <InfoRow 
                      icon={FiMapPin} 
                      label="State/Province" 
                      value={business_profile?.state} 
                    />
                    <InfoRow 
                      icon={FiHash} 
                      label="ZIP/Postal Code" 
                      value={business_profile?.zip_code} 
                    />
                    <InfoRow 
                      icon={FiGlobe} 
                      label="Country" 
                      value={business_profile?.country} 
                    />
                  </div>
                </div>
              </div>

              {/* Account Holder Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FiUser className="w-5 h-5 mr-2 text-blue-400" />
                    Account Holder Information
                  </h3>
                  <div className="space-y-1 bg-gray-800 rounded-lg p-4">
                    <InfoRow 
                      icon={FiUser} 
                      label="First Name" 
                      value={business_profile?.account_holder_first_name} 
                    />
                    <InfoRow 
                      icon={FiUser} 
                      label="Last Name" 
                      value={business_profile?.account_holder_last_name} 
                    />
                    <InfoRow 
                      icon={FiMail} 
                      label="Email" 
                      value={business_profile?.account_holder_email} 
                    />
                    <InfoRow 
                      icon={FiCalendar} 
                      label="Date of Birth" 
                      value={formatDate(business_profile?.account_holder_date_of_birth)} 
                    />
                    <InfoRow 
                      icon={FiCreditCard} 
                      label="ID Type" 
                      value={business_profile?.account_holder_id_type} 
                    />
                    <InfoRow 
                      icon={FiHash} 
                      label="ID Number" 
                      value={business_profile?.account_holder_id_number} 
                    />
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FiFileText className="w-5 h-5 mr-2 text-blue-400" />
                    Documents
                  </h3>
                  <div className="space-y-1 bg-gray-800 rounded-lg p-4">
                    <InfoRow 
                      icon={FiFileText} 
                      label="Registration Document" 
                      value={business_profile?.registration_document_url ? "View Document" : "Not provided"}
                      isLink={!!business_profile?.registration_document_url}
                      linkUrl={business_profile?.registration_document_url}
                    />
                    <InfoRow 
                      icon={FiCreditCard} 
                      label="ID Document" 
                      value={business_profile?.account_holder_id_document_url ? "View Document" : "Not provided"}
                      isLink={!!business_profile?.account_holder_id_document_url}
                      linkUrl={business_profile?.account_holder_id_document_url}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubBusinessModal;