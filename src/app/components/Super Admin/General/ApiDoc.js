// import { apiFetch } from "@/app/lib/api.js";
// import React, { useState } from "react";

// const APIDocumentationSection = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     type: "PDF",
//     file: null
//   });
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [documents, setDocuments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Base URL for API calls

//   // Fetch existing documentation
//   const fetchDocuments = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//       const merchantId = userData.user?.merchant_id;

//       if (!merchantId) {
//         throw new Error('Merchant ID not found in UserData');
//       }

//       const response = await apiFetch(`/superadmin/getDocumentation?merchant_id=${merchantId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setDocuments(result.data || []);
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to fetch documents');
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//       setError(error.message || 'An error occurred while fetching documents.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch documents on component mount
//   React.useEffect(() => {
//     fetchDocuments();
//   }, []);

//   // Format date for display
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Handle file download
//   const handleDownload = (fileUrl, fileName) => {
//     const link = document.createElement('a');
//     link.href = fileUrl;
//     link.download = fileName;
//     link.target = '_blank';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({
//         ...prev,
//         file: file
//       }));
//     }
//   };

//   // Convert file to base64
//   const convertFileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         // Remove the data URL prefix to get just the base64 string
//         const base64String = reader.result.split(',')[1];
//         resolve(base64String);
//       };
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.file) {
//       setUploadStatus({ type: 'error', message: 'Please select a file to upload.' });
//       return;
//     }

//     setIsUploading(true);
//     setUploadStatus(null);

//     try {
//       // Get merchant_id from localStorage
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//       const merchantId = userData.user?.merchant_id;

//       if (!merchantId) {
//         throw new Error('Merchant ID not found in UserData');
//       }

//       // Convert file to base64
//       const fileBase64 = await convertFileToBase64(formData.file);

//       // Prepare the request body
//       const requestBody = {
//         merchant_id: merchantId,
//         title: formData.title,
//         description: formData.description,
//         type: formData.type,
//         fileName: formData.file.name,
//         fileType: formData.file.type,
//         fileBase: fileBase64
//       };

//       // Make API call
//       const response = await apiFetch(`/superadmin/uploadDocumentation`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody)
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setUploadStatus({ type: 'success', message: 'Documentation uploaded successfully!' });
//         // Reset form
//         setFormData({
//           title: "",
//           description: "",
//           type: "PDF",
//           file: null
//         });
//         // Reset file input
//         document.getElementById('file-input').value = '';
//         // Refresh documents list
//         fetchDocuments();
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Upload failed');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       setUploadStatus({ 
//         type: 'error', 
//         message: error.message || 'An error occurred while uploading the documentation.' 
//       });
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg text-black min-h-screen shadow-sm border p-4 md:p-6">
//       <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
//         API Documentation & Integration
//       </h2>

//       <div className="space-y-6 md:space-y-8">
//         {/* Upload Documentation Form */}
//         <div className="bg-gray-50 rounded-lg p-4 md:p-6">
//           <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-4">
//             Upload Documentation
//           </h3>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Title and Description - Responsive Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
//                   placeholder="Enter documentation title"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
//                   Document Type
//                 </label>
//                 <select
//                   id="type"
//                   name="type"
//                   value={formData.type}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
//                 >
//                   <option value="PDF">PDF</option>
//                   <option value="DOC">DOC</option>
//                   <option value="DOCX">DOCX</option>
//                   <option value="TXT">TXT</option>
//                   <option value="MD">Markdown</option>
//                 </select>
//               </div>
//             </div>

//             {/* Description Input */}
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="3"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
//                 placeholder="Enter documentation description"
//                 required
//               />
//             </div>

//             {/* File Input */}
//             <div>
//               <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
//                 Select File
//               </label>
//               <input
//                 type="file"
//                 id="file-input"
//                 onChange={handleFileChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
//                 accept=".pdf,.doc,.docx,.txt,.md"
//                 required
//               />
//               {formData.file && (
//                 <p className="text-sm text-gray-600 mt-1">
//                   Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
//                 </p>
//               )}
//             </div>

//             {/* Upload Button */}
//             <button
//               type="submit"
//               disabled={isUploading}
//               className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//             >
//               {isUploading ? 'Uploading...' : 'Upload Documentation'}
//             </button>
//           </form>

//           {/* Status Messages */}
//           {uploadStatus && (
//             <div className={`mt-4 p-3 rounded-md text-sm ${
//               uploadStatus.type === 'success' 
//                 ? 'bg-green-100 text-green-700 border border-green-300' 
//                 : 'bg-red-100 text-red-700 border border-red-300'
//             }`}>
//               {uploadStatus.message}
//             </div>
//           )}
//         </div>

//         {/* Existing Documentation List */}
//         <div className="bg-gray-50 rounded-lg p-4 md:p-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
//             <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-2 sm:mb-0">
//               Existing Documentation
//             </h3>
//             <button
//               onClick={fetchDocuments}
//               disabled={isLoading}
//               className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 text-sm transition-colors"
//             >
//               {isLoading ? 'Refreshing...' : 'Refresh'}
//             </button>
//           </div>

//           {error && (
//             <div className="bg-red-100 text-red-700 p-3 rounded-md border border-red-300 mb-4 text-sm">
//               {error}
//             </div>
//           )}

//           {isLoading ? (
//             <div className="text-center py-8">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <p className="mt-2 text-gray-600">Loading documents...</p>
//             </div>
//           ) : documents.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <p>No documentation found. Upload your first document above.</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {/* Desktop Table View */}
//               <div className="hidden md:block overflow-x-auto">
//                 <table className="min-w-full bg-white rounded-lg shadow">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
//                       <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
//                       <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
//                       <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created</th>
//                       <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {documents.map((doc) => (
//                       <tr key={doc.id} className="hover:bg-gray-50">
//                         <td className="px-4 py-3 text-sm font-medium text-gray-900">{doc.title}</td>
//                         <td className="px-4 py-3 text-sm text-gray-600">
//                           <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
//                             {doc.type}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{doc.description}</td>
//                         <td className="px-4 py-3 text-sm text-gray-600">{formatDate(doc.created_at)}</td>
//                         <td className="px-4 py-3 text-sm">
//                           <button
//                             onClick={() => handleDownload(doc.file_url, doc.title)}
//                             className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs transition-colors"
//                           >
//                             Download
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Card View */}
//               <div className="md:hidden space-y-3">
//                 {documents.map((doc) => (
//                   <div key={doc.id} className="bg-white rounded-lg shadow p-4 border">
//                     <div className="flex justify-between items-start mb-2">
//                       <h4 className="font-medium text-gray-900 text-sm">{doc.title}</h4>
//                       <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
//                         {doc.type}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
//                     <div className="flex justify-between items-center">
//                       <span className="text-xs text-gray-500">{formatDate(doc.created_at)}</span>
//                       <button
//                         onClick={() => handleDownload(doc.file_url, doc.title)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs transition-colors"
//                       >
//                         Download
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Upload Guidelines */}
//         <div className="bg-blue-50 rounded-lg p-4">
//           <h4 className="text-sm font-medium text-blue-800 mb-2">Upload Guidelines:</h4>
//           <ul className="text-sm text-blue-700 space-y-1">
//             <li>• Supported formats: PDF, DOC, DOCX, TXT, MD</li>
//             <li>• Maximum file size: 10MB</li>
//             <li>• Files are converted to base64 for secure transmission</li>
//             {/* <li>• Merchant ID is automatically retrieved from UserData</li> */}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default APIDocumentationSection;





