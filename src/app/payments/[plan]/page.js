"use client";

import React, { useState, use, useMemo, useEffect, useRef } from "react";
import { notFound, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { decryptWithAES128 } from "@/app/lib/decrypt";
// import ContactForm from "@/app/components/PaymentScreen/ContactForm";
// import PaymentHeader from "@/app/components/PaymentScreen/PaymentHeader";
// import PlanDetails from "@/app/components/PaymentScreen/PlanDetails";
// import PaymentForm from "@/app/components/PaymentScreen/PaymentForm";
import Link from "next/link";
import { apiFetch } from "@/app/lib/api.js";
import ACHPaymentForm from "@/app/components/General/AchPayment";
import PlanDetails from "@/app/components/Dashboard-Screens/PaymentScreen/PlanDetails";
import PaymentHeader from "@/app/components/Dashboard-Screens/PaymentScreen/PaymentHeader";
import ContactForm from "@/app/components/Dashboard-Screens/PaymentScreen/ContactForm";
import PaymentForm from "@/app/components/Dashboard-Screens/PaymentScreen/PaymentForm";

export default function PaymentPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);

  // State management
  const [authToken, setAuthToken] = useState(null);
  const [decryptedCardData, setDecryptedCardData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [encryptedData, setEncryptedData] = useState(null);
  const [customApiPricing, setCustomApiPricing] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ach'); // 'card' or 'ach'
  const [achPaymentResult, setAchPaymentResult] = useState(null);
  const pollingRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "US",
    companyName: "",
    contactName: "",
    phone: "",
    businessType: "",
    monthlyVolume: "",
    currentProvider: "",
    message: "",
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    CVV: "",
  });

  // Helper functions
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const pollEncryptedData = async (scanId) => {
    try {
      const response = await apiFetch(
        "/scan/getEncryptedData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scanId }),
        }
      );

      const result = await response.json();

      if (response.ok && result.data && result.data.encrypted_data) {
        console.log("Encrypted data received:", result.data);
        setEncryptedData(result.data.encrypted_data);

        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }

        return true;
      }
      return false;
    } catch (err) {
      console.error("Error polling encrypted data:", err);
      return false;
    }
  };

  const startPolling = (scanId) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      await pollEncryptedData(scanId);
    }, 30000);

    pollEncryptedData(scanId);
  };

  const generateScanToken = async (userObj) => {
    setScanLoading(true);
    setScanError(null);

    try {
      const requestData = {
        merchantId: userObj.merchant_id,
        merchantcontact: userObj?.phone_no || userObj?.phone || "",
        isMobile: isMobileDevice() ? "true" : "false",
      };

      const response = await apiFetch(
        "/merchantscan/generateToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate scan token");
      }

      console.log("Scan token generated:", data);

      if (data.authToken) {
        setAuthToken(data.authToken);
        localStorage.setItem("authToken", data.authToken);
      }

      if (data.scanURL) {
        localStorage.setItem("scanURL", data.scanURL);
      }

      if (data.scanID) {
        localStorage.setItem("scanID", data.scanID);
        startPolling(data.scanID);
      }

      setScanData(data);
    } catch (err) {
      console.error("Error generating scan token:", err);
      setScanError(err.message);
    } finally {
      setScanLoading(false);
    }
  };

  const decryptAndPopulateCardData = async () => {
    try {
      if (!authToken || !encryptedData) {
        console.log("Missing authToken or encryptedData");
        return;
      }

      const decodedToken = jwtDecode(authToken);
      const encryptionKey = decodedToken.encryption_key;

      if (!encryptionKey) {
        throw new Error("encryption_key not found in JWT token");
      }

      const decryptedData = decryptWithAES128(encryptedData, encryptionKey);
      console.log("Decrypted card data:", decryptedData);

      if (!decryptedData.complete_scan) {
        throw new Error("Card scan was not completed successfully");
      }

      const finalOcr = decryptedData.final_ocr;
      if (!finalOcr) {
        throw new Error("Card OCR data not found");
      }

      const cardNumber =
        finalOcr.card_number?.value || finalOcr.account_number?.value;
      const cardholderName = finalOcr.cardholder_name?.value;
      const expiryDate = finalOcr.expiry_date?.value;

      if (!cardNumber) {
        throw new Error("Card number not detected in scan");
      }
      if (!expiryDate) {
        throw new Error("Expiry date not detected in scan");
      }

      setFormData((prev) => ({
        ...prev,
        cardNumber: cardNumber,
        cardholderName: cardholderName || "",
        expiryDate: expiryDate,
        CVV: "",
      }));

      setDecryptedCardData({
        ...decryptedData,
        extractedData: {
          cardNumber,
          cardholderName,
          expiryDate,
          CVV: "",
        },
      });

      if (decryptedData.confidence < 80) {
        console.warn("Low confidence score:", decryptedData.confidence);
      }
    } catch (error) {
      console.error("Error decrypting card data:", error);
      setError(`Failed to process card information: ${error.message}`);
    }
  };

  const mapApiDataToPlan = (apiPlan, customPricing = null) => {
    const planStyles = {
      Standard: {
        gradient: "from-purple-500 to-purple-700",
        bgGradient: "from-purple-100 to-purple-50",
        buttonColor: "bg-purple-500 hover:bg-purple-600",
        popular: false,
      },
      Premium: {
        gradient: "from-cyan-400 to-blue-500",
        bgGradient: "from-cyan-50 to-blue-50",
        buttonColor: "bg-cyan-500 hover:bg-cyan-600",
        popular: true,
      },
      Enterprise: {
        gradient: "from-pink-500 to-purple-600",
        bgGradient: "from-pink-50 to-purple-50",
        buttonColor: "bg-pink-500 hover:bg-pink-600",
        popular: false,
      },
    };

    const style = planStyles[apiPlan.package_name] || planStyles["Standard"];
    const isEnterprise = apiPlan.package_name === "Enterprise";

    const staticFeatures = [
      { text: "Front-side card scan", included: true },
      { text: "Back-side scan", included: true },
      { text: "AI fraud detection", included: true },
      { text: "CardNest protection", included: true },
      { text: "ML data accuracy", included: true },
      { text: "PCI/DSS security", included: true },
      { text: "API integration", included: true },
      { text: "24/7 fraud watch", included: true },
    ];

    const features = [...staticFeatures];
    
    if (customPricing && customPricing.isCustomPlan && apiPlan.id === 3) {
      features.push({ 
        text: `${customPricing.apiCount.toLocaleString()} Custom API Scans`, 
        included: true 
      });
    } else if (isEnterprise) {
      features.push({ text: "Custom pricing/options", included: true });
    } else {
      features.push({
        text: `${apiPlan.overage_rate}/extra scan`,
        included: true,
      });
    }

    let planPrice = isEnterprise ? "SALES" : `${apiPlan.package_price}`;
    let planSubtitle = isEnterprise ? "CONTACT SUPPORT" : "FOR BUSINESS";
    let apiScans = isEnterprise ? "UNLIMITED*" : `${apiPlan.monthly_limit} API SCANS`;

    if (customPricing && customPricing.isCustomPlan && apiPlan.id === 3) {
      planPrice = `${customPricing.customPrice.toFixed(2)}`;
      planSubtitle = "CUSTOM PACKAGE";
      apiScans = `${customPricing.apiCount.toLocaleString()} API SCANS`;
    }

    return {
      id: apiPlan.id,
      name: (customPricing?.isCustomPlan && apiPlan.id === 3) ? "CUSTOM ENTERPRISE" : apiPlan.package_name.toUpperCase(),
      subtitle: planSubtitle,
      price: planPrice,
      period: apiPlan.package_period.toUpperCase(),
      apiScans: apiScans,
      gradient: style.gradient,
      bgGradient: style.bgGradient,
      buttonColor: style.buttonColor,
      popular: style.popular,
      features: features,
      originalData: apiPlan,
      customPricing: customPricing,
    };
  };

  // Calculate pricing with 3% tax
  const pricingCalculation = useMemo(() => {
    if (!plan || plan.price === "SALES" || plan.price === "Free") {
      return {
        subtotal: 0,
        tax: 0,
        total: 0,
        taxRate: 0,
        taxName: "Tax",
      };
    }

    const subtotal = parseFloat(plan.price.replace(/[$,]/g, ""));
    const taxRate = 0.03;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
      taxRate,
      taxName: "Tax",
    };
  }, [plan?.price]);

  // ACH Payment handlers
  const handleACHPaymentSuccess = async (result) => {
    console.log("ACH Payment successful:", result);
    setAchPaymentResult(result);
    setNotification("Bank payment completed successfully!");
    
    // Proceed with subscription creation
    await handleFinalSubscription('ach', result);
  };

  const handleACHPaymentError = (errorMessage) => {
    console.error("ACH Payment failed:", errorMessage);
    setError(`Bank payment failed: ${errorMessage}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFinalSubscription = async (paymentType, paymentResult = null) => {
    const userObj = userData?.user || userData;

    if (!userObj?.merchant_id) {
      setError("Merchant ID not found. Please log in again.");
      return;
    }

    try {
      setSubmitting(true);

      // Store payment details if needed
      if (plan.id === 1 || plan.id === 2 || plan.customPricing) {
        const paymentData = {
          merchant_id: userObj.merchant_id,
          email: formData.email,
          billing_address: formData.billingAddress,
          city: formData.city,
          zipcode: formData.zipCode,
          country: formData.country,
          payment_method: paymentType,
          ...(plan.customPricing && {
            custom_api_count: plan.customPricing.apiCount,
            custom_price: plan.customPricing.customPrice,
          }),
          ...(paymentResult && {
            payment_result: paymentResult,
          }),
        };

        console.log("Submitting payment details:", paymentData);

        const paymentResponse = await apiFetch(
          "/payment/storeDetails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
          }
        );

        const paymentResultResponse = await paymentResponse.json();

        if (!paymentResponse.ok) {
          throw new Error(
            paymentResultResponse.message ||
              `Payment API error! status: ${paymentResponse.status}`
          );
        }

        console.log("Payment details stored successfully:", paymentResultResponse);
      }

      // Create subscription
      const subscriptionData = {
        merchant_id: userObj.merchant_id,
        package_id: plan.id,
        subscription_date: new Date().toISOString().split("T")[0],
        payment_method: paymentType,
        ...(paymentType === 'card' && scanData?.scanID && {
          scan_id: scanData.scanID,
        }),
        ...(plan.customPricing && {
          custom_api_count: plan.customPricing.apiCount,
          custom_monthly_price: plan.customPricing.customPrice,
        }),
      };

      console.log("Submitting subscription:", subscriptionData);

      const response = await apiFetch(
        "/Subscriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscriptionData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      if (result.status) {
        console.log("Subscription created successfully:", result);

        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }

        localStorage.removeItem("customApiPricing");
        setNotification("Subscription created successfully!");
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        throw new Error(result.message || "Subscription creation failed");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError(
        err.message || "An error occurred while processing your subscription"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userObj = userData?.user || userData;

    if (!userObj?.merchant_id) {
      setError("Merchant ID not found. Please log in again.");
      return;
    }

    if (!plan) {
      setError("Plan information not available.");
      return;
    }

    // Handle enterprise plans that require contact
    if (plan.price === "SALES" || (plan.name.toLowerCase().includes("enterprise") && !plan.customPricing)) {
      console.log("Contact form submitted:", {
        ...formData,
        plan_id: plan.id,
        merchant_id: userObj.merchant_id,
      });

      alert("Your message has been sent! Our sales team will contact you soon.");
      router.push("/dashboard");
      return;
    }

    // For regular plans, validate payment method requirements
    if (paymentMethod === 'card') {
      if (!scanData) {
        setError("Please complete the card scan process first.");
        return;
      }
      if (!encryptedData) {
        setError("Please complete the card scan process and ensure your card information is captured.");
        return;
      }
    }

    setError(null);

    try {
      // For card payments, proceed with existing card logic
      if (paymentMethod === 'card') {
        await handleFinalSubscription('card');
      }
      // For ACH payments, the flow is handled by the ACH component
    } catch (err) {
      console.error("Payment/Subscription error:", err);
      setError(err.message || "An error occurred while processing your payment/subscription");
    }
  };

  // Effects
  useEffect(() => {
    if (encryptedData && authToken) {
      decryptAndPopulateCardData();
    }
  }, [encryptedData, authToken]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const customPricingData = localStorage.getItem("customApiPricing");
        if (customPricingData) {
          const parsedCustomPricing = JSON.parse(customPricingData);
          setCustomApiPricing(parsedCustomPricing);
          console.log("Custom API pricing found:", parsedCustomPricing);
        }

        const storedUser = localStorage.getItem("userData");
        if (!storedUser) {
          setError("User not logged in. Please log in first.");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const userObj = parsedUser.user || parsedUser;
        setUserData(userObj);

        if (userObj.email) {
          setFormData((prev) => ({ ...prev, email: userObj.email }));
        }

        const response = await apiFetch("/Packages");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.status || !data.data) {
          throw new Error("Invalid API response format");
        }

        const planId = parseInt(resolvedParams.plan);
        const foundPlan = data.data.find((p) => p.id === planId);

        if (!foundPlan) {
          notFound();
          return;
        }

        const customPricing = customPricingData ? JSON.parse(customPricingData) : null;
        const mappedPlan = mapApiDataToPlan(foundPlan, customPricing);
        setPlan(mappedPlan);

        // Only generate scan token for card payments on non-enterprise plans
        if (mappedPlan.price !== "SALES" && (mappedPlan.name.toLowerCase() !== "enterprise" || mappedPlan.customPricing)) {
          await generateScanToken(userObj);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.plan]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
            <Link
              href="/"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg inline-block"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return notFound();
  }

  const isEnterprisePlan = plan.price === "SALES" || (plan.name.toLowerCase().includes("enterprise") && !plan.customPricing);

  return (
    <div className="min-h-screen text-black bg-white">
      <PaymentHeader />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
        <div className="grid lg:grid-cols-2 gap-12">
          <PlanDetails plan={plan} userData={userData} />

          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {notification && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{notification}</p>
                </div>
              )}

              {isEnterprisePlan ? (
                <ContactForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  submitting={submitting}
                />
              ) : (
                <div className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
                                         <div className="grid grid-cols-2 gap-3">
                       <button
                         type="button"
                         onClick={() => setPaymentMethod('ach')}
                         className={`p-3 rounded-lg border-2 transition-all ${
                           paymentMethod === 'ach'
                             ? 'border-green-500 bg-green-50 text-green-700'
                             : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                         }`}
                       >
                         <div className="flex items-center justify-center gap-2">
                           <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="currentColor"/>
                           </svg>
                           Bank Account
                         </div>
                       </button>
                       <button
                        disabled
                         type="button"
                         onClick={() => setPaymentMethod('card')}
                         className={`p-3 rounded-lg border-2 transition-all ${
                           paymentMethod === 'card'
                             ? 'border-blue-500 bg-blue-50 text-blue-700'
                             : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                         }`}
                       >
                         <div className="flex items-center justify-center gap-2">
                           <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                             <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                           </svg>
                           Card Payments Upcoming
                         </div>
                       </button>
                     </div>
                  </div>

                  {/* Payment Form based on selected method */}
                  {paymentMethod === 'card' ? (
                    <PaymentForm
                      plan={plan}
                      formData={formData}
                      handleInputChange={handleInputChange}
                      handleSubmit={handleSubmit}
                      submitting={submitting}
                      notification={notification}
                      scanData={scanData}
                      scanLoading={scanLoading}
                      scanError={scanError}
                      encryptedData={encryptedData}
                      decryptedCardData={decryptedCardData}
                      pollingRef={pollingRef}
                      pricingCalculation={pricingCalculation}
                      generateScanToken={generateScanToken}
                      userData={userData}
                    />
                  ) : (
                    <div className="space-y-6">
                      {/* Basic form fields for ACH */}
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="your@email.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder Name *
                          </label>
                          <input
                            type="text"
                            id="contactName"
                            name="contactName"
                            required
                            value={formData.contactName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Full Name on Bank Account"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                            Billing Address
                          </label>
                          <input
                            type="text"
                            id="billingAddress"
                            name="billingAddress"
                            value={formData.billingAddress}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Street Address"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              required
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              id="zipCode"
                              name="zipCode"
                              required
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="ZIP"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pricing Summary for ACH */}
                      <div className="border-t pt-4">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>${pricingCalculation.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Tax:</span>
                            <span>${pricingCalculation.tax.toFixed(2)}</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-semibold">
                              <span>Total:</span>
                              <span>${pricingCalculation.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ACH Payment Component */}
                      <ACHPaymentForm
                        onPaymentSuccess={handleACHPaymentSuccess}
                        onPaymentError={handleACHPaymentError}
                        formData={formData}
                        disabled={submitting}
                          plan={plan} // Already passed

                        amount={pricingCalculation.total.toFixed(2)}
                          apiFetch={apiFetch} // Add this line

                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}