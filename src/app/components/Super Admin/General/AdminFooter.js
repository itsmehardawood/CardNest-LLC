// import React from 'react';

// const DashboardFooter = () => {
//   return (
//     <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-600 space-y-2 sm:space-y-0">
//           <span className="text-xs sm:text-sm">
//             © CardNest 2025 Super Admin Dashboard. All rights reserved.
//           </span>
//           <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
//             <span>Version 2.1.0</span>
//             <span className="hidden sm:inline">•</span>
//             <a 
//               href="#" 
//               className="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1"
//             >
//               Documentation
//             </a>
//             <span className="hidden sm:inline">•</span>
//             <a 
//               href="#" 
//               className="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1"
//             >
//               Support
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default DashboardFooter;




import React from 'react';

const DashboardFooter = () => {
  return (
    <footer className="bg-black border-t border-gray-800 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-300 space-y-2 sm:space-y-0">
          <span className="text-xs sm:text-sm">
            © CardNest 2025 Super Admin Dashboard. All rights reserved.
          </span>
          <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
            <span>Version 2.1.0</span>
            <span className="hidden sm:inline">•</span>
            <a 
              href="#" 
              className="text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1"
            >
              Documentation
            </a>
            <span className="hidden sm:inline">•</span>
            <a 
              href="#" 
              className="text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;