import { apiFetch } from "@/app/lib/api.js";
import React, { useState } from "react";

const APIDocumentationSection = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "PDF",
    file: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base URL for API calls

  // Fetch existing documentation
  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const merchantId = userData.user?.merchant_id;

      if (!merchantId) {
        throw new Error('Merchant ID not found in UserData');
      }

      const response = await apiFetch(`/superadmin/getDocumentation?merchant_id=${merchantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        setDocuments(result.data || []);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch documents');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'An error occurred while fetching documents.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch documents on component mount
  React.useEffect(() => {
    fetchDocuments();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle file download
  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  // Convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URL prefix to get just the base64 string
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      setUploadStatus({ type: 'error', message: 'Please select a file to upload.' });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // Get merchant_id from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const merchantId = userData.user?.merchant_id;

      if (!merchantId) {
        throw new Error('Merchant ID not found in UserData');
      }

      // Convert file to base64
      const fileBase64 = await convertFileToBase64(formData.file);

      // Prepare the request body
      const requestBody = {
        merchant_id: merchantId,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        fileName: formData.file.name,
        fileType: formData.file.type,
        fileBase: fileBase64
      };

      // Make API call
      const response = await apiFetch(`/superadmin/uploadDocumentation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus({ type: 'success', message: 'Documentation uploaded successfully!' });
        // Reset form
        setFormData({
          title: "",
          description: "",
          type: "PDF",
          file: null
        });
        // Reset file input
        document.getElementById('file-input').value = '';
        // Refresh documents list
        fetchDocuments();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'An error occurred while uploading the documentation.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-black rounded-lg text-white min-h-screen shadow-sm border border-gray-800 p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">
        API Documentation & Integration
      </h2>

      <div className="space-y-6 md:space-y-8">
        {/* Upload Documentation Form */}
        <div className="bg-gray-900 rounded-lg p-4 md:p-6 border border-gray-800">
          <h3 className="text-lg md:text-xl font-medium text-white mb-4">
            Upload Documentation
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title and Description - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base bg-black text-white"
                  placeholder="Enter documentation title"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                  Document Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base bg-black text-white"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOC">DOC</option>
                  <option value="DOCX">DOCX</option>
                  <option value="TXT">TXT</option>
                  <option value="MD">Markdown</option>
                </select>
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base bg-black text-white"
                placeholder="Enter documentation description"
                required
              />
            </div>

            {/* File Input */}
            <div>
              <label htmlFor="file-input" className="block text-sm font-medium text-gray-300 mb-2">
                Select File
              </label>
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base bg-black text-white"
                accept=".pdf,.doc,.docx,.txt,.md"
                required
              />
              {formData.file && (
                <p className="text-sm text-gray-400 mt-1">
                  Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Upload Documentation'}
            </button>
          </form>

          {/* Status Messages */}
          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-md text-sm ${
              uploadStatus.type === 'success' 
                ? 'bg-green-900 text-green-200 border border-green-700' 
                : 'bg-red-900 text-red-200 border border-red-700'
            }`}>
              {uploadStatus.message}
            </div>
          )}
        </div>

        {/* Existing Documentation List */}
        <div className="bg-gray-900 rounded-lg p-4 md:p-6 border border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg md:text-xl font-medium text-white mb-2 sm:mb-0">
              Existing Documentation
            </h3>
            <button
              onClick={fetchDocuments}
              disabled={isLoading}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-700 text-sm transition-colors"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900 text-red-200 p-3 rounded-md border border-red-700 mb-4 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-300">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No documentation found. Upload your first document above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-black rounded-lg shadow border border-gray-800">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Created</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-900">
                        <td className="px-4 py-3 text-sm font-medium text-white">{doc.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">
                          <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">
                            {doc.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">{doc.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{formatDate(doc.created_at)}</td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleDownload(doc.file_url, doc.title)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs transition-colors"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-black rounded-lg shadow p-4 border border-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">{doc.title}</h4>
                      <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">
                        {doc.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{doc.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">{formatDate(doc.created_at)}</span>
                      <button
                        onClick={() => handleDownload(doc.file_url, doc.title)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upload Guidelines */}
        <div className="bg-blue-900 rounded-lg p-4 border border-blue-700">
          <h4 className="text-sm font-medium text-blue-200 mb-2">Upload Guidelines:</h4>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• Supported formats: PDF, DOC, DOCX, TXT, MD</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Files are converted to base64 for secure transmission</li>
            {/* <li>• Merchant ID is automatically retrieved from UserData</li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentationSection;