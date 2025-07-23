import React, { useState, useEffect } from "react";

function BusinessScreen({
  businessInfo,
  documents,
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
  const [reloadTrigger, setReloadTrigger] = useState(0); // Add this state

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

  useEffect(() => {
    fetchBusinessVerificationStatus();
  }, [reloadTrigger]); // Add reloadTrigger as dependency

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
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Business Verified Successfully
          </h2>
          <p className="text-gray-600 mb-6">
            {verificationData?.data?.verification_status}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-4">
              Verified Business Information:
            </h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <span className="font-medium text-gray-700">
                      Business Name:
                    </span>
                  </p>
                  <p className="text-gray-900">{profile?.business_name}</p>
                </div>
                <div>
                  <p>
                    <span className="font-medium text-gray-700">
                      Registration Number:
                    </span>
                  </p>
                  <p className="text-gray-900">
                    {profile?.business_registration_number}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium text-gray-700">
                      Account Holder:
                    </span>
                  </p>
                  <p className="text-gray-900">
                    {profile?.account_holder_first_name}{" "}
                    {profile?.account_holder_last_name}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p>
                  <span className="font-medium text-gray-700">
                    Business Address:
                  </span>
                </p>
                <p className="text-gray-900">
                  {profile?.street}
                  {profile?.street_line2 && `, ${profile?.street_line2}`}
                  <br />
                  {profile?.city}, {profile?.state} {profile?.zip_code}
                  <br />
                  {profile?.country}
                </p>
              </div>

              {profile?.registration_document_path && (
                <div className="border-t pt-4">
                  <p>
                    <span className="font-medium text-gray-700">
                      Registration Document:
                    </span>
                  </p>
                  <a
                    href={profile?.registration_document_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-1"
                  >
                    📄 View Document
                    <svg
                      className="w-3 h-3 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}

              <div className="border-t pt-4">
                <p>
                  <span className="font-medium text-gray-700">
                    Verification Date:
                  </span>
                </p>
                <p className="text-gray-900">
                  {new Date(profile?.updated_at).toLocaleDateString()}
                </p>
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
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Application Under Review
          </h2>
          <p className="text-gray-600 mb-6">
            Your business profile has been submitted and is currently being
            reviewed by our team.
          </p>

          {/* Success message */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-400">✓</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Your business profile has been successfully submitted!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-4">
              Submitted Information:
            </h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <span className="font-medium text-gray-700">
                      Business Name:
                    </span>
                  </p>
                  <p className="text-gray-900">{profile?.business_name}</p>
                </div>
                <div>
                  <p>
                    <span className="font-medium text-gray-700">
                      Registration Number:
                    </span>
                  </p>
                  <p className="text-gray-900">
                    {profile?.business_registration_number}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium text-gray-700">
                      Account Holder:
                    </span>
                  </p>
                  <p className="text-gray-900">
                    {profile?.account_holder_first_name}{" "}
                    {profile?.account_holder_last_name}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p>
                  <span className="font-medium text-gray-700">
                    Business Address:
                  </span>
                </p>
                <p className="text-gray-900">
                  {profile?.street}
                  {profile?.street_line2 && `, ${profile?.street_line2}`}
                  <br />
                  {profile?.city}, {profile?.state} {profile?.zip_code}
                  <br />
                  {profile?.country}
                </p>
              </div>

              {profile?.registration_document_path && (
                <div className="border-t pt-4">
                  <p>
                    <span className="font-medium text-gray-700">
                      Registration Document:
                    </span>
                  </p>
                  <a
                    href={profile?.registration_document_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-1"
                  >
                    📄 View Document
                    <svg
                      className="w-3 h-3 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}

              <div className="border-t pt-4">
                <p>
                  <span className="font-medium text-gray-700">
                    Submitted Date:
                  </span>
                </p>
                <p className="text-gray-900">
                  {new Date(profile?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleManualReload}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Check Status
            </button>
            <button
              onClick={() => router.push("/plans")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Subscriptions
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBusinessForm = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Complete Your Business Profile
        </h2>

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
          {/* Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

  return renderBusinessForm();
}

export default BusinessScreen;






