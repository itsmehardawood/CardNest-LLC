// 'use client';

// import { useState, useEffect } from 'react';
// import { Eye, Calendar, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
// import ScanHistoryModal from './ScanHistoryModal';
// import { apiFetch } from '@/app/lib/api.js';

// const ScanHistorySection = () => {
//   const [scanHistory, setScanHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedScan, setSelectedScan] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     fetchScanHistory();
//   }, []);

//   const fetchScanHistory = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      

  

//       // Extract merchant_id from userData in localStorage
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//     const merchantId = userData.user?.merchant_id;  
      
//       if (!merchantId) {
//         throw new Error('Merchant ID not found in user data');
//       }

//       const response = await apiFetch(`/merchant/getCardScans?id=${merchantId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch scan history');
//       }

//       const data = await response.json();
      
//       if (data.status) {
//         setScanHistory(data.data || []);
//       } else {
//         throw new Error(data.message || 'Failed to retrieve scan history');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching scan history:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusIcon = (status) => {
//     return status === 'success' ? (
//       <CheckCircle className="w-4 h-4 text-green-500" />
//     ) : (
//       <AlertCircle className="w-4 h-4 text-red-500" />
//     );
//   };

//   const getStatusBadge = (status) => {
//     const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
//     return status === 'success' 
//       ? `${baseClasses} bg-green-100 text-green-800`
//       : `${baseClasses} bg-red-100 text-red-800`;
//   };

//   const handleViewDetails = (scan) => {
//     setSelectedScan(scan);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedScan(null);
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
//         <div className="animate-pulse">
//           <div className="h-5 sm:h-6 bg-gray-200 rounded w-36 sm:w-48 mb-4"></div>
//           <div className="space-y-3">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="h-12 sm:h-16 bg-gray-100 rounded"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
//         <div className="text-center py-6 sm:py-8">
//           <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No History Found</h3>
//           <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">{error}</p>
//           <button
//             onClick={fetchScanHistory}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//       <div className="p-4 sm:p-6 border-b border-gray-200">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
//           <div>
//             <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Card Scan History</h2>
//             <p className="text-gray-600 text-sm mt-1">
//               Total scans: {scanHistory.length}
//             </p>
//           </div>
//           <button
//             onClick={fetchScanHistory}
//             className="text-blue-600 hover:text-blue-700 text-sm font-medium self-start sm:self-auto"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       <div className="p-4 sm:p-6">
//      {scanHistory.length === 0 ? (
//   <div className="text-center py-6 sm:py-8">
//     <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
//     <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Scan History Found</h3>
//     <p className="text-sm sm:text-base text-gray-600">No scan history found against this merchant.</p>
//   </div>
// ) : (
//           <div className="space-y-3">
//             {scanHistory.map((scan) => (
//               <div
//                 key={scan.id}
//                 className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
//               >
//                 {/* Mobile Layout (stacked) */}
//                 <div className="block sm:hidden space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       {getStatusIcon(scan.status)}
//                       <span className={getStatusBadge(scan.status)}>
//                         {scan.status}
//                       </span>
//                     </div>
//                     <button
//                       onClick={() => handleViewDetails(scan)}
//                       className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
//                     >
//                       <Eye className="w-4 h-4" />
//                       <span className="hidden xs:inline">Details</span>
//                     </button>
//                   </div>
                  
//                   <div className="flex items-center space-x-2 text-gray-600">
//                     <CreditCard className="w-4 h-4 flex-shrink-0" />
//                     <span className="font-mono text-sm break-all">
//                       {scan.card_number_masked}
//                     </span>
//                   </div>
                  
//                   <div className="flex items-center space-x-2 text-gray-500">
//                     <Calendar className="w-4 h-4 flex-shrink-0" />
//                     <span className="text-sm">
//                       {formatDate(scan.created_at)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Desktop Layout (horizontal) */}
//                 <div className="hidden sm:flex items-center justify-between">
//                   <div className="flex items-center space-x-2 md:space-x-4 flex-wrap gap-y-2">
//                     <div className="flex items-center space-x-2">
//                       {getStatusIcon(scan.status)}
//                       <span className={getStatusBadge(scan.status)}>
//                         {scan.status}
//                       </span>
//                     </div>
                    
