'use client'
import Link from 'next/link'
import React, { useState } from 'react'


function Navbar() {
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
        {/* Navbar */}
      <nav className="bg-white backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
           <Link href="/" className="flex-shrink-0">
  <video autoPlay loop muted playsInline width="70">
    <source src="https://dw1u598x1c0uz.cloudfront.net/CardNest%20Logo%20Video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</Link>


         

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">
                  Sign in
                </Link>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                  Get started
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white ">
                    <div className="pt-4 pb-3 border-t border-gray-200">
                  <Link href="/login" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 text-base font-medium">
                    Sign in
                  </Link>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium mx-3 mt-2">
                    Get started
                  </button>
                </div>
              </div>  
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
