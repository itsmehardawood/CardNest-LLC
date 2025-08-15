import React, { useState } from 'react';

const PageHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    localStorage.clear();
    window.location.href = '/admin-login'; // or '/'
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white px-4 sm:px-6 py-3 sm:py-4 shadow-lg z-50 border-b border-gray-700">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left section */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl text-white font-semibold truncate">
            <span className="hidden sm:inline">Super Admin Dashboard</span>
            <span className="sm:hidden">Admin Panel</span>
          </h1>
          <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-400">
            <span>•</span>
            <span>Control Panel</span>
          </div>
        </div>
        
        {/* Right section - Desktop */}
        <div className="hidden sm:flex items-center space-x-4 lg:space-x-6">
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-400">Online</span>
            </div>
            <span className="text-sm text-gray-400 hidden lg:inline">Welcome, Admin!</span>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* <button 
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
              title="Settings"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button> */}
            
            <button 
              onClick={handleLogout}
              className="text-sm  text-red-400 hover:text-red-500 px-2 sm:px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
             
            >
              <span className="hidden sm:inline">Logout</span>
              <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right section - Mobile */}
        <div className="sm:hidden flex items-center space-x-2">
          {/* Status indicator for mobile */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-lg">
          <div className="px-4 py-3 space-y-3">
            {/* <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Status: Online</span>
            </div> */}
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <button 
                className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
                title="Settings"
              >
                <span className="text-gray-400">Welcome, Admin!</span>
              </button>
              
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-2 text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{color: '#e0aa3e'}}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PageHeader;