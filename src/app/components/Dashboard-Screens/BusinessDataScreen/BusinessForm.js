// components/business/BusinessForm.jsx
import React from 'react';

const BusinessForm = ({ 
  businessInfo, 
  setBusinessInfo, 
  handleInputChange, 
  handleSubmitWithReload, 
  isSubmitting, 
  submitError, 
  submitSuccess,
  status 
}) => {
  return (
  <main>
      <h2 className="text-2xl font-semibold text-white my-6 px-2">
        Complete Your Business Profile
      </h2>

      <div className="bg-black rounded-lg shadow-md border border-gray-800 p-6">
        
        {/* Error Message */}
        {submitError && (
          <div className="mb-6 bg-red-900 border border-red-700 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-300">✕</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-200">
                  Submission Failed
                </h3>
                <div className="mt-2 text-sm text-red-300">
                  <p>{submitError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-900 border border-green-700 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-300">✓</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-200">
                  Submission Successful
                </h3>
                <div className="mt-2 text-sm text-green-300">
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
          <h3 className="text-lg font-medium text-white">
            Business Information
          </h3>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                name="business_name"
                value={businessInfo.business_name}
                placeholder="e.g., ABC Corporation, Johnson & Associates LLC"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Business Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Registration Number *
              </label>
              <input
                type="text"
                name="business_registration_number"
                value={businessInfo.business_registration_number}
                placeholder="e.g., 12345678, EIN-987654321"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="business@company.com"
                value={businessInfo.email}
                onChange={handleInputChange}
                disabled={status === 'incomplete-profile'}
                className={`w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  status === 'incomplete-profile' 
                    ? 'opacity-60 cursor-not-allowed bg-gray-800' 
                    : ''
                }`}
                required 
              />
              {status === 'incomplete-profile' && (
                <p className="text-xs text-gray-400 mt-1">
                  Email is auto-filled from your account and cannot be edited
                </p>
              )}
            </div>
          </div>

          {/* Business Address */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Business Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={businessInfo.street}
                  placeholder="123 Main Street, Suite 456"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Street Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="street_line2"
                  value={businessInfo.street_line2}
                  placeholder="Building B, Floor 5, Apartment 101"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={businessInfo.city}
                  placeholder="New York"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State/Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={businessInfo.state}
                  placeholder="New York"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={businessInfo.zip_code}
                  placeholder="10001"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>



<div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
   Country *
 </label>
 <input
   type="text"
   name="country"
   value={businessInfo.country}
   onChange={handleInputChange}
   className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
   required
   placeholder="United States"
 />
</div>
            
            </div>
          </div>

          {/* Account Holder Information */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Account Holder Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="account_holder_first_name"
                  value={businessInfo.account_holder_first_name}
                  placeholder="John"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="account_holder_last_name"
                  value={businessInfo.account_holder_last_name}
                  placeholder="Smith"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="account_holder_email"
                  value={businessInfo.account_holder_email}
                  placeholder="john.smith@company.com"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium  text-gray-300 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="account_holder_date_of_birth"
                  value={businessInfo.account_holder_date_of_birth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-white text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

             <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">
   Country *
 </label>
 <input
   type="text"
   name="account_holder_country"
   value={businessInfo.account_holder_country}
   onChange={handleInputChange}
   className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
   required
   placeholder="United States"
 />
</div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="account_holder_street"
                  value={businessInfo.account_holder_street}
                  placeholder="456 Oak Avenue, Apartment 7B"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Street Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="account_holder_street_line2"
                  value={businessInfo.account_holder_street_line2}
                  placeholder="Near Central Park, Building C"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="account_holder_city"
                  value={businessInfo.account_holder_city}
                  placeholder="Los Angeles"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State/Province *
                </label>
                <input
                  type="text"
                  name="account_holder_state"
                  value={businessInfo.account_holder_state}
                  placeholder="California"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="account_holder_zip_code"
                  value={businessInfo.account_holder_zip_code}
                  placeholder="90210"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ID Type *
                </label>
                <input
                  list="id-type-options"
                  name="account_holder_id_type"
                  value={businessInfo.account_holder_id_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Passport"
                />
                <datalist id="id-type-options">
                  <option value="Passport" />
                  <option value="Driver License" />
                  <option value="National ID" />
                  <option value="State ID" />
                </datalist>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ID Number *
                </label>
                <input
                  type="text"
                  name="account_holder_id_number"
                  value={businessInfo.account_holder_id_number}
                  placeholder="e.g A12345678 write without spaces and dashes"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload ID Document *
                </label>
                <input
                  type="file"
                  name="account_holder_id_document"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Validate file type
                      if (file.type !== 'application/pdf') {
                        alert('Please upload only PDF files for ID documents');
                        e.target.value = ''; // Clear the input
                        return;
                      }
                      // Validate file size (10MB = 10 * 1024 * 1024 bytes)
                      if (file.size > 10 * 1024 * 1024) {
                        alert('File size must be less than 10MB');
                        e.target.value = ''; // Clear the input
                        return;
                      }
                    }
                    setBusinessInfo((prev) => ({
                      ...prev,
                      account_holder_id_document: file || null,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Upload a clear PDF scan of your ID document (PDF only - Max 10MB)
                </p>
                {businessInfo.account_holder_id_document && (
                  <div className="bg-gray-900 mt-2 p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        📄 {businessInfo.account_holder_id_document.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setBusinessInfo((prev) => ({
                            ...prev,
                            account_holder_id_document: null,
                          }))
                        }
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>   
            </div>
          </div>

          {/* Document Upload */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Required Documents
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Registration Document *
              </label>
              <input
                type="file"
                name="registration_document"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validate file type
                    if (file.type !== 'application/pdf') {
                      alert('Please upload only PDF files for business registration documents');
                      e.target.value = ''; // Clear the input
                      return;
                    }
                    // Validate file size (10MB = 10 * 1024 * 1024 bytes)
                    if (file.size > 10 * 1024 * 1024) {
                      alert('File size must be less than 10MB');
                      e.target.value = ''; // Clear the input
                      return;
                    }
                  }
                  handleInputChange(e);
                }}
                className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Upload your business registration certificate as PDF (PDF only - Max 10MB)
              </p>
            </div>

            {businessInfo.registration_document && (
              <div className="bg-gray-900 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
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
                    className="text-red-400 hover:text-red-300 text-sm"
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
              onClick={handleSubmitWithReload}
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

export default BusinessForm;