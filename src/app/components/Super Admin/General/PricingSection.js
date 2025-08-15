// import React, { useState, useEffect } from 'react';
// import { Edit, Save, X, AlertCircle, CheckCircle, RefreshCw, DollarSign, Calendar, Users, Settings } from 'lucide-react';
// import { apiFetch } from '@/app/lib/api.js';

// function PricingSectionAdmin() {
//   const [packages, setPackages] = useState([]);
//   const [editingPackage, setEditingPackage] = useState(null);
//   const [customPricing, setCustomPricing] = useState({ business_user_per_custom_api_cost: 0 });
//   const [editingCustom, setEditingCustom] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [notification, setNotification] = useState({ show: false, type: '', message: '' });

//   // Fetch pricing data on component mount
//   useEffect(() => {
//     fetchPricingData();
//     fetchCustomPricing();
//   }, []);

//   const fetchPricingData = async () => {
//     setLoading(true);
//     try {
//       const response = await apiFetch('/Packages');
      
//       if (response.ok) {
//         const result = await response.json();
//         if (result.status && result.data) {
//           setPackages(result.data);
//         } else {
//           throw new Error(result.message || 'Failed to fetch packages');
//         }
//       } else {
//         throw new Error('Failed to fetch packages');
//       }
//     } catch (error) {
//       showNotification('error', 'Failed to fetch pricing data');
//       console.error('Error fetching pricing data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCustomPricing = async () => {
//     try {
//       // You might need to create a GET endpoint to fetch current custom pricing
//       // For now, we'll initialize with default values
//       setCustomPricing({ business_user_per_custom_api_cost: 0 });
//     } catch (error) {
//       console.error('Error fetching custom pricing:', error);
//     }
//   };

//   const updatePricing = async (packageData) => {
//     setLoading(true);
//     try {
//       const response = await apiFetch(`/Packages/Update/${packageData.id}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           monthly_limit: packageData.monthly_limit,
//           overage_rate: packageData.overage_rate,
//           package_price: packageData.package_price,
//           package_period: packageData.package_period,
//           package_description: packageData.package_description || ''
//         })
//       });

//       if (response.ok) {
//         const result = await response.json();
        
//         if (result.status === true) {
//           setPackages(prev => prev.map(pkg => 
//             pkg.id === packageData.id ? packageData : pkg
//           ));
//           setEditingPackage(null);
//           showNotification('success', `${packageData.package_name} package updated successfully!`);
//         } else {
//           throw new Error(result.message || 'Failed to update package');
//         }
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//       }
//     } catch (error) {
//       showNotification('error', `Failed to update pricing: ${error.message}`);
//       console.error('Error updating pricing:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

// const updateCustomPricing = async () => {
//   setLoading(true);
//   try {
//     const response = await apiFetch('/Subscriptions/customPackagePricing', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         package_id: 3,
//         business_user_per_custom_api_cost: parseFloat(customPricing.business_user_per_custom_api_cost)
//       })
//     });

//     if (response.ok) {
//       const result = await response.json();
      
//       // Be more flexible with success detection
//       const isSuccess = response.status >= 200 && response.status < 300;
      
//       if (isSuccess) {
//         setEditingCustom(false);
//         showNotification('success', 'Custom package pricing updated successfully!');
//       } else {
//         // Log the actual response for debugging
//         console.log('Unexpected API response:', result);
//         throw new Error(result.message || 'Update failed - check console for details');
//       }
//     } else {
//       const errorText = await response.text();
//       console.error('HTTP Error Response:', errorText);
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     }
//   } catch (error) {
//     console.error('Update error:', error);
//     showNotification('error', `Failed to update custom pricing: ${error.message}`);
//   } finally {
//     setLoading(false);
//   }
// };
//   const showNotification = (type, message) => {
//     setNotification({ show: true, type, message });
//     setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
//   };

//   const handleEdit = (packageData) => {
//     setEditingPackage({
//       ...packageData,
//       overage_rate: parseFloat(packageData.overage_rate),
//       package_price: parseFloat(packageData.package_price)
//     });
//   };

//   const handleSave = () => {
//     if (editingPackage) {
//       updatePricing(editingPackage);
//     }
//   };

//   const handleCancel = () => {
//     setEditingPackage(null);
//   };

//   const handleCustomEdit = () => {
//     setEditingCustom(true);
//   };

//   const handleCustomSave = () => {
//     updateCustomPricing();
//   };

//   const handleCustomCancel = () => {
//     setEditingCustom(false);
//     // Reset to original values if needed
//   };

//   const handleInputChange = (field, value) => {
//     setEditingPackage(prev => ({
//       ...prev,
//       [field]: field === 'monthly_limit' ? parseInt(value) || 0 : 
//                field === 'overage_rate' || field === 'package_price' ? parseFloat(value) || 0 : 
//                value
//     }));
//   };

//   const handleCustomInputChange = (field, value) => {
//     setCustomPricing(prev => ({
//       ...prev,
//       [field]: parseFloat(value) || 0
//     }));
//   };

//   const getPackageDesign = (packageName) => {
//     switch (packageName.toLowerCase()) {
//       case 'standard':
//         return {
//           colorClass: 'text-blue-600',
//           bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
//           borderColor: 'border-blue-200',
//           accentColor: 'bg-blue-600'
//         };
//       case 'premium':
//         return {
//           colorClass: 'text-purple-600',
//           bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
//           borderColor: 'border-purple-200',
//           accentColor: 'bg-purple-600'
//         };
//       case 'custom':
//         return {
//           colorClass: 'text-orange-600',
//           bgGradient: 'bg-gradient-to-br from-orange-50 to-orange-100',
//           borderColor: 'border-orange-200',
//           accentColor: 'bg-orange-600'
//         };
//       default:
//         return {
//           colorClass: 'text-gray-600',
//           bgGradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
//           borderColor: 'border-gray-200',
//           accentColor: 'bg-gray-600'
//         };
//     }
//   };

//   const renderCustomPricingCard = () => {
//     const design = getPackageDesign('custom');

//     return (
//       <div className={`text-black relative overflow-hidden rounded-xl border-2 ${design.borderColor} ${design.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300`}>
//         {/* Header accent bar */}
//         <div className={`h-1 ${design.accentColor}`}></div>
        
//         <div className="p-4 sm:p-6">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
//             <div className="flex items-center space-x-2">
//               <Settings className={`w-5 h-5 sm:w-6 sm:h-6 ${design.colorClass}`} />
//               <h3 className="font-bold text-lg sm:text-xl text-gray-800">Custom Package Pricing</h3>
//             </div>
//             {!editingCustom && (
//               <button
//                 onClick={handleCustomEdit}
//                 className={`self-start p-2 rounded-lg ${design.accentColor} text-white hover:opacity-80 transition-opacity shadow-md`}
//                 disabled={loading}
//               >
//                 <Edit size={16} />
//               </button>
//             )}
//           </div>

//           {editingCustom ? (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   <DollarSign className="inline w-4 h-4 mr-1" />
//                   Business User Per Custom API Cost ($)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   value={customPricing.business_user_per_custom_api_cost}
//                   onChange={(e) => handleCustomInputChange('business_user_per_custom_api_cost', e.target.value)}
//                   className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
//                   placeholder="Enter cost per business user"
//                 />
//               </div>

//               <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
//                 <button
//                   onClick={handleCustomSave}
//                   disabled={loading}
//                   className="w-full sm:flex-1 bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold shadow-md transition-all text-sm sm:text-base"
//                 >
//                   <Save size={18} />
//                   <span>{loading ? 'Saving...' : 'Save Changes'}</span>
//                 </button>
//                 <button
//                   onClick={handleCustomCancel}
//                   disabled={loading}
//                   className="w-full sm:flex-1 bg-gray-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold shadow-md transition-all text-sm sm:text-base"
//                 >
//                   <X size={18} />
//                   <span>Cancel</span>
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="text-center">
//                 <p className={`text-3xl sm:text-4xl md:text-5xl font-bold ${design.colorClass} mb-2`}>
//                   ${customPricing.business_user_per_custom_api_cost}
//                 </p>
//                 <p className="text-gray-500 text-base sm:text-lg font-medium">
//                   Per API call 
//                 </p>
//               </div>

//               <div className="p-3 bg-white bg-opacity-60 rounded-lg">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
//                   <span className="text-gray-700 font-medium flex items-center text-sm sm:text-base">
//                     <Settings className="w-4 h-4 mr-2 text-gray-500" />
//                     Package ID
//                   </span>
//                   <span className="font-bold text-gray-800 text-sm sm:text-base">
//                     3 
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg">
//                 <p className="text-gray-700 text-sm leading-relaxed">
//                   Custom pricing for business users accessing custom API endpoints. 
//                   This pricing is applied per business user for custom package features.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderPackageCard = (packageData) => {
//     const isEditing = editingPackage?.id === packageData.id;
//     const design = getPackageDesign(packageData.package_name);

//     return (
//       <div key={packageData.id} className={`text-black relative overflow-hidden rounded-xl border-2 ${design.borderColor} ${design.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300`}>
//         {/* Header accent bar */}
//         <div className={`h-1 ${design.accentColor}`}></div>
        
//         <div className="p-4 sm:p-6">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
//             <div className="flex items-center space-x-2">
//               <DollarSign className={`w-5 h-5 sm:w-6 sm:h-6 ${design.colorClass}`} />
//               <h3 className="font-bold text-lg sm:text-xl text-gray-800">{packageData.package_name}</h3>
//             </div>
//             {!isEditing && (
//               <button
//                 onClick={() => handleEdit(packageData)}
//                 className={`self-start p-2 rounded-lg ${design.accentColor} text-white hover:opacity-80 transition-opacity shadow-md`}
//                 disabled={loading}
//               >
//                 <Edit size={16} />
//               </button>
//             )}
//           </div>

//           {isEditing ? (
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     <DollarSign className="inline w-4 h-4 mr-1" />
//                     Price ($)
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={editingPackage.package_price}
//                     onChange={(e) => handleInputChange('package_price', e.target.value)}
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     <Users className="inline w-4 h-4 mr-1" />
//                     Monthly Limit
//                   </label>
//                   <input
//                     type="number"
//                     value={editingPackage.monthly_limit}
//                     onChange={(e) => handleInputChange('monthly_limit', e.target.value)}
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Overage Rate ($)
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={editingPackage.overage_rate}
//                     onChange={(e) => handleInputChange('overage_rate', e.target.value)}
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     <Calendar className="inline w-4 h-4 mr-1" />
//                     Period
//                   </label>
//                   <input
//                     type="text"
//                     value={editingPackage.package_period}
//                     onChange={(e) => handleInputChange('package_period', e.target.value)}
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   value={editingPackage.package_description || ''}
//                   onChange={(e) => handleInputChange('package_description', e.target.value)}
//                   rows="3"
//                   className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
//                   placeholder="Enter package description..."
//                 />
//               </div>

//               <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
//                 <button
//                   onClick={handleSave}
//                   disabled={loading}
//                   className="w-full sm:flex-1 bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold shadow-md transition-all text-sm sm:text-base"
//                 >
//                   <Save size={18} />
//                   <span>{loading ? 'Saving...' : 'Save Changes'}</span>
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   disabled={loading}
//                   className="w-full sm:flex-1 bg-gray-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold shadow-md transition-all text-sm sm:text-base"
//                 >
//                   <X size={18} />
//                   <span>Cancel</span>
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="text-center">
//                 <p className={`text-3xl sm:text-4xl md:text-5xl font-bold ${design.colorClass} mb-2`}>
//                   ${packageData.package_price}
//                 </p>
//                 <p className="text-gray-500 text-base sm:text-lg font-medium">
//                   per {packageData.package_period}
//                 </p>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-white bg-opacity-60 rounded-lg gap-2 sm:gap-0">
//                   <span className="text-gray-700 font-medium flex items-center text-sm sm:text-base">
//                     <Users className="w-4 h-4 mr-2 text-gray-500" />
//                     Monthly Limit
//                   </span>
//                   <span className="font-bold text-gray-800 text-sm sm:text-base">
//                     {packageData.monthly_limit === 100000000 ? 'Unlimited' : packageData.monthly_limit.toLocaleString()}
//                   </span>
//                 </div>

