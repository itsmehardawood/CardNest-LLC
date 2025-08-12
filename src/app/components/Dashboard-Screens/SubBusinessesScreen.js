// "use client";

// import React from 'react';
// import { Building2 } from 'lucide-react';

// const SubBusinessesScreen = () => {
//   return (
//     <div className="min-h-screen bg-black p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="text-center">
//             <Building2 className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
//             <h1 className="text-3xl font-bold text-white mb-4">Sub Businesses</h1>
//             <p className="text-lg text-gray-400 mb-8">This section is in progress yet</p>
//             <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
//               <p className="text-gray-300">
//                 We are working  to bring you comprehensive sub-business management. 
//                 This feature will be available soon!
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubBusinessesScreen;


"use client";

import React, { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import AddSubBusiness from './AddSubBusiness';

const SubBusinessesScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSubBusinessAdded = (newBusiness) => {
    // Handle the new business data here
    console.log("New sub-business added:", newBusiness);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Building2 className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Sub Businesses</h1>
            <p className="text-lg text-gray-400 mb-8">This section is in progress yet</p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md mx-auto mb-8">
              <p className="text-gray-300">
                We are working to bring you comprehensive sub-business management. 
                This feature will be available soon!
              </p>
            </div>
            
            {/* Add Sub Business Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Sub-Business (Demo)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Sub Business Modal */}
      {showAddModal && (
        <AddSubBusiness
          onSubBusinessAdded={handleSubBusinessAdded}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default SubBusinessesScreen;