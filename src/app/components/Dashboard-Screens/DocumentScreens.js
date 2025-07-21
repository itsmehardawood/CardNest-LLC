import React, { useState, useEffect } from 'react';

function DocumentsScreen({ documents, setActiveTab, handleFileUpload }) {
  const [userData, setUserData] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const fetchBusinessVerificationStatus = async () => {
      try {
        const storedUser = localStorage.getItem('userData');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('User data found in localStorage:', parsedUser);
          
          // Handle nested user object structure
          const userObj = parsedUser.user || parsedUser;
          setUserData(userObj);
          
          // Fetch business verification status from API
          if (userObj.id) {
            const response = await fetch(`https://cardsecuritysystem-8xdez.ondigitalocean.app/api/business-profile/business-verification-status?user_id=${userObj.id}`);
            
            if (response.ok) {
              const data = await response.json();
              console.log('Business verification data:', data);
              setVerificationData(data);
            } else {
              console.error('Failed to fetch business verification status');
              setApiError('Failed to load business verification status');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching business verification status:', error);
        setApiError('Error loading business verification status');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessVerificationStatus();
  }, []);

  const maskEncryptionKey = (key) => {
    if (!key || key.length <= 4) return key;
    const firstTwo = key.substring(0, 2);
    const lastTwo = key.substring(key.length - 2);
    const middle = '*'.repeat(key.length - 4);
    return `${firstTwo}${middle}${lastTwo}`;
  };

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const renderCredentialsSection = () => {
    const profile = verificationData?.data?.business_profile;
    const aesKey = verificationData?.data?.aes_key;
    const verificationStatus = verificationData?.data?.business_verified;
    
    // Only show credentials if business is approved
    if (verificationStatus !== 'APPROVED' || (!profile && !aesKey)) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600">🔑</span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">API Credentials</h3>
            <p className="text-sm text-gray-600">Your merchant credentials for API integration</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Merchant ID */}
          {userData?.id && (
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Merchant ID
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <code className="text-xs sm:text-sm font-mono bg-white px-3 py-2 rounded border flex-1 break-all">
                  {userData.id}
                </code>
                <button
                  onClick={() => copyToClipboard(userData.id, 'merchantId')}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 min-w-max"
                >
                  {copiedField === 'merchantId' ? (
                    <>
                      <span className="text-xs">✓</span>
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs">📋</span>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Encryption Key */}
          {aesKey && (
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AES Encryption Key
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <code className="text-xs sm:text-sm font-mono bg-white px-3 py-2 rounded border flex-1 break-all">
                  {maskEncryptionKey(aesKey)}
                </code>
                <button
                  onClick={() => copyToClipboard(aesKey, 'aesKey')}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 min-w-max"
                >
                  {copiedField === 'aesKey' ? (
                    <>
                      <span className="text-xs">✓</span>
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs">📋</span>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Key is masked for security. Click copy to get the full key.
              </p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-2">
            <span className="text-yellow-600 text-sm">⚠️</span>
            <div>
              <p className="text-yellow-800 text-sm font-medium">Security Notice</p>
              <p className="text-yellow-700 text-xs mt-1">
                Keep your credentials secure. Never share them publicly or store them in client-side code. 
                Use environment variables in your server-side applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleUploadNew = () => {
    // Navigate to business profile component and focus on file upload
    setActiveTab('profile');
    
    // Optional: Scroll to file upload section after navigation
    setTimeout(() => {
      const fileUploadSection = document.querySelector('[data-section="document-upload"]');
      if (fileUploadSection) {
        fileUploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleCategoryClick = (category) => {
    // Navigate to business profile with category context
    console.log('Navigating to upload for category:', category);
    setActiveTab('profile');
    
    // You could also pass the category to pre-select or highlight it
    setTimeout(() => {
      const fileUploadSection = document.querySelector('[data-section="document-upload"]');
      if (fileUploadSection) {
        fileUploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleDownload = (docUrl, docName) => {
    // Download document logic here
    if (docUrl) {
      const link = document.createElement('a');
      link.href = docUrl;
      link.target = '_blank';
      link.download = docName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log('Download document:', docName);
      alert(`Downloading ${docName}...`);
    }
  };

  const handleDelete = (docName, index) => {
    // Delete document logic here
    if (window.confirm(`Are you sure you want to delete ${docName}?`)) {
      console.log('Delete document:', docName);
      // You could call a delete function passed as prop
      // removeDocument(index);
    }
  };

  const handleDirectUpload = (e) => {
    // Handle direct file upload if handleFileUpload is available
    if (handleFileUpload) {
      handleFileUpload(e);
    } else {
      // Fallback to navigating to business profile
      handleUploadNew();
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      case 'doc':
      case 'docx':
        return '📝';
      default:
        return '📄';
    }
  };

  const renderApprovedDocuments = () => {
    const profile = verificationData?.data?.business_profile;
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Verified Documents</h2>
                <p className="text-sm text-green-600">All documents have been approved</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full self-start sm:self-auto">
              APPROVED
            </div>
          </div>

          {/* Document Status */}
          <div className="mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-600">✓</span>
              <h3 className="font-medium text-green-800">Verification Complete</h3>
            </div>
            <p className="text-green-700 text-sm">
              {verificationData?.data?.verification_status || "Your business documents have been successfully verified."}
            </p>
          </div>

          {/* Uploaded Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Submitted Documents</h3>
            
            {/* Business Registration Document */}
            {profile?.registration_document_path && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-lg">📄</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Business Registration Document</p>
                    <p className="text-sm text-gray-600">Required Document</p>
                    <p className="text-xs text-gray-500">
                      Verified on {new Date(profile?.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 self-start sm:self-auto">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    ✓ Verified
                  </span>
                  <button 
                    onClick={() => handleDownload(profile?.registration_document_path, 'Business Registration Document')}
                    className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm hover:bg-blue-50 rounded"
                  >
                    View
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Business Information Summary */}
          <div className="mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Verified Business Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Business Name</p>
                <p className="font-medium text-gray-900 break-words">{profile?.business_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Registration Number</p>
                <p className="font-medium text-gray-900 break-words">{profile?.business_registration_number}</p>
              </div>
              <div>
                <p className="text-gray-600">Account Holder</p>
                <p className="font-medium text-gray-900 break-words">{profile?.account_holder_first_name} {profile?.account_holder_last_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Verification Date</p>
                <p className="font-medium text-gray-900">{new Date(profile?.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Section - Only shown for APPROVED */}
        {renderCredentialsSection()}
      </div>
    );
  };

  const renderPendingDocuments = () => {
    const profile = verificationData?.data?.business_profile;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600">⏳</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Documents Under Review</h2>
              <p className="text-sm text-yellow-600">Your documents are being verified</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full self-start sm:self-auto">
            PENDING
          </div>
        </div>

        {/* Document Status */}
        <div className="mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-600">⏳</span>
            <h3 className="font-medium text-yellow-800">Review in Progress</h3>
          </div>
          <p className="text-yellow-700 text-sm">
            Your business documents have been submitted and are currently being reviewed by our team. This process typically takes 1-3 business days.
          </p>
        </div>

        {/* Submitted Documents */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Submitted Documents</h3>
          
          {/* Business Registration Document */}
          {profile?.registration_document_path && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📄</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Business Registration Document</p>
                  <p className="text-sm text-gray-600">Required Document</p>
                  <p className="text-xs text-gray-500">
                    Submitted on {new Date(profile?.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 self-start sm:self-auto">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  ⏳ Under Review
                </span>
                <button 
                  onClick={() => handleDownload(profile?.registration_document_path, 'Business Registration Document')}
                  className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm hover:bg-blue-50 rounded"
                >
                  View
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Business Information Summary */}
        <div className="mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Submitted Business Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Business Name</p>
              <p className="font-medium text-gray-900 break-words">{profile?.business_name}</p>
            </div>
            <div>
              <p className="text-gray-600">Registration Number</p>
              <p className="font-medium text-gray-900 break-words">{profile?.business_registration_number}</p>
            </div>
            <div>
              <p className="text-gray-600">Account Holder</p>
              <p className="font-medium text-gray-900 break-words">{profile?.account_holder_first_name} {profile?.account_holder_last_name}</p>
            </div>
            <div>
              <p className="text-gray-600">Submission Date</p>
              <p className="font-medium text-gray-900">{new Date(profile?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRegularDocumentsScreen = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Documents</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Direct upload option if handleFileUpload is available */}
            {handleFileUpload && (
              <label className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm cursor-pointer text-center">
                Quick Upload
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleDirectUpload}
                  className="hidden"
                />
              </label>
            )}
            <button 
              onClick={handleUploadNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Upload New
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-md space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 text-sm">{getFileIcon(doc.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-700 break-words">{doc.name}</span>
                    <p className="text-xs text-gray-500">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 self-start sm:self-auto">
                  <button 
                    onClick={() => handleDownload(doc.url, doc.name)}
                    className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm hover:bg-blue-50 rounded"
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.name, index)}
                    className="px-3 py-1 text-red-600 hover:text-red-800 text-sm hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📁</span>
              </div>
              <p className="text-gray-600 mb-4">No documents uploaded yet</p>
              <p className="text-gray-500 text-sm mb-4 px-4">
                Upload your business documents to complete your profile
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                  onClick={handleUploadNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Go to Business Profile
                </button>
                {handleFileUpload && (
                  <label className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm cursor-pointer text-center">
                    Quick Upload Here
                    <input 
                      type="file" 
                      multiple 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleDirectUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Document Categories */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Categories</h3>
          <p className="text-gray-600 text-sm mb-4 px-1">Click on a category to upload documents for that type</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div 
              onClick={() => handleCategoryClick('business-registration')}
              className="text-center p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
            >
              <div className="text-2xl mb-2">🏢</div>
              <p className="text-xs sm:text-sm text-gray-600">Business Registration</p>
              <p className="text-xs text-gray-500 mt-1">Required</p>
            </div>
            <div 
              onClick={() => handleCategoryClick('identity')}
              className="text-center p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
            >
              <div className="text-2xl mb-2">🆔</div>
              <p className="text-xs sm:text-sm text-gray-600">Identity Documents</p>
              <p className="text-xs text-gray-500 mt-1">Optional</p>
            </div>
            <div 
              onClick={() => handleCategoryClick('financial')}
              className="text-center p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
            >
              <div className="text-2xl mb-2">💰</div>
              <p className="text-xs sm:text-sm text-gray-600">Financial Documents</p>
              <p className="text-xs text-gray-500 mt-1">Optional</p>
            </div>
            <div 
              onClick={() => handleCategoryClick('other')}
              className="text-center p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
            >
              <div className="text-2xl mb-2">📋</div>
              <p className="text-xs sm:text-sm text-gray-600">Other Documents</p>
              <p className="text-xs text-gray-500 mt-1">Optional</p>
            </div>
          </div>
        </div>

        {/* Upload Requirements */}
        <div className="mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Upload Requirements</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Accepted formats: PDF, DOC, DOCX, JPG, PNG</li>
            <li>• Maximum file size: 10MB per file</li>
            <li>• Business registration document is required</li>
            <li>• Ensure documents are clear and readable</li>
          </ul>
        </div>
      </div>
    );
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document verification status...</p>
        </div>
      </div>
    );
  }

  // Show error state if API call failed
  if (apiError) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6 px-4">{apiError}</p>
          <button 
            onClick={() => window.location.reload()}
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
  
  if (verificationStatus === 'APPROVED') {
    return renderApprovedDocuments();
  }
  
  if (verificationStatus === 'PENDING') {
    return renderPendingDocuments();
  }

  return renderRegularDocumentsScreen();
}

export default DocumentsScreen;