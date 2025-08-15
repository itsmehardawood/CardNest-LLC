import React, { useState, useEffect } from 'react';

const TempDisplaySettings = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    logo: null
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Get merchant_id from localStorage userData
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        // Check both possible structures
        const userObj = parsedUserData.user || parsedUserData;
        const merchantIdValue = "mer000084" ;
        
        // console.log('Parsed userData:', parsedUserData);
        // console.log('User object:', userObj);
        // console.log('Merchant ID found:', merchantIdValue);
        
        setMerchantId(merchantIdValue);
        
        if (!merchantIdValue) {
          setSubmitError('Merchant ID not found in user data. Please contact support.');
        }
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
        setSubmitError('Unable to retrieve merchant information. Please log in again.');
      }
    } else {
      setSubmitError('User data not found. Please log in again.');
    }
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
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Removed convertToBase64 function as we'll use FormData instead

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
        console.log('Adding logo to FormData...');
        setDebugInfo('Adding logo to FormData...');
        formDataPayload.append('display_logo', formData.logo);
      }

      console.log('FormData entries:');
      for (let [key, value] of formDataPayload.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
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
        console.log('✅ Update successful');
        setSubmitSuccess(true);
        setDebugInfo('Update successful!');
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

  return (
    <div className="bg-black text-white  rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-white mb-6">
        Display Settings
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
                Error
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
                Success
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Display settings updated successfully!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Name *
          </label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder="Enter your business display name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength="100"
          />
          <p className="text-xs text-gray-500 mt-1">
            This name will be displayed to your customers
          </p>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo (Optional)
          </label>
          
          {/* Logo Preview */}
          {logoPreview && (
            <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-16 w-16 object-contain rounded-md border border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {formData.logo?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(formData.logo?.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload your business logo (JPG, PNG, GIF, SVG - Max 5MB). Recommended size: 200x200px
          </p>
        </div>


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

export default TempDisplaySettings;






// import React, { useState, useEffect } from 'react';
// import { Settings, Eye, EyeOff, User, Image } from 'lucide-react';

// const TempDisplaySettings = () => {
//   const [formData, setFormData] = useState({
//     displayName: '',
//     logo: null
//   });
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [debugInfo, setDebugInfo] = useState('');
//   const [showSettings, setShowSettings] = useState(false);
//   const [userSettings, setUserSettings] = useState(null);
//   const [settingsLoading, setSettingsLoading] = useState(false);

//   useEffect(() => {
//     // Get user_id from localStorage userData
//     const userData = localStorage.getItem('userData');
//     if (userData) {
//       try {
//         const parsedUserData = JSON.parse(userData);
//         // Extract user_id directly from the root level of parsedUserData
//         const userIdValue = parsedUserData.user_id || parsedUserData.user?.id;
        
//         console.log('Parsed userData:', parsedUserData);
//         console.log('User ID found:', userIdValue);
        
//         setUserId(userIdValue);
        
//         if (!userIdValue) {
//           setSubmitError('User ID not found in user data. Please contact support.');
//         }
//       } catch (error) {
//         console.error('Error parsing userData from localStorage:', error);
//         setSubmitError('Unable to retrieve user information. Please log in again.');
//       }
//     } else {
//       setSubmitError('User data not found. Please log in again.');
//     }
//   }, []);

//   // Auto-fetch user settings when viewing settings and userId is available
//   useEffect(() => {
//     if (showSettings && userId) {
//       fetchUserSettings(userId);
//     }
//   }, [showSettings, userId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
//       if (!validTypes.includes(file.type)) {
//         setSubmitError('Please upload a valid image file (JPG, PNG, GIF, SVG)');
//         return;
//       }

//       // Validate file size (max 5MB)
//       const maxSize = 5 * 1024 * 1024; // 5MB in bytes
//       if (file.size > maxSize) {
//         setSubmitError('Logo file size must be less than 5MB');
//         return;
//       }

//       setFormData(prev => ({
//         ...prev,
//         logo: file
//       }));

//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setLogoPreview(e.target.result);
//       };
//       reader.readAsDataURL(file);
      
//       // Clear any previous errors
//       setSubmitError(null);
//     }
//   };

//   const handleRemoveLogo = () => {
//     setFormData(prev => ({
//       ...prev,
//       logo: null
//     }));
//     setLogoPreview(null);
//     // Reset file input
//     const fileInput = document.querySelector('input[type="file"]');
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   };

//   const fetchUserSettings = async (userIdToSearch) => {
//     setSettingsLoading(true);
//     setUserSettings(null);
//     setSubmitError(null);

//     try {
//       const response = await fetch(`https://admin.cardnest.io/api/superadmin/show?user_id=${userIdToSearch}`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to fetch user settings.');
//       }

//       // Extract the data from the nested response
//       setUserSettings(data.data || data);
//     } catch (error) {
//       console.error('Error fetching user settings:', error);
//       setSubmitError(`Failed to fetch user settings: ${error.message}`);
//     } finally {
//       setSettingsLoading(false);
//     }
//   };

//   const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   const handleSubmit = async () => {
//     console.log('=== DISPLAY SETTINGS SUBMISSION ===');
//     console.log('User ID:', userId);
//     console.log('Display Name:', formData.displayName);
//     console.log('Logo file:', formData.logo?.name);
    
//     if (!userId) {
//       setSubmitError('User ID not found. Please log in again.');
//       return;
//     }

//     if (!formData.displayName.trim()) {
//       setSubmitError('Display name is required.');
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmitError(null);
//     setSubmitSuccess(false);
//     setDebugInfo('Starting submission...');

//     try {
//       // Check if API expects FormData or JSON with base64
//       // Let's try FormData approach first since that's what the error suggests
//       const formDataPayload = new FormData();
//       formDataPayload.append('user_id', userId);
//       formDataPayload.append('display_name', formData.displayName.trim());
      
//       // Only append logo if one is selected
//       if (formData.logo) {
//         console.log('Adding logo file to FormData...');
//         setDebugInfo('Adding logo to FormData...');
//         formDataPayload.append('display_logo', formData.logo);
//       }

//       console.log('FormData entries:');
//       for (let [key, value] of formDataPayload.entries()) {
//         console.log(key, value instanceof File ? `File: ${value.name}` : value);
//       }
//       setDebugInfo('Sending FormData to API...');

//       const response = await fetch('https://admin.cardnest.io/api/superadmin/store', {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           // Don't set Content-Type header - let browser set it with boundary for FormData
//         },
//         body: formDataPayload // Send FormData instead of JSON
//       });

//       console.log('API Response status:', response.status);
//       setDebugInfo(`API responded with status: ${response.status}`);

//       let result;
//       const contentType = response.headers.get('content-type');
      
//       if (contentType && contentType.includes('application/json')) {
//         result = await response.json();
//       } else {
//         const textResult = await response.text();
//         console.log('Non-JSON response:', textResult);
        
//         try {
//           result = JSON.parse(textResult);
//         } catch {
//           result = { message: textResult };
//         }
//       }

//       console.log('API Response result:', result);
      
//       if (!response.ok) {
//         if (result.errors && result.errors.display_logo) {
//           const logoErrors = Array.isArray(result.errors.display_logo) 
//             ? result.errors.display_logo.join(', ') 
//             : result.errors.display_logo;
//           throw new Error(`Logo validation failed: ${logoErrors}`);
//         }
//         throw new Error(result.message || result.error || `HTTP error! status: ${response.status}`);
//       }
      
//       if (result.status === true || result.success === true || response.ok) {
//         console.log('✅ Update successful');
//         setSubmitSuccess(true);
//         setDebugInfo('Update successful!');
        
//         // Reset form after successful submission
//         setFormData({
//           displayName: '',
//           logo: null
//         });
//         setLogoPreview(null);
        
//         // Reset file input
//         const fileInput = document.querySelector('input[type="file"]');
//         if (fileInput) {
//           fileInput.value = '';
//         }
        
//         // If we're currently viewing settings, refresh the settings data
//         if (showSettings) {
//           setTimeout(() => {
//             fetchUserSettings(userId);
//           }, 1000);
//         }
        
//         // Reset success message after 3 seconds
//         setTimeout(() => {
//           setSubmitSuccess(false);
//           setDebugInfo('');
//         }, 3000);
//       } else {
//         console.error('❌ API returned failure:', result);
//         setSubmitError(result.message || result.error || 'Failed to update display settings');
//         setDebugInfo('API returned failure');
//       }
//     } catch (error) {
//       console.error('❌ Error updating display settings:', error);
//       setSubmitError(`Failed to update display settings: ${error.message}`);
//       setDebugInfo(`Error: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const toggleSettingsView = () => {
//     setShowSettings(!showSettings);
//     if (!showSettings) {
//       setUserSettings(null);
//     }
//   };

//   const refreshSettings = () => {
//     if (userId) {
//       fetchUserSettings(userId);
//     }
//   };

//   return (
//     <div className="bg-black text-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
//       {/* Header with Toggle */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-white flex items-center gap-2">
//           {showSettings ? (
//             <>
//               <Settings className="text-blue-400" />
//               My Settings
//             </>
//           ) : (
//             <>
//               <User className="text-green-400" />
//               Update Display Settings
//             </>
//           )}
//         </h2>
        
//         <button
//           onClick={toggleSettingsView}
//           className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
//         >
//           {showSettings ? (
//             <>
//               <EyeOff size={16} />
//               Update Settings
//             </>
//           ) : (
//             <>
//               <Eye size={16} />
//               View My Settings
//             </>
//           )}
//         </button>
//       </div>

//       {/* Error Message */}
//       {submitError && (
//         <div className="mb-6 bg-red-900 border border-red-700 rounded-md p-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <span className="text-red-400">✕</span>
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-red-300">
//                 Error
//               </h3>
//               <div className="mt-2 text-sm text-red-200">
//                 <p>{submitError}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Message */}
//       {submitSuccess && (
//         <div className="mb-6 bg-green-900 border border-green-700 rounded-md p-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <span className="text-green-400">✓</span>
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-green-300">
//                 Success
//               </h3>
//               <div className="mt-2 text-sm text-green-200">
//                 <p>Display settings updated successfully!</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {!showSettings ? (
//         /* Update Display Settings Form */
//         <div className="space-y-6">
//           {/* Display Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Display Name *
//             </label>
//             <input
//               type="text"
//               name="displayName"
//               value={formData.displayName}
//               onChange={handleInputChange}
//               placeholder="Enter your business display name"
//               className="w-full px-3 py-2 border border-gray-600 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               required
//               maxLength="100"
//             />
//             <p className="text-xs text-gray-400 mt-1">
//               This name will be displayed to your customers
//             </p>
//           </div>

//           {/* Logo Upload */}
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Logo (Optional)
//             </label>
            
//             {/* Logo Preview */}
//             {logoPreview && (
//               <div className="mb-4 p-4 border border-gray-600 rounded-md bg-gray-800">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <img
//                       src={logoPreview}
//                       alt="Logo preview"
//                       className="h-16 w-16 object-contain rounded-md border border-gray-600"
//                     />
//                     <div className="ml-3">
//                       <p className="text-sm font-medium text-white">
//                         {formData.logo?.name}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         {(formData.logo?.size / 1024).toFixed(1)} KB
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleRemoveLogo}
//                     className="text-red-400 hover:text-red-300 text-sm font-medium"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* File Input */}
//             <input
//               type="file"
//               accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
//               onChange={handleLogoChange}
//               className="w-full px-3 py-2 border border-gray-600 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//             <p className="text-xs text-gray-400 mt-1">
//               Upload your business logo (JPG, PNG, GIF, SVG - Max 5MB). Recommended size: 200x200px
//             </p>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end pt-4">
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={isSubmitting || !userId}
//               className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//             >
//               {isSubmitting && (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//               )}
//               {isSubmitting ? "Updating..." : "Update Display Settings"}
//             </button>
//           </div>

      
//         </div>
//       ) : (
//         /* Settings View */
//         <div className="space-y-6">
//           {/* User Info Header */}
//           <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-medium flex items-center gap-2">
//                   <User className="text-blue-400" />
//                   My Current Settings
//                 </h3>
//                 {/* <p className="text-sm text-gray-400 mt-1">User ID: {userId || 'Not found'}</p> */}
//               </div>
              
//               <button
//                 onClick={refreshSettings}
//                 disabled={settingsLoading || !userId}
//                 className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 text-sm"
//               >
//                 {settingsLoading ? 'Loading...' : 'Refresh'}
//               </button>
//             </div>
//           </div>

//           {/* Loading State */}
//           {settingsLoading && (
//             <div className="flex items-center justify-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
//               <span className="ml-3 text-gray-400">Loading your settings...</span>
//             </div>
//           )}

//           {/* Settings Display */}
//           {userSettings && !settingsLoading && (
//             <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
//               <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
//                 <Settings className="text-green-400" />
//                 Current Settings
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="p-3 bg-black bg-opacity-60 rounded border border-gray-600">
//                   <label className="text-sm text-gray-400 font-medium">Display Name</label>
//                   <p className="text-white font-semibold">{userSettings.display_name || 'Not set'}</p>
//                 </div>
                
//                 <div className="p-3 bg-black bg-opacity-60 rounded border border-gray-600">
//                   <label className="text-sm text-gray-400 font-medium">Display Logo</label>
//                   <div className="mt-2">
//                     {userSettings.display_logo_url || userSettings.display_logo ? (
//                       <img 
//                         src={userSettings.display_logo_url || userSettings.display_logo} 
//                         alt="Display Logo" 
//                         className="w-20 h-20 object-contain rounded border border-gray-600"
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                           e.target.nextSibling.style.display = 'block';
//                         }}
//                       />
//                     ) : (
//                       <p className="text-gray-500">No logo set</p>
//                     )}
//                     <div style={{ display: 'none' }} className="text-red-400 text-sm mt-2">
//                       Failed to load image
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* No Settings Found */}
//           {!userSettings && !settingsLoading && userId && (
//             <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 text-center">
//               <Settings className="text-gray-500 mx-auto mb-3" size={48} />
//               <h3 className="text-lg font-medium text-gray-300 mb-2">No Settings Found</h3>
//               <p className="text-gray-400 mb-4">
//                 You haven't set up your display settings yet. Click "Update Settings" to get started.
//               </p>
//               <button
//                 onClick={() => setShowSettings(false)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//               >
//                 Set Up Display Settings
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TempDisplaySettings;