//                     <div className="flex items-center space-x-2 text-gray-600">
//                       <CreditCard className="w-4 h-4 flex-shrink-0" />
//                       <span className="font-mono text-sm">
//                         {scan.card_number_masked}
//                       </span>
//                     </div>
                    
//                     <div className="flex items-center space-x-2 text-gray-500">
//                       <Calendar className="w-4 h-4 flex-shrink-0" />
//                       <span className="text-sm">
//                         {formatDate(scan.created_at)}
//                       </span>
//                     </div>
//                   </div>
                  
//                   <button
//                     onClick={() => handleViewDetails(scan)}
//                     className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium ml-4"
//                   >
//                     <Eye className="w-4 h-4" />
//                     <span>View Details</span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {isModalOpen && selectedScan && (
//         <ScanHistoryModal
//           scan={selectedScan}
//           isOpen={isModalOpen}
//           onClose={closeModal}
//         />
//       )}
//     </div>
//   );
// };

// export default ScanHistorySection;


'use client';

import { useState, useEffect } from 'react';
import { Eye, Calendar, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import ScanHistoryModal from './ScanHistoryModal';
import { apiFetch } from '@/app/lib/api.js';

const ScanHistorySection = () => {
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      

  

      // Extract merchant_id from userData in localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const merchantId = userData.user?.merchant_id;  
      
      if (!merchantId) {
        throw new Error('Merchant ID not found in user data');
      }

      const response = await apiFetch(`/merchant/getCardScans?id=${merchantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scan history');
      }

      const data = await response.json();
      
      if (data.status) {
        setScanHistory(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to retrieve scan history');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching scan history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    return status === 'success' ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-400" />
    );
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    return status === 'success' 
      ? `${baseClasses} bg-green-900 text-green-300`
      : `${baseClasses} bg-red-900 text-red-300`;
  };

  const handleViewDetails = (scan) => {
    setSelectedScan(scan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScan(null);
  };

  if (loading) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-700 rounded w-36 sm:w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 sm:h-16 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-4 sm:p-6">
        <div className="text-center py-6 sm:py-8">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-white mb-2">No History Found</h3>
          <p className="text-sm sm:text-base text-gray-300 mb-4 px-4">{error}</p>
          <button
            onClick={fetchScanHistory}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg shadow-sm border border-gray-800">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Card Scan History</h2>
            <p className="text-gray-300 text-sm mt-1">
              Total scans: {scanHistory.length}
            </p>
          </div>
          <button
            onClick={fetchScanHistory}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium self-start sm:self-auto"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
     {scanHistory.length === 0 ? (
  <div className="text-center py-6 sm:py-8">
    <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-base sm:text-lg font-medium text-white mb-2">No Scan History Found</h3>
    <p className="text-sm sm:text-base text-gray-300">No scan history found against this merchant.</p>
  </div>
) : (
          <div className="space-y-3">
            {scanHistory.map((scan) => (
              <div
                key={scan.id}
                className="border border-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-gray-600 transition-all"
              >
                {/* Mobile Layout (stacked) */}
                <div className="block sm:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(scan.status)}
                      <span className={getStatusBadge(scan.status)}>
                        {scan.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(scan)}
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden xs:inline">Details</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-300">
                    <CreditCard className="w-4 h-4 flex-shrink-0" />
                    <span className="font-mono text-sm break-all">
                      {scan.card_number_masked}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">
                      {formatDate(scan.created_at)}
                    </span>
                  </div>
                </div>

                {/* Desktop Layout (horizontal) */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-4 flex-wrap gap-y-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(scan.status)}
                      <span className={getStatusBadge(scan.status)}>
                        {scan.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-300">
                      <CreditCard className="w-4 h-4 flex-shrink-0" />
                      <span className="font-mono text-sm">
                        {scan.card_number_masked}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">
                        {formatDate(scan.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleViewDetails(scan)}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium ml-4"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedScan && (
        <ScanHistoryModal
          scan={selectedScan}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ScanHistorySection;