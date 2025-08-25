import React, { useState } from 'react';
import { 
  XCircle, CheckCircle, AlertCircle, Download, Eye, ShieldCheck, 
  Briefcase, MapPin, User, Home, CreditCard, FileText, Mail, ExternalLink 
} from 'lucide-react';
import Image from 'next/image';

// Document Preview Component
const DocumentPreview = ({ 
  documentPath, 
  documentName, 
  documentType = 'registration', // 'registration' or 'id'
  onDownload,
  downloadLoading = false 
}) => {
  const [imageError, setImageError] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(documentPath);
  const isPDF = /\.pdf$/i.test(documentPath);
  
  const Icon = documentType === 'id' ? CreditCard : FileText;
  const gradientColor = documentType === 'id' ? 'from-purple-600 to-purple-700' : 'from-indigo-600 to-indigo-700';

  const handleImageError = () => {
    setImageError(true);
  };

  const openInNewTab = () => {
    window.open(documentPath, '_blank');
  };

  return (
    <>
      <div className="bg-black rounded-2xl border border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className={`bg-gradient-to-r ${gradientColor} text-white p-4`}>
          <h4 className="text-sm font-semibold flex items-center">
            <Icon className="h-4 w-4 mr-2" />
            {documentType === 'id' ? 'Account Holder ID Document' : 'Business Registration Document'}
          </h4>
        </div>
        
        <div className="p-4">
          {/* File info and actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
            <div className="flex items-center min-w-0 bg-gray-900 rounded-lg p-3 flex-1 mr-3 border border-gray-800">
              <Icon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-300 text-sm truncate font-medium">
                {documentName}
              </span>
            </div>
            
            <div className="flex space-x-2 flex-shrink-0">
              <button
                onClick={openInNewTab}
                className="flex items-center px-3 py-2 bg-gray-700 text-white text-xs font-medium rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-sm"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </button>
              
              {onDownload && (
                <button
                  onClick={onDownload}
                  disabled={downloadLoading}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 shadow-sm"
                >
                  {downloadLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1"></div>
                  ) : (
                    <Download className="h-3 w-3 mr-1" />
                  )}
                  Download
                </button>
              )}
            </div>
          </div>
          
          {/* Document preview area */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            {isImage && !imageError ? (
              <div className="relative">
                <img
                  src={documentPath}
                  alt={`${documentType} document`}
                  className="w-full h-48 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onError={handleImageError}
                  onClick={() => setShowFullScreen(true)}
                />
                <button
                  onClick={() => setShowFullScreen(true)}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ) : isPDF ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-300 text-sm font-medium mb-3">PDF Document</p>
                <p className="text-gray-400 text-xs mb-4">Click Open to view the PDF in a new tab</p>
                <button
                  onClick={openInNewTab}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open PDF
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-300 text-sm font-medium mb-3">Preview not available</p>
                <p className="text-gray-400 text-xs mb-4">Click Open to view the document</p>
                <button
                  onClick={openInNewTab}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Document
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full screen image modal */}
      {showFullScreen && isImage && !imageError && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setShowFullScreen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-lg font-bold"
            >
              ✕ Close
            </button>
            <img
              src={documentPath}
              alt={`${documentType} document full view`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

const BusinessModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedBusiness,
  activeTab,
  handleApprove,
  handleReject,
  actionLoading,
  showRejectForm,
  setShowRejectForm,
  rejectReason,
  setRejectReason,
  downloadLoading,
  handleDownloadDocument
}) => {

  const handleRejectClick = () => {
    setShowRejectForm(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowRejectForm(false);
    setRejectReason('');
  };

  if (!isModalOpen || !selectedBusiness) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-4">
      <div className="relative top-4 mx-auto border-0 w-full max-w-6xl shadow-2xl rounded-2xl bg-black border border-gray-800">
        {/* Enhanced Modal Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Business Verification Review</h3>
                <p className="text-gray-300 text-sm">Complete verification assessment</p>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
              disabled={actionLoading}
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-[85vh] overflow-y-auto bg-gray-900">
          <div className="space-y-8">
            {/* Business Information Section */}
            <div className="bg-black rounded-2xl p-6 shadow-sm border border-gray-800">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-900 rounded-lg mr-3">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Business Information</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Business Name</label>
                  <p className="text-white text-sm font-semibold">{selectedBusiness.business_name}</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Registration Number</label>
                  <p className="text-white text-sm font-semibold">{selectedBusiness.business_registration_number}</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Business Email</label>
                  <p className="text-white text-sm font-semibold">{selectedBusiness.email}</p>
                </div>
              </div>
            </div>

            {/* Business Address Section */}
            <div className="bg-black rounded-2xl p-6 shadow-sm border border-gray-800">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-900 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Business Address</h4>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="text-white space-y-1">
                  <p className="font-semibold text-base">{selectedBusiness.street}</p>
                  {selectedBusiness.street_line2 && <p className="text-gray-300">{selectedBusiness.street_line2}</p>}
                  <p className="text-gray-300">{selectedBusiness.city}, {selectedBusiness.state} {selectedBusiness.zip_code}</p>
                  <p className="font-semibold text-green-400 text-sm">{selectedBusiness.country}</p>
                </div>
              </div>
            </div>
            
            {/* Account Holder Information Section */}
            <div className="bg-black rounded-2xl p-6 shadow-sm border border-gray-800">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-900 rounded-lg mr-3">
                  <User className="h-5 w-5 text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Account Holder Details</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Full Name</label>
                  <p className="text-white text-sm font-semibold">
                    {selectedBusiness.account_holder_first_name} {selectedBusiness.account_holder_last_name}
                  </p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Email</label>
                  <p className="text-white text-sm font-semibold">{selectedBusiness.account_holder_email}</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Date of Birth</label>
                  <p className="text-white text-sm font-semibold">
                    {new Date(selectedBusiness.account_holder_date_of_birth).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Phone</label>
                  <p className="text-white text-sm font-semibold">
                    {selectedBusiness.user.country_code} {selectedBusiness.user.phone_no}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Holder Address Section */}
            <div className="bg-black rounded-2xl p-6 shadow-sm border border-gray-800">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-amber-900 rounded-lg mr-3">
                  <Home className="h-5 w-5 text-amber-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Account Holder Address</h4>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="text-white space-y-1">
                  <p className="font-semibold text-base">{selectedBusiness.account_holder_street}</p>
                  {selectedBusiness.account_holder_street_line2 && (
                    <p className="text-gray-300">{selectedBusiness.account_holder_street_line2}</p>
                  )}
                  <p className="text-gray-300">{selectedBusiness.account_holder_city}, {selectedBusiness.account_holder_state} {selectedBusiness.account_holder_zip_code}</p>
                  <p className="font-semibold text-amber-400 text-sm">{selectedBusiness.account_holder_country}</p>
                </div>
              </div>
            </div>

            {/* ID Information Section */}
            <div className="bg-black rounded-2xl p-6 shadow-sm border border-gray-800">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-indigo-900 rounded-lg mr-3">
                  <CreditCard className="h-5 w-5 text-indigo-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Identity Information</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">ID Type</label>
                  <p className="text-white text-sm font-semibold">{selectedBusiness.account_holder_id_type}</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">ID Number</label>
                  <p className="text-white text-sm font-semibold font-mono">
                    {selectedBusiness.account_holder_id_number}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Status Section */}
            <div className="bg-black rounded-2xl p-6 shadow-sm border border-gray-800">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gray-800 rounded-lg mr-3">
                  <ShieldCheck className="h-5 w-5 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Account Status</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Merchant ID</label>
                  <p className="text-white text-sm font-semibold font-mono">{selectedBusiness.user.merchant_id}</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Trial Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedBusiness.user.on_trial 
                      ? 'bg-blue-900 text-blue-300 border border-blue-700' 
                      : 'bg-gray-800 text-gray-300 border border-gray-700'
                  }`}>
                    {selectedBusiness.user.on_trial ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Trial Calls Remaining</label>
                  <p className="text-white text-sm font-semibold">{selectedBusiness.user.trial_calls_remaining}</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Trial Ends</label>
                  <p className="text-white text-sm font-semibold">
                    {new Date(selectedBusiness.user.trial_ends_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Role</label>
                  <p className="text-white text-sm font-semibold">{selectedBusiness.user.role}</p>
                </div>
              </div>
            </div>

            {/* Previous verification reason */}
            {selectedBusiness.user.verification_reason && (
              <div className="bg-red-900 border border-red-700 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <label className="text-sm font-semibold text-red-200">Previous Rejection Notes</label>
                </div>
                <div className="bg-black rounded-xl p-4 shadow-sm border border-red-800">
                  <p className="text-red-300 text-sm leading-relaxed">{selectedBusiness.user.verification_reason}</p>
                </div>
              </div>
            )}

            {/* Documents Section */}
            {activeTab === "pending" && (
              <div className="space-y-6">
                {/* Registration Document */}
                {selectedBusiness.registration_document_path && (
                  <DocumentPreview
                    documentPath={selectedBusiness.registration_document_path}
                    documentName={(selectedBusiness.registration_document_path || '').split('/').pop()}
                    documentType="registration"
                    onDownload={() => handleDownloadDocument(
                      selectedBusiness.registration_document_path,
                      `${selectedBusiness.business_name}_registration_document.${(selectedBusiness.registration_document_path || '').split('.').pop()}`
                    )}
                    downloadLoading={downloadLoading}
                  />
                )}

                {/* ID Document */}
                {selectedBusiness.account_holder_id_document_path && (
                  <DocumentPreview
                    documentPath={selectedBusiness.account_holder_id_document_path}
                    documentName={(selectedBusiness.account_holder_id_document_path || '').split('/').pop()}
                    documentType="id"
                    onDownload={() => handleDownloadDocument(
                      selectedBusiness.account_holder_id_document_path,
                      `${selectedBusiness.account_holder_first_name}_${selectedBusiness.account_holder_last_name}_id_document.${(selectedBusiness.account_holder_id_document_path || '').split('.').pop()}`
                    )}
                    downloadLoading={downloadLoading}
                  />
                )}
              </div>
            )}

            {/* Reject Reason Form */}
            {showRejectForm && (
              <div className="bg-red-900 border border-red-700 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <XCircle className="h-5 w-5 text-red-400 mr-2" />
                  <label className="text-sm font-semibold text-red-200">Reason for Rejection *</label>
                </div>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-3 border text-white border-red-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm resize-none bg-black"
                  rows="4"
                  placeholder="Please provide a detailed reason for rejection. This will help the business understand what needs to be corrected."
                  required
                />
              </div>
            )}
          </div>   

          {/* Enhanced Action Buttons */}
          {activeTab === 'pending' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-gray-800">
              <button
                onClick={() => handleApprove(selectedBusiness.id)}
                disabled={actionLoading}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Approve Business
              </button>

              {!showRejectForm ? (
                <button
                  onClick={handleRejectClick}
                  disabled={actionLoading}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Business
                </button>
              ) : (
                <button
                  onClick={() => handleReject(selectedBusiness.id)}
                  disabled={actionLoading || !rejectReason.trim()}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Confirm Rejection
                </button>
              )}
              
              <button
                onClick={handleCloseModal}
                disabled={actionLoading}
                className="px-6 py-3 text-gray-300 bg-black border border-gray-700 hover:bg-gray-900 text-sm font-semibold rounded-xl disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessModal;