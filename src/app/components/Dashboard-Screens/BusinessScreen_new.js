/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, Building, User, Shield, FileText, Calendar, RotateCcw, Eye } from 'lucide-react';
import {ExternalLink } from 'lucide-react';
function BusinessScreen({
  businessInfo,
  documents,
  setBusinessInfo,
  status,
  isSubmitting,
  submitError,
  submitSuccess,
  handleInputChange,
  handleFileUpload,
  removeDocument,
  handleSubmit,
  router,
}) {
  const [userData, setUserData] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  // Extract the API fetch logic into a separate function
  const fetchBusinessVerificationStatus = async () => {
    try {
      setLoading(true); // Set loading when refetching
      const storedUser = localStorage.getItem("userData");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("User data found in localStorage:", parsedUser);

        // Handle nested user object structure
        const userObj = parsedUser.user || parsedUser;
        setUserData(userObj);

        // Fetch business verification status from API
        if (userObj.id) {
          const response = await fetch(
            `https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/business-verification-status?user_id=${userObj.id}`
          );
      
          if (response.ok) {
            const data = await response.json();
            console.log("Business verification data:", data);
            setVerificationData(data);
            setApiError(null); // Clear any previous errors
          } else {
            console.error("Failed to fetch business verification status");
            setApiError("Failed to load business verification status");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching business verification status:", error);
      setApiError("Error loading business verification status");
    } finally {
      setLoading(false);
    }
  };

//For autofill data from API in input fields 

useEffect(() => {
  fetchBusinessVerificationStatus();
}, [reloadTrigger]); // Separate useEffect for API call

useEffect(() => { 
  const profile = verificationData?.data?.business_profile;
  
  //when 'incomplete' status
  if (status === 'incomplete' && profile) {
    setBusinessInfo({
      business_name: profile.business_name || '',
      business_registration_number: profile.business_registration_number || '',
      email: userData.email || '',
      street: profile.street || '',
      street_line2: profile.street_line2 || '',
      city: profile.city || '',
      state: profile.state || '',
      zip_code: profile.zip_code || '',
      country: profile.country || '',
      account_holder_first_name: profile.account_holder_first_name || '',
      account_holder_last_name: profile.account_holder_last_name || '',
      account_holder_email: profile.account_holder_email || '',
      account_holder_date_of_birth: profile.account_holder_date_of_birth || '',
      account_holder_street: profile.account_holder_street || '',
      account_holder_street_line2: profile.account_holder_street_line2 || '',
      account_holder_city: profile.account_holder_city || '',
      account_holder_state: profile.account_holder_state || '',
      account_holder_zip_code: profile.account_holder_zip_code || '',
      account_holder_country: profile.account_holder_country || '',
      account_holder_id_type: profile.account_holder_id_type || '',
      account_holder_id_number: profile.account_holder_id_number || '',
      account_holder_id_document: null, // Add this field
      registration_document: null // always empty for re-upload
    });
  }
  // to autofill email when user SignUp first-time and route to dashboard form
  else if (status === 'incomplete-profile') {
    const localData = localStorage.getItem('userData');
  
    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        console.log('Parsed userData:', parsedData);
        const userEmail = parsedData?.user?.email || ''; // ← nested inside `user`
        console.log('Extracted email:', userEmail);
        
        setBusinessInfo((prev) => ({
          ...prev,
          email: userEmail,
        }));
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }
}, [status, verificationData]); // Add verificationData as dependency


  // Enhanced submit handler that triggers reload
  const handleSubmitWithReload = async () => {
    try {
      await handleSubmit(); // Call the original submit function
      
      // Wait a bit for the server to process the submission
      setTimeout(() => {
        setReloadTrigger(prev => prev + 1); // Trigger reload by updating state
      }, 1000); // 2 second delay to allow server processing
      
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  // Manual reload function for retry button
  const handleManualReload = () => {
    setReloadTrigger(prev => prev + 1);
  };

 

const renderApprovedStatus = () => {
  const profile = verificationData?.data?.business_profile;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-slate-800 rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold  text-white mb-2">
              Business Verified Successfully
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {verificationData?.data?.verification_status}
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gray-50 border-b bg-slate-700 border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <FileText className="w-5 h-5  mr-2" />
              Verified Business Information
            </h2>
          </div>

          <div className="p-6">
            {/* Business Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Business Name</label>
                  <p className="text-base font-semibold text-gray-900">
                    {profile?.business_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Registration Number</label>
                  <p className="text-base text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-md">
                    {profile?.business_registration_number}
                  </p>
                </div>
                  <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Account Holder Email</label>
                  <p className="text-base text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-md">
                    {profile?.account_holder_email}
                  </p>
                </div>
             
               
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Account Holder</label>
                  <p className="text-base font-semibold text-gray-900">
                    {profile?.account_holder_first_name} {profile?.account_holder_last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1"> Business Email</label>
                  <p className="text-base text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-md">
                    {profile?.email}
                  </p>
                </div>
              
          
              </div>
            </div>

            {/* Business Address Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                <Building className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-base font-semibold text-gray-900">Business Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Street Address</label>
                  <p className="text-sm text-gray-900">
                    {profile?.street}
                    {profile?.street_line2 && `, ${profile?.street_line2}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">City</label>
                  <p className="text-sm text-gray-900">{profile?.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">State</label>
                  <p className="text-sm text-gray-900">{profile?.state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">ZIP Code</label>
                  <p className="text-sm text-gray-900 font-mono">{profile?.zip_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Country</label>
                  <p className="text-sm text-gray-900">{profile?.country}</p>
                </div>
              </div>
            </div>

            {/* Account Holder Address Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                <User className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-base font-semibold text-gray-900">Account Holder Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Street Address</label>
                  <p className="text-sm text-gray-900">
                    {profile?.account_holder_street}
                    {profile?.account_holder_street_line2 && `, ${profile?.account_holder_street_line2}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">City</label>
                  <p className="text-sm text-gray-900">{profile?.account_holder_city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">State</label>
                  <p className="text-sm text-gray-900">{profile?.account_holder_state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">ZIP Code</label>
                  <p className="text-sm text-gray-900 font-mono">{profile?.account_holder_zip_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Country</label>
                  <p className="text-sm text-gray-900">{profile?.account_holder_country}</p>
                </div>
              </div>
            </div>

            {/* KYC Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                <Shield className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-base font-semibold text-gray-900">KYC Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">ID Type</label>
                  <p className="text-sm text-gray-900">{profile?.account_holder_id_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">ID Number</label>
                  <p className="text-sm text-gray-900 font-mono">{profile?.account_holder_id_number}</p>
                </div>
              </div>
              
              {/* Document Links */}
              <div className="space-y-3">
                {profile?.account_holder_id_document_path && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">ID Document</label>
                    <a
                      href={profile?.account_holder_id_document_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Document
                    </a>
                  </div>
                )}
                
                {profile?.registration_document_path && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">Registration Document</label>
                    <a
                      href={profile?.registration_document_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
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
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Verification Date</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(profile?.updated_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
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






const renderPendingStatus = () => {
  const profile = verificationData?.data?.business_profile;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Application Under Review
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your business profile has been submitted and is currently being reviewed by our team. 
              We will notify you once the review is complete.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-green-800 font-medium">
                Your business profile has been successfully submitted!
              </p>
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 text-gray-600 mr-2" />
              Submitted Information
            </h2>
          </div>

          <div className="p-6">
            {/* Business Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Business Name</label>
                  <p className="text-base font-semibold text-gray-900">
                    {profile?.business_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Registration Number</label>
                  <p className="text-base text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-md">
                    {profile?.business_registration_number}
                  </p>
                </div>
                  

              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Account Holder</label>
                  <p className="text-base font-semibold text-gray-900">
                    {profile?.account_holder_first_name} {profile?.account_holder_last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1"> Business Email</label>
                  <p className="text-base text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-md">
                    {userData?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Address Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                <Building className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-base font-semibold text-gray-900">Business Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Street Address</label>
                  <p className="text-sm text-gray-900">
                    {profile?.street}
                    {profile?.street_line2 && `, ${profile?.street_line2}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">City</label>
                  <p className="text-sm text-gray-900">{profile?.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">State</label>
                  <p className="text-sm text-gray-900">{profile?.state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">ZIP Code</label>
                  <p className="text-sm text-gray-900 font-mono">{profile?.zip_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Country</label>
                  <p className="text-sm text-gray-900">{profile?.country}</p>
                </div>
              </div>
            </div>

            {/* Account Holder Address Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                <User className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-base font-semibold text-gray-900">Account Holder Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Street Address</label>
                  <p className="text-sm text-gray-900">
                    {profile?.account_holder_street}
                    {profile?.account_holder_street_line2 && `, ${profile?.account_holder_street_line2}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">City</label>
                  <p className="text-sm text-gray-900">{profile?.account_holder_city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">State</label>
                  <p className="text-sm text-gray-900">{profile?.account_holder_state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">ZIP Code</label>
                  <p className="text-sm text-gray-900 font-mono">{profile?.account_holder_zip_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Country</label>
                  <p className="text-sm text-gray-900">{profile?.account_holder_country}</p>
                </div>
              </div>
            </div>

            {/* KYC Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                <Shield className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-base font-semibold text-gray-900">KYC Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">ID Type</label>
                  <p className="text-sm text-gray-900">{profile?.account_holder_id_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">ID Number</label>
                  <p className="text-sm text-gray-900 font-mono">{profile?.account_holder_id_number}</p>
                </div>
              </div>
              
              {/* Document Links */}
              <div className="space-y-3">
                {profile?.account_holder_id_document_path && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">ID Document</label>
                    <a
                      href={profile?.account_holder_id_document_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Document
                    </a>
                  </div>
                )}
                
                {profile?.registration_document_path && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">Registration Document</label>
                    <a
                      href={profile?.registration_document_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Document
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted Date</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(profile?.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <button
            onClick={handleManualReload}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Check Status
          </button>
          <button
            onClick={() => router.push("/plans")}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 hover:border-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Subscriptions
          </button>
        </div>
      </div>
    </div>
  );
};


  const renderBusinessForm = () => {
    return (
      <main>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Complete Your Business Profile
        </h2>

      <div className="bg-white rounded-lg shadow-md  p-6">
        
        {/* Error Message */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">✕</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Submission Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{submitError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400">✓</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Submission Successful
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your business profile has been submitted successfully and is
                    under review. Refreshing status...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Section Heading */}
          <h3 className="text-lg font-medium text-gray-900">
            Business Information
          </h3>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={businessInfo.business_name}
                  placeholder="Enter your business name"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Business Registration Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Registration Number *
                </label>
                <input
                  type="text"
                  name="business_registration_number"
                  value={businessInfo.business_registration_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter the same email you entered while signing up"
                  value={businessInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required 
                />
              </div>
            </div>

          {/* Business Address */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Business Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={businessInfo.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="street_line2"
                  value={businessInfo.street_line2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={businessInfo.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={businessInfo.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={businessInfo.zip_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  list="country-options"
                  name="country"
                  value={businessInfo.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter your country"
                  
                />
                <datalist id="country-options">
                  <option value="United States" />
                  <option value="Canada" />
                  <option value="United Kingdom" />
                  <option value="France" />
                  <option value="India" />
                  <option value="Pakistan" />
                  <option value="France" />
                  <option value="Others" />
                </datalist>
              </div>
            </div>
          </div>
            {/* Account Holder Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Holder Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="account_holder_first_name"
                    value={businessInfo.account_holder_first_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="account_holder_last_name"
                    value={businessInfo.account_holder_last_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="account_holder_email"
                    value={businessInfo.account_holder_email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth (YYYY-MM-DD) *
                  </label>
                  <input
                    type="date"
                    name="account_holder_date_of_birth"
                    value={businessInfo.account_holder_date_of_birth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="account_holder_country"
                    value={businessInfo.account_holder_country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a country</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="India">India</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="account_holder_street"
                    value={businessInfo.account_holder_street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="account_holder_street_line2"
                    value={businessInfo.account_holder_street_line2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="account_holder_city"
                    value={businessInfo.account_holder_city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    name="account_holder_state"
                    value={businessInfo.account_holder_state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="account_holder_zip_code"
                    value={businessInfo.account_holder_zip_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Type *
                  </label>
                  <input
                    list="id-type-options"
                    name="account_holder_id_type"
                    value={businessInfo.account_holder_id_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g. Passport"
                  />
                  <datalist id="id-type-options">
                    <option value="Passport" />
                    <option value="Driver License" />
                    <option value="National ID" />
                  </datalist>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    name="account_holder_id_number"
                    value={businessInfo.account_holder_id_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload ID Document *
                  </label>
                  <input
                    type="file"
                    name="account_holder_id_document"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        account_holder_id_document: e.target.files?.[0] || null,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  {businessInfo.account_holder_id_document && (
                    <div className="bg-gray-50 mt-2 p-2 rounded text-sm text-gray-700">
                      📄 {businessInfo.account_holder_id_document.name}
                    </div>
                  )}
                </div>   
              </div>
            </div>

          {/* Document Upload */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Required Documents
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Registration Document *
              </label>
              <input
                type="file"
                name="registration_document"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Required: Business Registration Document (PDF, DOC, DOCX, JPG,
                JPEG, PNG)
              </p>
            </div>

            {businessInfo.registration_document && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    📄 {businessInfo.registration_document.name}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        registration_document: null,
                      }))
                    }
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="button"
              onClick={handleSubmitWithReload} // Use the enhanced submit handler
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {isSubmitting ? "Submitting..." : "Submit Business Profile"}
            </button>
          </div>
        </div>
      </div>
      </main>
    );
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading business verification status...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if API call failed
  if (apiError) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-6">{apiError}</p>
          <button
            onClick={handleManualReload} // Use the manual reload function
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check verification status and render appropriate view
  const verificationStatus = verificationData?.data?.business_verified;

  if (verificationStatus === "APPROVED") {
    return renderApprovedStatus();
  }

  if (verificationStatus === "PENDING" || status === "pending") {
    return renderPendingStatus();
  }

  // if (verificationStatus === "Incomplete" || status === "incomplete") {
  //   return renderIncompleteStatus();
  // }

  return renderBusinessForm();
}

export default BusinessScreen;


