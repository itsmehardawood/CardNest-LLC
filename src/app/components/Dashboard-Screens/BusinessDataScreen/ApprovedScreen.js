// components/business/ApprovedStatus.jsx
import React from 'react';
import { CheckCircle, Building, User, Shield, FileText, Calendar, Eye, ExternalLink } from 'lucide-react';

const ApprovedStatus = ({ verificationData }) => {
  const profile = verificationData?.data?.business_profile;

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-slate-800 rounded-xl shadow-sm border border-gray-700 p-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              Business Verified Successfully
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {verificationData?.data?.verification_status }
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-black rounded-xl shadow-sm border border-gray-800 overflow-hidden">
          {/* Card Header */}
          <div className="bg-slate-700 border-b border-gray-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Verified Business Information
            </h2>
          </div>

          <div className="p-6">
            {/* Business Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Business Name</label>
                  <p className="text-base font-semibold text-white">
                    {profile?.business_name || 'null'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Registration Number</label>
                  <p className="text-base text-white font-mono bg-gray-900 px-3 py-2 rounded-md">
                    {profile?.business_registration_number || 'null'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Account Holder Email</label>
                  <p className="text-base text-white font-mono bg-gray-900 px-3 py-2 rounded-md">
                    {profile?.account_holder_email || 'null'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Account Holder</label>
                  <p className="text-base font-semibold text-white">
                    {(profile?.account_holder_first_name && profile?.account_holder_last_name) 
                      ? `${profile?.account_holder_first_name} ${profile?.account_holder_last_name}` 
                      : 'null'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Business Email</label>
                  <p className="text-base text-white font-mono bg-gray-900 px-3 py-2 rounded-md">
                    {profile?.email || 'null'}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Address Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-700">
                <Building className="w-5 h-5 text-gray-300 mr-2" />
                <h3 className="text-base font-semibold text-white">Business Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Street Address</label>
                  <p className="text-sm text-white">
                    {profile?.street 
                      ? `${profile?.street}${profile?.street_line2 ? `, ${profile?.street_line2}` : ''}` 
                      : 'null'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">City</label>
                  <p className="text-sm text-white">{profile?.city || 'null'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">State</label>
                  <p className="text-sm text-white">{profile?.state || 'null'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">ZIP Code</label>
                  <p className="text-sm text-white font-mono">{profile?.zip_code || 'null'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Country</label>
                  <p className="text-sm text-white">{profile?.country || 'null'}</p>
                </div>
              </div>
            </div>

            {/* Account Holder Address Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-700">
                <User className="w-5 h-5 text-gray-300 mr-2" />
                <h3 className="text-base font-semibold text-white">Account Holder Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Street Address</label>
                  <p className="text-sm text-white">
                    {profile?.account_holder_street 
                      ? `${profile?.account_holder_street}${profile?.account_holder_street_line2 ? `, ${profile?.account_holder_street_line2}` : ''}`
                      : 'null'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">City</label>
                  <p className="text-sm text-white">{profile?.account_holder_city || 'null'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">State</label>
                  <p className="text-sm text-white">{profile?.account_holder_state || 'null'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">ZIP Code</label>
                  <p className="text-sm text-white font-mono">{profile?.account_holder_zip_code || 'null'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Country</label>
                  <p className="text-sm text-white">{profile?.account_holder_country || 'null'}</p>
                </div>
              </div>
            </div>

            {/* KYC Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-700">
                <Shield className="w-5 h-5 text-gray-300 mr-2" />
                <h3 className="text-base font-semibold text-white">KYC Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">ID Type</label>
                  <p className="text-sm text-white">{profile?.account_holder_id_type || 'null'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">ID Number</label>
                  <p className="text-sm text-white font-mono">{profile?.account_holder_id_number || 'null'}</p>
                </div>
              </div>
              
              {/* Document Links */}
              <div className="space-y-3">
                {profile?.account_holder_id_document_path && (
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-2">ID Document</label>
                    <a
                      href={profile?.account_holder_id_document_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-200 bg-blue-900 border border-blue-700 rounded-md hover:bg-blue-800 hover:border-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Document
                    </a>
                  </div>
                )}
                
                {profile?.registration_document_path && (
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-2">Registration Document</label>
                    <a
                      href={profile?.registration_document_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-200 bg-blue-900 border border-blue-700 rounded-md hover:bg-blue-800 hover:border-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Document
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Details */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-300 mr-2" />
                <div>
                  <label className="text-sm font-medium text-gray-400">Verification Date</label>
                  <p className="text-sm font-semibold text-white">
                    {profile?.updated_at 
                      ? new Date(profile?.updated_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'null'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedStatus;