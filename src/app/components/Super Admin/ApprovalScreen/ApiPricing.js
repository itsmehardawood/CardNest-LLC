// "use client";
// import { useState, useEffect } from "react";
// import { CreditCard, ChevronDown, ChevronUp } from "lucide-react";

// export default function PricingForm() {
//   const [showForm, setShowForm] = useState(false);
//   const [merchantId, setMerchantId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [pricingData, setPricingData] = useState({
//     per_api_call: "",
//     overdue_api_call: "",
//   });

//   // Get merchantId from localStorage
//   useEffect(() => {
//     const storedMerchantId = localStorage.getItem("merchantId");
//     if (storedMerchantId) {
//       setMerchantId(storedMerchantId);
//     }
//   }, []);

//   const handleChange = (e) => {
//     setPricingData({
//       ...pricingData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSave = async () => {
//     if (!merchantId) {
//       alert("Merchant ID not found!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch("/api/pricing", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           merchantId,
//           per_api_call: pricingData.per_api_call,
//           overdue_api_call: pricingData.overdue_api_call,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to save pricing");
//       }

//       const result = await response.json();
//       console.log("Pricing saved:", result);

//       // Collapse form after save
//       setShowForm(false);
//     } catch (error) {
//       console.error(error);
//       alert("Error saving pricing");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setPricingData({
//       per_api_call: "",
//       overdue_api_call: "",
//     });
//     setShowForm(false);
//   };

//   return (
//     <div className="bg-black rounded-2xl shadow-sm border border-gray-800">
//       {/* Header */}
//       <button
//         type="button"
//         onClick={() => setShowForm(!showForm)}
//         className="w-full flex items-center justify-between p-6"
//       >
//         <div className="flex items-center">
//           <div className="p-2 bg-indigo-900 rounded-lg mr-3">
//             <CreditCard className="h-5 w-5 text-indigo-400" />
//           </div>
//           <h4 className="text-lg font-semibold text-white">Add Custom Pricing</h4>
//         </div>
//         {showForm ? (
//           <ChevronUp className="h-5 w-5 text-gray-400" />
//         ) : (
//           <ChevronDown className="h-5 w-5 text-gray-400" />
//         )}
//       </button>

//       {/* Dropdown Content */}
//       {showForm && (
//         <div className="p-6 border-t border-gray-800 space-y-6">
//           <form className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
//               <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
//                 Price Per API Call
//               </label>
//               <input
//                 type="number"
//                 name="per_api_call"
//                 value={pricingData.per_api_call}
//                 onChange={handleChange}
//                 className="w-full rounded-lg bg-black text-white border border-gray-700 p-2 text-sm"
//               />
//             </div>

//             <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
//               <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
//                 Price Overdue API Call
//               </label>
//               <input
//                 type="number"
//                 name="overdue_api_call"
//                 value={pricingData.overdue_api_call}
//                 onChange={handleChange}
//                 className="w-full rounded-lg bg-black text-white border border-gray-700 p-2 text-sm"
//               />
//             </div>
//           </form>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="px-4 py-2 text-gray-300 bg-black border border-gray-700 hover:bg-gray-800 rounded-lg text-sm font-medium"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSave}
//               className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow flex items-center"
//               disabled={loading}
//             >
//               {loading && (
//                 <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
//               )}
//               Save Pricing
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


export const saveMerchantPricing = async (per_api_call, overdue_api_call) => {
  try {
    const merchantId = localStorage.getItem('merchantId');
    
    if (!merchantId) {
      throw new Error('Merchant ID not found in localStorage');
    }

    const response = await fetch('/api/pricing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchantId,
        per_api_call: parseFloat(per_api_call),
        overdue_api_call: parseFloat(overdue_api_call)
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to save pricing');
    }

    return result;
  } catch (error) {
    console.error('Error saving pricing:', error);
    throw error;
  }
};