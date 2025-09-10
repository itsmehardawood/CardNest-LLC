
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Calculator, ArrowRight } from "lucide-react";
import AddSubBusiness from "../Dashboard-Screens/AddSubBusiness";
import { apiFetch } from "@/app/lib/api.js";

export default function EnterpriseSelection() {
  const router = useRouter();
  const [businessTypeAnswer, setBusinessTypeAnswer] = useState(null); // null, 'yes', 'no'
  const [apiCount, setApiCount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showAddSubBusiness, setShowAddSubBusiness] = useState(false);



 


  const handleBusinessTypeSelection = (answer) => {
    setBusinessTypeAnswer(answer);
    setError(null);

    // If user selects "yes", show the AddSubBusiness component
    if (answer === "yes") {
      setShowAddSubBusiness(true);
    }
  };

  const handleSubBusinessAdded = (subBusinessData) => {
    // Handle successful submission from AddSubBusiness component
    console.log("Sub-businesses added:", subBusinessData);
    alert(
      "Enterprise package details submitted successfully! Our sales team will contact you soon."
    );
    router.push("/dashboard");
  };

  const handleCloseAddSubBusiness = () => {
    setShowAddSubBusiness(false);
    // Optionally reset the selection to go back to the question
    // setBusinessTypeAnswer(null);
  };

  const handleApiCountSubmit = async () => {

  
    setSubmitting(true);
    setError(null);

    try {
      if (!apiCount || parseInt(apiCount) <= 500) {
        throw new Error("Please enter minimum of 500 API count for custom package");
      }

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const merchantId = userData.merchant_id;

      if (!merchantId) {
        throw new Error("User data not found. Please login again.");
      }

      // Prepare API request data
      const requestData = {
        merchant_id: merchantId,
        package_id: "3",
        subscription_date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
        custom_api_count: apiCount,
      };

      const response = await fetch(
        "https://admin.cardnest.io/api/Subscriptions/customStore",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(
          result.message || "Failed to create custom subscription"
        );
      }

      // Extract custom price from API response
      const customPrice = result.data.subscription.custom_price;
      const perApiPrice = result.data.per_api_price;

      // Store the custom pricing data for the payment page
      localStorage.setItem(
        "customApiPricing",
        JSON.stringify({
          apiCount: parseInt(apiCount),
          customPrice: customPrice,
          perApiPrice: parseFloat(perApiPrice),
          subscriptionId: result.data.subscription.id,
          merchantId: result.data.merchant_id,
          isCustomPlan: true,
        })
      );

      // Redirect to payment page with plan 3
      router.push(`/payments/3`);
    } catch (err) {
      console.error("Error processing API count:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetSelection = () => {
    setBusinessTypeAnswer(null);
    setError(null);
    setApiCount("");
    setShowAddSubBusiness(false);
  };

  return (
    <>
      {/* Simple Navbar with Logo */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <video autoPlay loop muted playsInline width="70">
              <source
                src="https://dw1u598x1c0uz.cloudfront.net/CardNest%20Logo%20WebM%20version.webm"
                alt="CardNest Logo"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
              <Building2 className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the enterprise option that best fits your business needs
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8 lg:p-12">
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {businessTypeAnswer === null ? (
                /* Initial Question */
                <div className="text-center space-y-8">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 leading-relaxed">
                      Are you a business that has an affiliate, provides
                      services to merchants, or other businesses and would you
                      like to resell our solution/service to these businesses
                      that seek services from you?
                    </h2>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <button
                      onClick={() => handleBusinessTypeSelection("yes")}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      <span>Yes</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleBusinessTypeSelection("no")}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      <span>No</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
                    <div className="space-y-3 text-sm text-gray-700">
                      <p>
                        <strong>Yes:</strong> You will be directed to our
                        Enterprise Reseller Package for managing multiple
                        businesses and clients.
                      </p>
                      <p>
                        <strong>No:</strong> You will be shown our Custom API
                        Package for your specific business needs.
                      </p>
                    </div>
                  </div>
                </div>
              ) : businessTypeAnswer === "yes" ? (
                /* Enterprise Package Selection */
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                    <div className="border-l-4 border-indigo-500 pl-6">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Enterprise Reseller Package
                      </h2>
                      <p className="text-gray-600">
                        Manage multiple businesses and clients with our
                        comprehensive enterprise solution.
                      </p>
                    </div>
                    <button
                      onClick={resetSelection}
                      className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      ← Back to Question
                    </button>
                  </div>

                  <div className="max-w-2xl mx-auto text-center space-y-6">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                        Enterprise Features
                      </h3>
                      <div className="space-y-2 text-sm text-indigo-800 text-left">
                        <p>• Manage unlimited sub-businesses</p>
                        <p>
                          • Complete business and account holder information
                        </p>
                        <p>• Document upload capabilities</p>
                        <p>• Bulk management and operations</p>
                        <p>• Dedicated support and onboarding</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowAddSubBusiness(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mx-auto"
                    >
                      <Building2 className="w-5 h-5" />
                      <span>Set Up Sub-Businesses</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-sm text-gray-500">
                      Click above to start adding your sub-businesses with
                      complete information including business details, account
                      holders, and required documents.
                    </p>
                  </div>
                </div>
              ) : (
                /* API Count Form */
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                    <div className="text-start flex-1">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                        <Calculator className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                        Custom API Package
                      </h2>
                      <p className="text-gray-600">
                        Perfect for businesses with specific API requirements.
                        Enter your monthly API usage and get custom pricing.
                      </p>
                    </div>
                    <button
                      onClick={resetSelection}
                      className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 ml-4"
                    >
                      ← Back to Question
                    </button>
                  </div>

                  <div className="max-w-md mx-auto">
                    <div className="space-y-4">
                       <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly API Count *
                        </label>
                        <input
                          type="number"
                          value={apiCount}
                          onChange={(e) => setApiCount(e.target.value)}
                          className="w-full px-4 py-4 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-center text-lg font-medium bg-white"
                          placeholder="e.g., 10000"
                          min="1"
                          required
                          disabled={submitting}
                        />
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                        <h4 className="font-semibold text-emerald-900 mb-3">
                          Information
                        </h4>
                        <div className="space-y-2 text-sm text-emerald-800">
                          <p>
                            • Custom pricing will be calculated based on your
                            API usage
                          </p>
                          <p>• Final price will be shown on the next page</p>
                          <p>• No commitment required - cancel anytime</p>
                        </div>
                      </div>

                      <button
                        onClick={handleApiCountSubmit}
                        disabled={
                          submitting || !apiCount || parseInt(apiCount) <= 0
                        }
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Get Custom Pricing</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Need help choosing? Contact our sales team at{" "}
              <span className="text-indigo-600 font-medium">
                support@cardnest.io
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* AddSubBusiness Modal */}
      {showAddSubBusiness && (
        <AddSubBusiness
          onSubBusinessAdded={handleSubBusinessAdded}
          onClose={handleCloseAddSubBusiness}
          isEditing={false}
        />
      )}
    </>
  );
}
