import React from 'react';
import { 
  XCircle, CheckCircle, AlertCircle, Download, Eye, ShieldCheck, 
  Briefcase, MapPin, User, Home, CreditCard, FileText, Mail 
} from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-4">
      <div className="relative top-4 mx-auto border-0 w-full max-w-6xl shadow-2xl rounded-2xl bg-white">
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
        
        <div className="p-6 max-h-[85vh] overflow-y-auto bg-gray-50">
          <div className="space-y-8">
            {/* Business Information Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Business Information</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Business Name</label>
                  <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.business_name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Registration Number</label>
                  <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.business_registration_number}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Business Email</label>
                  <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.email}</p>
                </div>
              </div>
            </div>

            {/* Business Address Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Business Address</h4>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-900 space-y-1">
                  <p className="font-semibold text-base">{selectedBusiness.street}</p>
                  {selectedBusiness.street_line2 && <p className="text-gray-600">{selectedBusiness.street_line2}</p>}
                  <p className="text-gray-700">{selectedBusiness.city}, {selectedBusiness.state} {selectedBusiness.zip_code}</p>
                  <p className="font-semibold text-green-700 text-sm">{selectedBusiness.country}</p>
                </div>
              </div>
            </div>
            
            {/* Account Holder Information Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Account Holder Details</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Full Name</label>
                  <p className="text-gray-900 text-sm font-semibold">
                    {selectedBusiness.account_holder_first_name} {selectedBusiness.account_holder_last_name}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Email</label>
                  <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.account_holder_email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Date of Birth</label>
                  <p className="text-gray-900 text-sm font-semibold">
                    {new Date(selectedBusiness.account_holder_date_of_birth).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Phone</label>
                  <p className="text-gray-900 text-sm font-semibold">
                    {selectedBusiness.user.country_code} {selectedBusiness.user.phone_no}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Holder Address Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-amber-100 rounded-lg mr-3">
                  <Home className="h-5 w-5 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Account Holder Address</h4>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-900 space-y-1">
                  <p className="font-semibold text-base">{selectedBusiness.account_holder_street}</p>
                  {selectedBusiness.account_holder_street_line2 && (
                    <p className="text-gray-600">{selectedBusiness.account_holder_street_line2}</p>
                  )}
                  <p className="text-gray-700">{selectedBusiness.account_holder_city}, {selectedBusiness.account_holder_state} {selectedBusiness.account_holder_zip_code}</p>
                  <p className="font-semibold text-amber-700 text-sm">{selectedBusiness.account_holder_country}</p>
                </div>
              </div>
            </div>

            {/* ID Information Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Identity Information</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">ID Type</label>
                  <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.account_holder_id_type}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">ID Number</label>
                  <p className="text-gray-900 text-sm font-semibold font-mono">
                    {selectedBusiness.account_holder_id_number}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Status Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                  <ShieldCheck className="h-5 w-5 text-gray-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Account Status</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Merchant ID</label>
                  <p className="text-gray-900 text-sm font-semibold font-mono">{selectedBusiness.user.merchant_id}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Trial Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedBusiness.user.on_trial 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {selectedBusiness.user.on_trial ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Trial Calls Remaining</label>
                  <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.user.trial_calls_remaining}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Trial Ends</label>
                  <p className="text-gray-900 text-sm font-semibold">
                    {new Date(selectedBusiness.user.trial_ends_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Role</label>
                  <p className="text-gray-900 text-sm font-semibold">{selectedBusiness.user.role}</p>
                </div>
              </div>
            </div>

            {/* Previous verification reason */}
            {selectedBusiness.user.verification_reason && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <label className="text-sm font-semibold text-red-800">Previous Rejection Notes</label>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-red-700 text-sm leading-relaxed">{selectedBusiness.user.verification_reason}</p>
                </div>
              </div>
            )}

            {/* Documents Section */}
            {activeTab === "pending" && (
              <div className="space-y-6">
                {/* Registration Document */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4">
                    <h4 className="text-sm font-semibold flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Business Registration Document
                    </h4>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                      <div className="flex items-center min-w-0 bg-gray-50 rounded-lg p-3 flex-1 mr-3">
                        <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm truncate font-medium">
                          {selectedBusiness.registration_document_path.split('/').pop()}
                        </span>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0">
                        <button
                          onClick={() => window.open(`${selectedBusiness.registration_document_path}`, '_blank')}
                          className="flex items-center px-3 py-2 bg-gray-700 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(
                            selectedBusiness.registration_document_path,
                            `${selectedBusiness.business_name}_registration_document.${selectedBusiness.registration_document_path.split('.').pop()}`
                          )}
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
                      </div>
                    </div>
                    
                    {/* Document Preview */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="aspect-w-16 aspect-h-9">
                        {selectedBusiness.registration_document_path.toLowerCase().includes('.pdf') ? (
                          <iframe
                            src={`${selectedBusiness.registration_document_path}`}
                            className="w-full h-48 border-0 rounded-lg shadow-inner"
                            title="Registration Document Preview"
                          />
                        ) : (
                          <img
                            src={`${selectedBusiness.registration_document_path}`}
                            alt="Registration Document"
                            className="w-full h-48 object-contain rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        )}
                        <div className="hidden w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm font-medium">Preview not available</p>
                            <p className="text-gray-400 text-xs">Click view to open in new tab</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ID Document */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
                    <h4 className="text-sm font-semibold flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Account Holder ID Document
                    </h4>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                      <div className="flex items-center min-w-0 bg-gray-50 rounded-lg p-3 flex-1 mr-3">
                        <CreditCard className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm truncate font-medium">
                          {selectedBusiness.account_holder_id_document_path.split('/').pop()}
                        </span>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0">
                        <button
                          onClick={() => window.open(`${selectedBusiness.account_holder_id_document_path}`, '_blank')}
                          className="flex items-center px-3 py-2 bg-gray-700 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(
                            selectedBusiness.account_holder_id_document_path,
                            `${selectedBusiness.account_holder_first_name}_${selectedBusiness.account_holder_last_name}_id_document.${selectedBusiness.account_holder_id_document_path.split('.').pop()}`
                          )}
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
                      </div>
                    </div>
                    
                    {/* Document Preview */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="aspect-w-16 aspect-h-9">
                        {selectedBusiness.account_holder_id_document_path.toLowerCase().includes('.pdf') ? (
                          <iframe
                            src={`${selectedBusiness.account_holder_id_document_path}`}
                            className="w-full h-48 border-0 rounded-lg shadow-inner"
                            title="ID Document Preview"
                          />
                        ) : (
                          <img
                            src={`${selectedBusiness.account_holder_id_document_path}`}
                            alt="ID Document"
                            className="w-full h-48 object-contain rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        )}
                        <div className="hidden w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm font-medium">Preview not available</p>
                            <p className="text-gray-400 text-xs">Click view to open in new tab</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reject Reason Form */}
            {showRejectForm && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  <label className="text-sm font-semibold text-red-800">Reason for Rejection *</label>
                </div>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-3 border text-black border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm resize-none"
                  rows="4"
                  placeholder="Please provide a detailed reason for rejection. This will help the business understand what needs to be corrected."
                  required
                />
              </div>
            )}
          </div>   

          {/* Enhanced Action Buttons */}
          {activeTab === 'pending' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t border-gray-200">
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
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 text-sm font-semibold rounded-xl disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
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