//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-white bg-opacity-60 rounded-lg gap-2 sm:gap-0">
//                   <span className="text-gray-700 font-medium flex items-center text-sm sm:text-base">
//                     <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
//                     Overage Rate
//                   </span>
//                   <span className="font-bold text-gray-800 text-sm sm:text-base">
//                     ${packageData.overage_rate}
//                   </span>
//                 </div>
//               </div>

//               {packageData.package_description && (
//                 <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg">
//                   <p className="text-gray-700 text-sm leading-relaxed">
//                     {packageData.package_description}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br text-black from-gray-50 to-gray-100 p-3 sm:p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
//           {/* Notification */}
//           {notification.show && (
//             <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-start sm:items-center space-x-3 shadow-md ${
//               notification.type === 'success' 
//                 ? 'bg-green-50 text-green-800 border border-green-200' 
//                 : 'bg-red-50 text-red-800 border border-red-200'
//             }`}>
//               <div className="flex-shrink-0 mt-0.5 sm:mt-0">
//                 {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
//               </div>
//               <span className="font-medium text-sm sm:text-base leading-tight sm:leading-normal">{notification.message}</span>
//             </div>
//           )}

//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
//             <div>
//               <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Pricing Management</h1>
//               <p className="text-gray-600 text-sm sm:text-base">Manage your subscription packages and custom pricing</p>
//             </div>
//             <button
//               onClick={() => {
//                 fetchPricingData();
//                 fetchCustomPricing();
//               }}
//               disabled={loading}
//               className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
//             >
//               <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
//               <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
//             </button>
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && !editingPackage && !editingCustom ? (
//           <div className="flex justify-center items-center py-12 sm:py-16">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
//               <p className="text-gray-600 font-medium text-sm sm:text-base">Loading pricing data...</p>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6 sm:space-y-8">
//             {/* Package Cards */}
//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
//               {packages.slice(0, 2).map(packageData => renderPackageCard(packageData))}
//             </div>
            
//             {/* Custom Package Pricing Section */}
//             <div className="mt-8">
//               <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Custom Package Pricing</h2>
//               <div className="grid grid-cols-1 gap-6 sm:gap-8">
//                 {renderCustomPricingCard()}
//               </div>
//             </div>
            
//             {/* Instructions */}
//             {!editingPackage && !editingCustom && packages.length > 0 && (
//               <div className="bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
//                 <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
//                   <div className="flex-shrink-0 bg-blue-600 text-white p-2 rounded-lg self-start">
//                     <AlertCircle size={20} />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">How to Edit Packages</h3>
//                     <p className="text-blue-800 leading-relaxed text-sm sm:text-base">
//                       Click the edit button on any package card to modify pricing, limits, and descriptions. 
//                       Use the custom package pricing section to set per-user costs for custom API access.
//                       Your changes will be automatically saved to the API and reflected immediately.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Empty State */}
//             {packages.length === 0 && !loading && (
//               <div className="text-center py-12 sm:py-16">
//                 <div className="bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">
//                   <DollarSign size={32} className="text-gray-400" />
//                 </div>
//                 <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Packages Found</h3>
//                 <p className="text-gray-500 mb-4 text-sm sm:text-base px-4">Unable to load pricing packages. Please try refreshing.</p>
//                 <button
//                   onClick={fetchPricingData}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-all text-sm sm:text-base"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PricingSectionAdmin;







// theme changed 


import React, { useState, useEffect } from 'react';
import { Edit, Save, X, AlertCircle, CheckCircle, RefreshCw, DollarSign, Calendar, Users, Settings, Building2, Info, InfoIcon, Building } from 'lucide-react';
import { apiFetch } from '@/app/lib/api.js';

function PricingSectionAdmin() {
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);
  const [customPricing, setCustomPricing] = useState({ 
    business_user_per_custom_api_cost: 0,
    enterprise_user_per_custom_api_cost: 0,
    sub_business_fee: 0,
    billing_cycle: 'monthly'
  });
  const [editingCustom, setEditingCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Fetch pricing data on component mount
  useEffect(() => {
    fetchPricingData();
    fetchCustomPricing();
  }, []);

  const fetchPricingData = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/Packages');
      
      if (response.ok) {
        const result = await response.json();
        if (result.status && result.data) {
          setPackages(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch packages');
        }
      } else {
        throw new Error('Failed to fetch packages');
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch pricing data');
      console.error('Error fetching pricing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomPricing = async () => {
    try {
      const response = await apiFetch('/Subscriptions/customPackagePricing?package_id=3');
      
      if (response.ok) {
        const result = await response.json();
        if (result.status && result.data) {
          setCustomPricing({
            business_user_per_custom_api_cost: parseFloat(result.data.business_user_per_custom_api_cost) || 0,
            enterprise_user_per_custom_api_cost: parseFloat(result.data.enterprise_user_per_custom_api_cost) || 0,
            sub_business_fee: parseFloat(result.data.sub_business_fee) || 0,
            billing_cycle: result.data.billing_cycle || 'monthly'
          });
        } else {
          // If no data found, keep default values
          console.log('No custom pricing data found, using defaults');
        }
      } else {
        console.log('Failed to fetch custom pricing, using defaults');
      }
    } catch (error) {
      console.error('Error fetching custom pricing:', error);
      // Keep default values on error
    }
  };

  const updatePricing = async (packageData) => {
    setLoading(true);
    try {
      const response = await apiFetch(`/Packages/Update/${packageData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthly_limit: packageData.monthly_limit,
          overage_rate: packageData.overage_rate,
          package_price: packageData.package_price,
          package_period: packageData.package_period,
          package_description: packageData.package_description || ''
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.status === true) {
          setPackages(prev => prev.map(pkg => 
            pkg.id === packageData.id ? packageData : pkg
          ));
          setEditingPackage(null);
          showNotification('success', `${packageData.package_name} package updated successfully!`);
        } else {
          throw new Error(result.message || 'Failed to update package');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      showNotification('error', `Failed to update pricing: ${error.message}`);
      console.error('Error updating pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomPricing = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/Subscriptions/customPackagePricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_id: 3,
          business_user_per_custom_api_cost: parseFloat(customPricing.business_user_per_custom_api_cost),
          enterprise_user_per_custom_api_cost: parseFloat(customPricing.enterprise_user_per_custom_api_cost),
          sub_business_fee: parseFloat(customPricing.sub_business_fee),
          billing_cycle: customPricing.billing_cycle
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Be more flexible with success detection
        const isSuccess = response.status >= 200 && response.status < 300;
        
        if (isSuccess) {
          setEditingCustom(false);
          showNotification('success', 'Custom package pricing updated successfully!');
          // Refresh the custom pricing data to get the latest values
          fetchCustomPricing();
        } else {
          // Log the actual response for debugging
          console.log('Unexpected API response:', result);
          throw new Error(result.message || 'Update failed - check console for details');
        }
      } else {
        const errorText = await response.text();
        console.error('HTTP Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      showNotification('error', `Failed to update custom pricing: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  const handleEdit = (packageData) => {
    setEditingPackage({
      ...packageData,
      overage_rate: parseFloat(packageData.overage_rate),
      package_price: parseFloat(packageData.package_price)
    });
  };

  const handleSave = () => {
    if (editingPackage) {
      updatePricing(editingPackage);
    }
  };

  const handleCancel = () => {
    setEditingPackage(null);
  };

  const handleCustomEdit = () => {
    setEditingCustom(true);
  };

  const handleCustomSave = () => {
    updateCustomPricing();
  };

  const handleCustomCancel = () => {
    setEditingCustom(false);
    // Refresh to get original values
    fetchCustomPricing();
  };

  const handleInputChange = (field, value) => {
    setEditingPackage(prev => ({
      ...prev,
      [field]: field === 'monthly_limit' ? parseInt(value) || 0 : 
               field === 'overage_rate' || field === 'package_price' ? parseFloat(value) || 0 : 
               value
    }));
  };

  const handleCustomInputChange = (field, value) => {
    setCustomPricing(prev => ({
      ...prev,
      [field]: field === 'billing_cycle' ? value : parseFloat(value) || 0
    }));
  };

  const getPackageDesign = (packageName) => {
    switch (packageName.toLowerCase()) {
      case 'standard':
        return {
          colorClass: 'text-blue-400',
          bgGradient: 'bg-gradient-to-br from-blue-900 to-blue-800',
          borderColor: 'border-blue-600',
          accentColor: 'bg-blue-600'
        };
      case 'premium':
        return {
          colorClass: 'text-purple-400',
          bgGradient: 'bg-gradient-to-br from-purple-900 to-purple-800',
          borderColor: 'border-purple-600',
          accentColor: 'bg-purple-600'
        };
      case 'custom':
        return {
          colorClass: 'text-orange-400',
          bgGradient: 'bg-gradient-to-br from-orange-900 to-orange-800',
          borderColor: 'border-orange-600',
          accentColor: 'bg-orange-600'
        };
      default:
        return {
          colorClass: 'text-gray-400',
          bgGradient: 'bg-gradient-to-br from-gray-900 to-gray-800',
          borderColor: 'border-gray-600',
          accentColor: 'bg-gray-600'
        };
    }
  };

const renderCustomPricingCard = () => {
  const design = getPackageDesign('custom');

  return (
    <div className={`text-white relative overflow-hidden rounded-xl border-2 ${design.borderColor} ${design.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300`}>
      {/* Header accent bar */}
      <div className={`h-1 ${design.accentColor}`}></div>
      
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
          <div className="flex items-center space-x-2">
            <Settings className={`w-5 h-5 sm:w-6 sm:h-6 ${design.colorClass}`} />
            <h3 className="font-bold text-lg sm:text-xl text-white">Custom Package Pricing</h3>
          </div>
          {!editingCustom && (
            <button
              onClick={handleCustomEdit}
              className={`self-start p-2 rounded-lg ${design.accentColor} text-white hover:opacity-80 transition-opacity shadow-md`}
              disabled={loading}
            >
              <Edit size={16} />
            </button>
          )}
        </div>

        {editingCustom ? (
          <div className="space-y-6">
            {/* Business Users Section */}
            <div className="bg-black bg-opacity-40 rounded-lg p-4 border border-gray-600">
              <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Business Users Configuration
              </h4>
              <p className="text-gray-300 text-sm mb-4">
                Standard business users with per-API cost pricing
              </p>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Per API Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={customPricing.business_user_per_custom_api_cost}
                  onChange={(e) => handleCustomInputChange('business_user_per_custom_api_cost', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-black text-white"
                  placeholder="Enter cost per API call"
                />
              </div>
            </div>

            {/* Enterprise Users Section */}
            <div className="bg-black bg-opacity-40 rounded-lg p-4 border border-purple-600">
              <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Enterprise Users Configuration
              </h4>
              <p className="text-gray-300 text-sm mb-4">
                Enterprise users who manage sub-businesses with advanced billing options
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Per API Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={customPricing.enterprise_user_per_custom_api_cost}
                    onChange={(e) => handleCustomInputChange('enterprise_user_per_custom_api_cost', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base bg-black text-white"
                    placeholder="Enter cost per API call"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Building className="inline w-4 h-4 mr-1" />
                    Sub Business Fee ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={customPricing.sub_business_fee}
                    onChange={(e) => handleCustomInputChange('sub_business_fee', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base bg-black text-white"
                    placeholder="Fee per sub-business"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Additional fee for each sub-business managed
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Enterprise Billing Cycle
                </label>
                <select
                  value={customPricing.billing_cycle}
                  onChange={(e) => handleCustomInputChange('billing_cycle', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base bg-black text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Billing frequency for enterprise accounts
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
              <button
                onClick={handleCustomSave}
                disabled={loading}
                className="w-full sm:flex-1 bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold shadow-md transition-all text-sm sm:text-base"
              >
                <Save size={18} />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                onClick={handleCustomCancel}
                disabled={loading}
                className="w-full sm:flex-1 bg-gray-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold shadow-md transition-all text-sm sm:text-base"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Business Users Display */}
            <div className="bg-black bg-opacity-40 rounded-lg p-4 border border-gray-600">
              <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Business Users
              </h4>
              
              <div className="text-center p-4 bg-black bg-opacity-60 rounded-lg border border-gray-700">
                <p className={`text-2xl sm:text-3xl font-bold text-blue-400 mb-1`}>
                  ${customPricing.business_user_per_custom_api_cost}
                </p>
                <p className="text-gray-300 text-sm font-medium">
                  Per API Call
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Standard business user pricing
                </p>
              </div>
            </div>

            {/* Enterprise Users Display */}
            <div className="bg-black bg-opacity-40 rounded-lg p-4 border border-purple-600">
              <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Enterprise Users
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-black bg-opacity-60 rounded-lg border border-gray-700">
                  <p className={`text-2xl sm:text-3xl font-bold text-purple-400 mb-1`}>
                    ${customPricing.enterprise_user_per_custom_api_cost}
                  </p>
                  <p className="text-gray-300 text-sm font-medium">
                    Per API Call
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Enterprise user pricing
                  </p>
                </div>
                
                <div className="text-center p-4 bg-black bg-opacity-60 rounded-lg border border-gray-700">
                  <p className={`text-2xl sm:text-3xl font-bold text-purple-400 mb-1`}>
                    ${customPricing.sub_business_fee}
                  </p>
                  <p className="text-gray-300 text-sm font-medium">
                    Sub Business Fee
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Per managed sub-business
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black bg-opacity-60 rounded-lg gap-2 sm:gap-0 border border-gray-700">
                <span className="text-gray-300 font-medium flex items-center text-sm sm:text-base">
                  <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                  Enterprise Billing Cycle
                </span>
                <span className="font-bold text-white text-sm sm:text-base capitalize">
                  {customPricing.billing_cycle}
                </span>
              </div>
            </div>

            {/* Package Information */}
            <div className="mt-4 p-4 bg-black bg-opacity-60 rounded-lg border border-gray-700">
              <h5 className="text-white font-semibold mb-2 flex items-center">
                <InfoIcon className="w-4 h-4 mr-2 text-gray-400" />
                Package Details
              </h5>
              <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-blue-400">Business Users:</strong> Pay per API call with simple pricing structure.
                </p>
                <p>
                  <strong className="text-purple-400">Enterprise Users:</strong> Advanced users who can manage multiple sub-businesses. 
                  They pay per API call plus additional fees for each sub-business they manage, with flexible billing cycles.
                </p>
               
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

  const renderPackageCard = (packageData) => {
    const isEditing = editingPackage?.id === packageData.id;
    const design = getPackageDesign(packageData.package_name);

    return (
      <div key={packageData.id} className={`text-white relative overflow-hidden rounded-xl border-2 ${design.borderColor} ${design.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300`}>
        {/* Header accent bar */}
        <div className={`h-1 ${design.accentColor}`}></div>
        
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className={`w-5 h-5 sm:w-6 sm:h-6 ${design.colorClass}`} />
              <h3 className="font-bold text-lg sm:text-xl text-white">{packageData.package_name}</h3>
            </div>
            {!isEditing && (
              <button
                onClick={() => handleEdit(packageData)}
                className={`self-start p-2 rounded-lg ${design.accentColor} text-white hover:opacity-80 transition-opacity shadow-md`}
                disabled={loading}
              >
                <Edit size={16} />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPackage.package_price}
                    onChange={(e) => handleInputChange('package_price', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-black text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Monthly Limit
                  </label>
                  <input
                    type="number"
                    value={editingPackage.monthly_limit}
                    onChange={(e) => handleInputChange('monthly_limit', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-black text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Overage Rate ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPackage.overage_rate}
                    onChange={(e) => handleInputChange('overage_rate', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-black text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Period
                  </label>
                  <input
                    type="text"
                    value={editingPackage.package_period}
                    onChange={(e) => handleInputChange('package_period', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-black text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editingPackage.package_description || ''}
                  onChange={(e) => handleInputChange('package_description', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base bg-black text-white"
                  placeholder="Enter package description..."
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full sm:flex-1 bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold shadow-md transition-all text-sm sm:text-base"
                >
                  <Save size={18} />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full sm:flex-1 bg-gray-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center space-x-2 font-semibold shadow-md transition-all text-sm sm:text-base"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className={`text-3xl sm:text-4xl md:text-5xl font-bold ${design.colorClass} mb-2`}>
                  ${packageData.package_price}
                </p>
                <p className="text-gray-300 text-base sm:text-lg font-medium">
                  per {packageData.package_period}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black bg-opacity-60 rounded-lg gap-2 sm:gap-0 border border-gray-700">
                  <span className="text-gray-300 font-medium flex items-center text-sm sm:text-base">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    Monthly Limit
                  </span>
                  <span className="font-bold text-white text-sm sm:text-base">
                    {packageData.monthly_limit === 100000000 ? 'Unlimited' : packageData.monthly_limit.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black bg-opacity-60 rounded-lg gap-2 sm:gap-0 border border-gray-700">
                  <span className="text-gray-300 font-medium flex items-center text-sm sm:text-base">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    Overage Rate
                  </span>
                  <span className="font-bold text-white text-sm sm:text-base">
                    ${packageData.overage_rate}
                  </span>
                </div>
              </div>

              {packageData.package_description && (
                <div className="mt-4 p-3 bg-black bg-opacity-60 rounded-lg border border-gray-700">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {packageData.package_description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br text-white from-black to-gray-900 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-black rounded-xl sm:rounded-2xl shadow-xl border border-gray-800 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          {/* Notification */}
          {notification.show && (
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-start sm:items-center space-x-3 shadow-md ${
              notification.type === 'success' 
                ? 'bg-green-900 text-green-200 border border-green-700' 
                : 'bg-red-900 text-red-200 border border-red-700'
            }`}>
              <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              </div>
              <span className="font-medium text-sm sm:text-base leading-tight sm:leading-normal">{notification.message}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Pricing Management</h1>
              <p className="text-gray-300 text-sm sm:text-base">Manage your subscription packages and custom pricing</p>
            </div>
            <button
              onClick={() => {
                fetchPricingData();
                fetchCustomPricing();
              }}
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && !editingPackage && !editingCustom ? (
          <div className="flex justify-center items-center py-12 sm:py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-300 font-medium text-sm sm:text-base">Loading pricing data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Package Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              {packages.slice(0, 2).map(packageData => renderPackageCard(packageData))}
            </div>
            
            {/* Custom Package Pricing Section */}
            <div className="mt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Custom Package Pricing</h2>
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {renderCustomPricingCard()}
              </div>
            </div>
            
            {/* Instructions */}
            {!editingPackage && !editingCustom && packages.length > 0 && (
              <div className="bg-blue-900 border-2 border-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="flex-shrink-0 bg-blue-600 text-white p-2 rounded-lg self-start">
                    <AlertCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-200 mb-2 text-sm sm:text-base">How to Edit Packages</h3>
                    <p className="text-blue-300 leading-relaxed text-sm sm:text-base">
                      Click the edit button on any package card to modify pricing, limits, and descriptions. 
                      Use the custom package pricing section to set rates for business users, enterprise users, 
                      sub-business fees, and billing cycles. Your changes will be automatically saved to the API and reflected immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {packages.length === 0 && !loading && (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-gray-800 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">
                  <DollarSign size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No Packages Found</h3>
                <p className="text-gray-400 mb-4 text-sm sm:text-base px-4">Unable to load pricing packages. Please try refreshing.</p>
                <button
                  onClick={fetchPricingData}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-all text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PricingSectionAdmin;