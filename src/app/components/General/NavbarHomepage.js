'use client'
import Link from "next/link";
import React from "react";
const { useState, useEffect } = require("react");


function NavbarHomepage() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const userObj = parsedUser.user || parsedUser;
        if (userObj && userObj.merchant_id) {
          setIsLoggedIn(true);
          setUserRole(userObj.role);
        }
      } catch (e) {
        console.error("Error parsing userData:", e);
        setIsLoggedIn(false);
        setUserRole(null);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const scrollToSection = (sectionId) => {
    // First close the menu and restore scroll
    setIsMenuOpen(false);
    
    // Use setTimeout to ensure the body scroll is restored before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100); // Small delay to ensure body styles are restored
  };

  // Function to get the correct link and text based on user role
  const getAuthLink = () => {
    if (!isLoggedIn) {
      return { href: "/login", text: "Sign In" };
    }
    
    if (userRole === "SUPER_ADMIN") {
      return { href: "/admin", text: "Admin Panel" };
    }
    
    if (userRole === "BUSINESS_USER" || userRole === "ENTERPRISE_USER") {
      return { href: "/dashboard", text: "Dashboard" };
    }
    
    // Default fallback
    return { href: "/login", text: "Sign In" };
  };

  const authLink = getAuthLink();

  return (
    <nav
      className={`fixed w-full  lg:py-1 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:max-w-6xl">
        <div className="flex justify-between items-center py-1">
          {/* Logo */}
          <div className="text-xl sm:text-2xl font-bold">
            <video autoPlay loop muted playsInline width="70">
<source src="https://dw1u598x1c0uz.cloudfront.net/CardNest%20Logo%20WebM%20version.webm" alt="CardNest Logo" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Desktop Navigation - Only show on large screens */}
          <div className="hidden lg:flex space-x-8 ">
            <button
              onClick={() => scrollToSection("hero")}
              className={`hover:text-teal-600 transition-colors duration-200 font-medium ${
                isScrolled ? "text-gray-800" : "text-white hover:text-teal-300"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className={`hover:text-teal-600 transition-colors duration-200 font-medium ${
                isScrolled ? "text-gray-800" : "text-white hover:text-teal-300"
              }`}
            >
              About
            </button>

            <button
              onClick={() => scrollToSection("benefits")}
              className={`hover:text-teal-600 transition-colors duration-200 font-medium ${
                isScrolled ? "text-gray-800" : "text-white hover:text-teal-300"
              }`}
            >
              Benefits
            </button>

            <button
              onClick={() => scrollToSection("pricing")}
              className={`hover:text-teal-600 transition-colors duration-200 font-medium ${
                isScrolled ? "text-gray-800" : "text-white hover:text-teal-300"
              }`}
            >
              Pricing
            </button>

            <button
              onClick={() => scrollToSection("features")}
              className={`hover:text-teal-600 transition-colors duration-200 font-medium ${
                isScrolled ? "text-gray-800" : "text-white hover:text-teal-300"
              }`}
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className={`hover:text-teal-600 transition-colors duration-200 font-medium ${
                isScrolled ? "text-gray-800" : "text-white hover:text-teal-300"
              }`}
            >
              Contact
            </button>

  <div className="relative group">
  <button
    className={`hover:text-teal-600 transition-colors duration-200 font-medium ${
      isScrolled ? "text-gray-800" : "text-white hover:text-teal-300"
    }`}
  >
    Documents
  </button>
  <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg mt-2 min-w-[200px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
    <a
      href="https://d2puivvgaibigt.cloudfront.net/CardNest%20Privacy%20Policy.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
    >
      Privacy Policy
    </a>
    <a
      href="https://d2puivvgaibigt.cloudfront.net/CardNest%20LLC%20Customer%20Terms%20&%20Agreement.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
    >
      Terms & Agreement
    </a>

  </div>
</div>

          </div>

          {/* CTA Button - Only show on large screens */}
          <div className="hidden lg:block space-x-5">
            <Link
              href={authLink.href}
              className={`hover:text-teal-600 transition-colors duration-200 font-medium mr-6 ${
                isScrolled ? "text-gray-800" : "text-white hover:text-teal-300"
              }`}
            >
              {authLink.text}
            </Link>

            <Link
              href="/signup"
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${
                isScrolled
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-white text-teal-600 hover:bg-gray-100"
              }`}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button - Show on medium and small screens */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`focus:outline-none p-2 transition-colors duration-200 ${
                isScrolled
                  ? "text-gray-800 hover:text-teal-600"
                  : "text-white hover:text-teal-300"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay - Show on medium and small screens */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 bg-opacity-50"
              onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Sidebar - Fixed with explicit dimensions */}
            <div
              className={`absolute top-0 right-0 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
                isMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
              style={{
                width: 'min(320px, 85vw)',
                height: '100vh',
                minHeight: '100vh',
                maxHeight: '100vh'
              }}
            >
              {/* Sidebar Header - Fixed */}
              <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-900 flex-shrink-0">
                <div className="text-xl font-bold text-white">CardNest</div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-teal-300 p-2 transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Sidebar Navigation - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-900 overscroll-contain">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="text-left text-white hover:text-teal-300 hover:bg-gray-800 transition-all duration-200 font-medium py-4 px-4 rounded-lg w-full"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left text-white hover:text-teal-300 hover:bg-gray-800 transition-all duration-200 font-medium py-4 px-4 rounded-lg w-full"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("benefits")}
                  className="text-left text-white hover:text-teal-300 hover:bg-gray-800 transition-all duration-200 font-medium py-4 px-4 rounded-lg w-full"
                >
                  Benefits
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-left text-white hover:text-teal-300 hover:bg-gray-800 transition-all duration-200 font-medium py-4 px-4 rounded-lg w-full"
                >
                  About
                </button>

                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-left text-white hover:text-teal-300 hover:bg-gray-800 transition-all duration-200 font-medium py-4 px-4 rounded-lg w-full"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left text-white hover:text-teal-300 hover:bg-gray-800 transition-all duration-200 font-medium py-4 px-4 rounded-lg w-full"
                >
                  Contact
                </button>

                {/* Documents Section */}
                <div className="border-t border-gray-700 pt-4">
                <p className="text-white font-medium px-4 mb-2">Documents</p>
                <a
                    href="https://d2puivvgaibigt.cloudfront.net/CardNest%20Privacy%20Policy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-left text-white hover:text-teal-300 hover:bg-gray-800 transition-all duration-200 font-medium py-3 px-4 rounded-lg w-full"
                >
                    Privacy Policy
                </a>
                <a
                    href="https://d2puivvgaibigt.cloudfront.net/CardNest%20LLC%20Customer%20Terms%20&%20Agreement.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-left text-white hover:text-teal-300 hover:bg-gray-800 transition-all duration-200 font-medium py-3 px-4 rounded-lg w-full"
                >
                    Terms & Agreement
                </a>
        
                </div>

                {/* Sign In Link */}
                <div className="pt-4 border-t border-gray-700">
                  <Link
                    href={authLink.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-left text-white hover:text-teal-300 hover:bg-gray-800 transition-all duration-200 font-medium py-4 px-4 rounded-lg w-full"
                  >
                    {authLink.text}
                  </Link>
                </div>

                {/* CTA Button */}
                <div className="pt-2 pb-6">
                  <Link
                    href="/signup"
                    className="bg-teal-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 w-full text-center shadow-lg block"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavbarHomepage