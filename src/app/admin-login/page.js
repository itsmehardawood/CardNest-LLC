// updated code for firebase


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Select from "react-select";
import countryCodes from "../lib/Counttycodes";
import { auth } from "../lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { apiFetch } from "../lib/api.js";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showCountryCode, setShowCountryCode] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [apiUserData, setApiUserData] = useState(null);
  const [backendPhoneNumber, setBackendPhoneNumber] = useState("");
  const [formData, setFormData] = useState({
    countryCode: "+1",
    selectedCountry: "United States",
  });

  // Initialize Firebase reCAPTCHA
  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              // console.log("reCAPTCHA solved", response);
            },
            "expired-callback": () => {
              // console.log("reCAPTCHA expired");
              // Reset reCAPTCHA on expiry
              if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
              }
            },
            "error-callback": (error) => {
              console.error("reCAPTCHA error:", error);
            }
          }
        );

        window.recaptchaVerifier.render().then((widgetId) => {
          window.recaptchaWidgetId = widgetId;
          // console.log("reCAPTCHA widget rendered:", widgetId);
        }).catch((error) => {
          console.error("reCAPTCHA render error:", error);
        });
      } catch (error) {
        console.error("reCAPTCHA initialization error:", error);
      }
    }
  }, []);

  const options = countryCodes.map((country) => ({
    value: `${country.code}-${country.name}`,
    label: `${country.flag} ${country.name} (${country.code})`,
  }));

  const isClient = typeof window !== "undefined";

  const handleChange = (selectedOption) => {
    const [code, name] = selectedOption.value.split("-");
    setFormData((prev) => ({
      ...prev,
      countryCode: code,
      selectedCountry: name,
    }));
  };

  const getSelectedCountryInfo = () => {
    const selected = countryCodes.find(
      (country) =>
        country.code === formData.countryCode &&
        country.name === formData.selectedCountry
    );
    return (
      selected ||
      countryCodes.find((country) => country.name === "United States")
    );
  };

  const handleEmailOrPhoneChange = (e) => {
    const newValue = e.target.value;
    setEmailOrPhone(newValue);

    const isEmail = /[a-zA-Z]/.test(newValue);
    setShowCountryCode(!isEmail);

    if (error) setError("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!isOtpMode) {
      // Step 1: Call login API first
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const requestBody = {
          country_code: formData.countryCode,
          login_input: emailOrPhone,
        };

        // console.log("Sending admin login request:", JSON.stringify(requestBody, null, 2));

        const response = await apiFetch(
          "/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await response.json();
        // console.log("Admin login API response:", data);

        if (!response.ok || !data.status) {
          throw new Error(data.message || "Login failed. Please check your credentials.");
        }

        // Step 2: Store user data in localStorage immediately after successful API call
     const userData = data; // store entire backend response (or replace with your desired structure)
localStorage.setItem("userData", JSON.stringify(userData));
setApiUserData(userData);

// console.log("Admin user data stored in localStorage:", userData);

        // Step 3: Always send Firebase OTP using phone number from backend response
        const phoneFromBackend = data.user?.phone_no || data.phone_no;
        
        if (!phoneFromBackend) {
          throw new Error("No phone number received from backend for OTP verification.");
        }

        // Store the phone number from backend for display and resend functionality
        setBackendPhoneNumber(phoneFromBackend);

        // Always send Firebase OTP to the phone number from backend
        const fullPhoneNumber = `${formData.countryCode}${phoneFromBackend}`;
        // console.log("Sending Firebase OTP to:", fullPhoneNumber);

        // Validate phone number format
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(fullPhoneNumber)) {
          throw new Error(`Invalid phone number format: ${fullPhoneNumber}`);
        }

        // Ensure reCAPTCHA is ready
        if (!window.recaptchaVerifier) {
          throw new Error("reCAPTCHA verifier not initialized");
        }

        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
        
        setConfirmationResult(confirmation);
        setIsOtpMode(true);
        setSuccess("Verification code sent to your phone.");
        // console.log("Firebase OTP sent successfully");

      } catch (err) {
        console.error("Error in admin login process:", err);
        
        // Handle Firebase-specific errors
        if (err.code === "auth/invalid-phone-number") {
          setError("Invalid phone number format. Please check your number.");
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        } else if (err.code === "auth/quota-exceeded") {
          setError("SMS quota exceeded. Please try again later.");
        } else {
          setError(err.message || "Login failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Step 4: Verify Firebase OTP
      handleOtpVerification();
    }
  };

const handleOtpVerification = async () => {
  if (!confirmationResult) {
    setOtpError("Verification session expired. Please try again.");
    return;
  }

  setLoading(true);
  setOtpError("");

  try {
    // Verify OTP with Firebase
    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    // console.log("Firebase OTP verified successfully:", user);

    // Update localStorage with Firebase UID
    if (apiUserData) {
      const userData = {
        ...apiUserData,
        user: {
          ...apiUserData.user,
          firebaseUid: user.uid,
          firebasePhone: user.phoneNumber,
          otp_verified: true
        }
      };

      localStorage.setItem("userData", JSON.stringify(userData));
      setApiUserData(userData);

      // console.log("Updated admin user data with Firebase info:", userData);
    }

    setSuccess("Phone verified successfully! Checking admin access...");

    // Only SUPER_ADMIN is allowed for admin panel
    const userRole = apiUserData?.user?.role;

    if (userRole === "SUPER_ADMIN") {
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } else {
      setTimeout(() => {
        setSuccess(""); // Clear success message
        setOtpError("Invalid user. Only superadmin users are allowed to access the admin panel.");
      }, 1500);
    }

  } catch (err) {
    console.error("OTP verification error:", err);

    if (err.code === "auth/invalid-verification-code") {
      setOtpError("Invalid verification code. Please check and try again.");
    } else if (err.code === "auth/code-expired") {
      setOtpError("Verification code has expired. Please request a new one.");
    } else {
      setOtpError("Verification failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};


  const handleBack = () => {
    setIsOtpMode(false);
    setOtp("");
    setOtpError("");
    setConfirmationResult(null);
    setApiUserData(null);
    setBackendPhoneNumber("");
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setOtpError("");
    setSuccess("");

    try {
      // Use the phone number from backend response
      const fullPhoneNumber = `${formData.countryCode}${backendPhoneNumber}`;
      // console.log("Resending Firebase OTP to:", fullPhoneNumber);

      // Validate phone number format
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(fullPhoneNumber)) {
        throw new Error(`Invalid phone number format: ${fullPhoneNumber}`);
      }

      // Ensure reCAPTCHA is ready
      if (!window.recaptchaVerifier) {
        throw new Error("reCAPTCHA verifier not initialized");
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      
      setConfirmationResult(confirmation);
      setSuccess("Verification code resent successfully!");
      
      // console.log("Firebase OTP resent successfully");
    } catch (err) {
      console.error("Resend OTP error:", err);
      setOtpError("Failed to resend verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    if (otpError) setOtpError("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-[60%] object-fill"
        >
          <source
            src="https://d3rfyed8zhcsm.cloudfront.net/Header2.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-25">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-xl sm:text-2xl my-2 font-bold text-white drop-shadow-lg"
              >
                <video autoPlay loop muted playsInline width="70">
                  <source src="https://dw1u598x1c0uz.cloudfront.net/CardNest%20Logo%20WebM%20version.webm" alt="CardNest Logo" />
                  Your browser does not support the video tag.
                </video>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Main Card */}
          <div className="rounded-xl text-black bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl p-6 sm:p-8 transition-all duration-300 ease-in-out transform">
            <form onSubmit={handleSignIn}>
              {!isOtpMode ? (
                // Admin Login Form
                <>
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                      <svg
                        className="h-8 w-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-medium text-gray-900">
                      Admin Access
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      Superadmin login required
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                      {success}
                    </div>
                  )}

                  <div className="space-y-4 sm:space-y-6">
                    {/* Country Selector */}
                    <div>
                      <label
                        htmlFor="countryCode"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Select your country
                      </label>

                      <Select
                        id="countryCode"
                        name="countryCode"
                        value={options.find(
                          (opt) =>
                            opt.value ===
                            `${formData.countryCode}-${formData.selectedCountry}`
                        )}
                        onChange={handleChange}
                        isDisabled={loading}
                        options={options}
                        placeholder="Select your country"
                        className="text-sm sm:text-base"
                        classNamePrefix="react-select"
                      />
                    </div>

                    {/* Email/Phone Input */}
                    <div>
                      <label
                        htmlFor="emailOrPhone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Admin Email or Phone
                      </label>
                      <div className="flex">
                        {showCountryCode && (
                          <div className="flex-shrink-0 flex items-center px-3 py-3 border border-gray-300 border-r-0 rounded-l-md shadow-sm bg-gray-50 text-sm text-gray-600">
                            {getSelectedCountryInfo().flag} {formData.countryCode || "+1"}
                          </div>
                        )}

                        <input
                          id="emailOrPhone"
                          type="text"
                          value={emailOrPhone}
                          onChange={handleEmailOrPhoneChange}
                          disabled={loading}
                          className={`flex-1 min-w-0 px-3 py-3 border border-gray-300 ${
                            showCountryCode ? "rounded-r-md" : "rounded-md"
                          } shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/90 disabled:bg-gray-100 text-sm sm:text-base`}
                          placeholder="Enter admin email or phone number"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        loading || !emailOrPhone.trim() || !formData.countryCode
                      }
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? "Signing in..." : "Admin Sign In"}
                    </button>

                    <div className="text-center">
                      <span className="text-sm text-gray-600">
                        Business user?{" "}
                        <Link
                          href="/login"
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          Business Login
                        </Link>
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                // OTP Form
                <>
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={loading}
                      className="flex items-center text-red-600 hover:text-red-500 text-sm font-medium disabled:text-gray-400"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
                  </div>

                  <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">
                      Verify Admin Access
                    </h2>
                    <p className="text-sm text-gray-600 break-words">
                      We sent a 6-digit code to {getSelectedCountryInfo().flag}{" "}
                      {formData.countryCode} {backendPhoneNumber}
                    </p>
                  </div>

                  {/* OTP Error Message */}
                  {otpError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                      {otpError}
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                      {success}
                    </div>
                  )}

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-gray-700 mb-2 text-center"
                      >
                        Enter verification code
                      </label>
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        disabled={loading}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-center text-lg sm:text-xl tracking-widest bg-white/90 disabled:bg-gray-100"
                        placeholder="000000"
                        maxLength="6"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? "Verifying..." : "Verify & Access Admin"}
                    </button>

                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-600">
                        Did not receive the code?{" "}
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={loading}
                          className="font-medium text-red-600 hover:text-red-500 disabled:text-gray-400"
                        >
                          {loading ? "Sending..." : "Resend"}
                        </button>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Firebase reCAPTCHA container - Required for Firebase phone auth */}
      <div id="recaptcha-container"></div>

      {/* Footer */}
      <footer className="relative z-10 bg-transparent py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="flex items-center justify-center space-x-4 text-sm text-black/90 drop-shadow-lg">
              <span>© CardNest Admin</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">
                Privacy & terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}