import React, { useState, useEffect } from 'react';

const DisplaySettings = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    logo: null
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  // Function to fetch existing merchant display info
const fetchMerchantDisplayInfo = async (merchantIdValue) => {
  try {
    setDebugInfo('Fetching existing display info...');
    
    const response = await fetch(`https://admin.cardnest.io/api/getmerchantDisplayInfo?merchantId=${encodeURIComponent(merchantIdValue)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // console.log('GET API Response status:', response.status);
    
    let result;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const textResult = await response.text();
      // console.log('Non-JSON response:', textResult);
      
      try {
        result = JSON.parse(textResult);
      } catch {
        result = { message: textResult };
      }
    }

    // console.log('GET API Response result:', result);

    if (response.ok && (result.status === true || result.success === true)) {
      // Pre-populate form with existing data
      if (result.data) {
        const { display_name, display_logo } = result.data;
        
        if (display_name) {
          setFormData(prev => ({
            ...prev,
            displayName: display_name
          }));
        }
        
        if (display_logo) {
          setExistingLogoUrl(display_logo);
          setLogoPreview(display_logo);
        }
        
        setDebugInfo('Existing data loaded successfully');
      } else {
        setDebugInfo('No existing data found');
      }
    } else {
      // console.log('No existing data or API error:', result.message || 'Unknown error');
      setDebugInfo('No existing data found or API error');
    }
  } catch (error) {
    console.error('Error fetching merchant display info:', error);
    setDebugInfo(`Error fetching data: ${error.message}`);
    // Don't set this as a submit error since it's just for loading existing data
  }
};

  useEffect(() => {
    const initializeComponent = async () => {
      setIsLoading(true);
      
      // Get merchant_id from localStorage userData
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          // Check both possible structures
          const userObj = parsedUserData.user || parsedUserData;
          const merchantIdValue = userObj.merchant_id || userObj.merchantId;
          
          // console.log('Parsed userData:', parsedUserData);
          // console.log('User object:', userObj);
          // console.log('Merchant ID found:', merchantIdValue);
          
          setMerchantId(merchantIdValue);
          
          if (merchantIdValue) {
            // Fetch existing display info
            await fetchMerchantDisplayInfo(merchantIdValue);
          } else {
            setSubmitError('Merchant ID not found in user data. Please contact support.');
          }
        } catch (error) {
          console.error('Error parsing userData from localStorage:', error);
          setSubmitError('Unable to retrieve merchant information. Please log in again.');
        }
      } else {
        setSubmitError('User data not found. Please log in again.');
      }
      
      setIsLoading(false);
    };

    initializeComponent();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - match what API expects
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setSubmitError('Please upload a valid image file (JPG, PNG, GIF, SVG)');
        return;
      }

      // Validate file size (max 5MB since we're not converting to base64)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setSubmitError('Logo file size must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        logo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setExistingLogoUrl(null); // Clear existing logo URL when new file is selected
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setSubmitError(null);
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null
    }));
    setLogoPreview(null);
    setExistingLogoUrl(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async () => {
    // console.log('=== DISPLAY SETTINGS SUBMISSION ===');
    // console.log('Merchant ID:', merchantId);
    // console.log('Display Name:', formData.displayName);
    // console.log('Logo file:', formData.logo?.name);
    
    if (!merchantId) {
      setSubmitError('Merchant ID not found. Please log in again.');
      return;
    }

    if (!formData.displayName.trim()) {
      setSubmitError('Display name is required.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setDebugInfo('Starting submission...');

    try {
      // Prepare FormData for file upload
      const formDataPayload = new FormData();
      formDataPayload.append('merchant_id', merchantId);
      formDataPayload.append('display_name', formData.displayName.trim());
      
      // Only append logo if one is selected
      if (formData.logo) {
        // console.log('Adding logo to FormData...');
        setDebugInfo('Adding logo to FormData...');
        formDataPayload.append('display_logo', formData.logo);
      }

      // console.log('FormData entries:');
      for (let [key, value] of formDataPayload.entries()) {
        // console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }
      setDebugInfo('Sending FormData to API...');

      // Use FormData instead of JSON
      const response = await fetch('https://admin.cardnest.io/api/updateMerchantScanInfo', {
        method: 'POST',
        // Don't set Content-Type header - let browser set it with boundary for FormData
        headers: {
          'Accept': 'application/json',
          // Remove Content-Type to let browser set it automatically for FormData
        },
        body: formDataPayload // Send FormData instead of JSON
      });

      // console.log('API Response status:', response.status);
      // console.log('API Response ok:', response.ok);
      setDebugInfo(`API responded with status: ${response.status}`);

      // Handle different response types and show detailed error info
      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const textResult = await response.text();
        // console.log('Non-JSON response:', textResult);
        
        // Try to parse as JSON anyway (some APIs return JSON with wrong content-type)
        try {
          result = JSON.parse(textResult);
        } catch {
          result = { message: textResult };
        }
      }

      // console.log('API Response result:', result);
      
      if (!response.ok) {
        // Handle detailed validation errors
        if (result.errors && result.errors.display_logo) {
          const logoErrors = Array.isArray(result.errors.display_logo) 
            ? result.errors.display_logo.join(', ') 
            : result.errors.display_logo;
          throw new Error(`Logo validation failed: ${logoErrors}`);
        }
        throw new Error(result.message || result.error || `HTTP error! status: ${response.status}`);
      }
      
      if (result.status === true || result.success === true || response.ok) {
        // console.log('✅ Update successful');
        setSubmitSuccess(true);
        setDebugInfo('Update successful!');
        
        // Update existing logo URL if a new logo was uploaded
        if (formData.logo && result.data && result.data.display_logo) {
          setExistingLogoUrl(result.data.display_logo);
        }
        
        // Reset file input but keep the display name and existing logo
        setFormData(prev => ({
          ...prev,
          logo: null
        }));
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
          setDebugInfo('');
        }, 3000);
      } else {
        console.error('❌ API returned failure:', result);
        setSubmitError(result.message || result.error || 'Failed to update display settings');
        setDebugInfo('API returned failure');
      }
    } catch (error) {
      console.error('❌ Error updating display settings:', error);
      setSubmitError(`Failed to update display settings: ${error.message}`);
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
 if (isLoading) {
    return (
      <div className="bg-black rounded-lg shadow-md  p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-gray-300">Loading display settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg shadow-md border border-gray-800 p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-white mb-6">
        Display Settings
      </h2>

      {/* Error Message */}
      {submitError && (
        <div className="mb-6 bg-red-900 border border-red-700 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-300">✕</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-200">
                Error
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
                Success
              </h3>
              <div className="mt-2 text-sm text-green-300">
                <p>Display settings updated successfully!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Display Name *
          </label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder="Enter your business display name"
            className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength="100"
          />
          <p className="text-xs text-gray-400 mt-1">
            This name will be displayed to your customers
          </p>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Logo (Optional)
          </label>
          
          {/* Logo Preview - Show either existing logo or new upload preview */}
          {(logoPreview || existingLogoUrl) && (
            <div className="mb-4 p-4 border border-gray-700 rounded-md bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={logoPreview || existingLogoUrl}
                    alt="Logo preview"
                    className="h-16 w-16 object-contain rounded-md border border-gray-600"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {formData.logo?.name || (existingLogoUrl ? 'Current Logo' : 'Logo Preview')}
                    </p>
                    {formData.logo && (
                      <p className="text-xs text-gray-400">
                        {(formData.logo.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                    {existingLogoUrl && !formData.logo && (
                      <p className="text-xs text-gray-400">
                        Existing logo
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* File Input */}
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
            onChange={handleLogoChange}
            className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Upload your business logo (JPG, PNG, GIF, SVG - Max 5MB). Recommended size: 200x200px
            {existingLogoUrl && !formData.logo && (
              <span className="block text-blue-400 mt-1">
                A logo is already uploaded. Choose a new file to replace it.
              </span>
            )}
          </p>
        </div>

        {/* Merchant ID Display */}
        {/* {merchantId && (
          <div className="bg-gray-900 p-3 rounded-md">
            <p className="text-xs text-gray-300">
              <span className="font-medium">Merchant ID:</span> {merchantId}
            </p>
          </div>
        )} */}

        {/* Debug Info */}
        {/* <div className="bg-blue-900 p-3 rounded-md">
          <p className="text-xs text-blue-300">
            <span className="font-medium">Debug Info:</span><br/>
            Merchant ID: {merchantId || 'Not found'}<br/>
            Display Name: {formData.displayName || 'Empty'}<br/>
            Logo: {formData.logo ? formData.logo.name : (existingLogoUrl ? 'Existing logo loaded' : 'None')}<br/>
            Status: {debugInfo || 'Ready'}
          </p>
        </div> */}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !merchantId}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {isSubmitting ? "Updating..." : "Update Display Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;