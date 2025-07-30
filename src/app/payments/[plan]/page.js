// "use client";

// import React, { useState, use, useMemo, useEffect, useRef } from "react";
// import { notFound, useRouter } from "next/navigation";
// import { jwtDecode } from "jwt-decode";
// import { decryptWithAES128 } from "@/app/lib/decrypt";
// import ContactForm from "@/app/components/PaymentScreen/ContactForm";
// import PaymentHeader from "@/app/components/PaymentScreen/PaymentHeader";
// import PlanDetails from "@/app/components/PaymentScreen/PlanDetails";
// import PaymentForm from "@/app/components/PaymentScreen/PaymentForm";
// import Link from "next/link";

// export default function PaymentPage({ params }) {
//   const router = useRouter();
//   const resolvedParams = use(params);

//   // State management
//   const [authToken, setAuthToken] = useState(null);
//   const [decryptedCardData, setDecryptedCardData] = useState(null);
//   const [plan, setPlan] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [notification, setNotification] = useState(null);
//   const [scanData, setScanData] = useState(null);
//   const [scanLoading, setScanLoading] = useState(false);
//   const [scanError, setScanError] = useState(null);
//   const [encryptedData, setEncryptedData] = useState(null);
//   const pollingRef = useRef(null);

//   const [formData, setFormData] = useState({
//     email: "",
//     billingAddress: "",
//     city: "",
//     zipCode: "",
//     country: "US",
//     companyName: "",
//     contactName: "",
//     phone: "",
//     businessType: "",
//     monthlyVolume: "",
//     currentProvider: "",
//     message: "",
//     cardNumber: "",
//     cardholderName: "",
//     expiryDate: "",
//     CVV: "",
//   });

//   // Helper functions
//   const isMobileDevice = () => {
//     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//       navigator.userAgent
//     );
//   };

//   const pollEncryptedData = async (scanId) => {
//     try {
//       const response = await fetch(
//         "https://cardsecuritysystem-8xdez.ondigitalocean.app/api/scan/getEncryptedData",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ scanId }),
//         }
//       );

//       const result = await response.json();

//       if (response.ok && result.data && result.data.encrypted_data) {
//         console.log("Encrypted data received:", result.data);
//         setEncryptedData(result.data.encrypted_data);

//         if (pollingRef.current) {
//           clearInterval(pollingRef.current);
//           pollingRef.current = null;
//         }

//         return true;
//       }
//       return false;
//     } catch (err) {
//       console.error("Error polling encrypted data:", err);
//       return false;
//     }
//   };

//   const startPolling = (scanId) => {
//     if (pollingRef.current) {
//       clearInterval(pollingRef.current);
//     }

//     pollingRef.current = setInterval(async () => {
//       await pollEncryptedData(scanId);
//     }, 30000);

//     pollEncryptedData(scanId);
//   };

//   const generateScanToken = async (userObj) => {
//     setScanLoading(true);
//     setScanError(null);

//     try {
//       const requestData = {
//         merchantId: userObj.merchant_id,
//         merchantcontact: userObj?.phone_no || userObj?.phone || "",
//         isMobile: isMobileDevice() ? "true" : "false",
//       };

//       const response = await fetch(
//         "https://cardsecuritysystem-8xdez.ondigitalocean.app/api/merchantscan/generateToken",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestData),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to generate scan token");
//       }

//       console.log("Scan token generated:", data);

//       if (data.authToken) {
//         setAuthToken(data.authToken);
//         localStorage.setItem("authToken", data.authToken);
//       }

//       if (data.scanURL) {
//         localStorage.setItem("scanURL", data.scanURL);
//       }

//       if (data.scanID) {
//         localStorage.setItem("scanID", data.scanID);
//         startPolling(data.scanID);
//       }

//       setScanData(data);
//     } catch (err) {
//       console.error("Error generating scan token:", err);
//       setScanError(err.message);
//     } finally {
//       setScanLoading(false);
//     }
//   };

//   const decryptAndPopulateCardData = async () => {
//     try {
//       if (!authToken || !encryptedData) {
//         console.log("Missing authToken or encryptedData");
//         return;
//       }

//       const decodedToken = jwtDecode(authToken);
//       const encryptionKey = decodedToken.encryption_key;

//       if (!encryptionKey) {
//         throw new Error("encryption_key not found in JWT token");
//       }

//       const decryptedData = decryptWithAES128(encryptedData, encryptionKey);
//       console.log("Decrypted card data:", decryptedData);

//       if (!decryptedData.complete_scan) {
//         throw new Error("Card scan was not completed successfully");
//       }

//       const finalOcr = decryptedData.final_ocr;
//       if (!finalOcr) {
//         throw new Error("Card OCR data not found");
//       }

//       const cardNumber =
//         finalOcr.card_number?.value || finalOcr.account_number?.value;
//       const cardholderName = finalOcr.cardholder_name?.value;
//       const expiryDate = finalOcr.expiry_date?.value;

//       if (!cardNumber) {
//         throw new Error("Card number not detected in scan");
//       }
//       if (!expiryDate) {
//         throw new Error("Expiry date not detected in scan");
//       }

//       setFormData((prev) => ({
//         ...prev,
//         cardNumber: cardNumber,
//         cardholderName: cardholderName || "",
//         expiryDate: expiryDate,
//         CVV: "",
//       }));

//       setDecryptedCardData({
//         ...decryptedData,
//         extractedData: {
//           cardNumber,
//           cardholderName,
//           expiryDate,
//           CVV: "",
//         },
//       });

//       if (decryptedData.confidence < 80) {
//         console.warn("Low confidence score:", decryptedData.confidence);
//       }
//     } catch (error) {
//       console.error("Error decrypting card data:", error);
//       setError(`Failed to process card information: ${error.message}`);
//     }
//   };

//   const mapApiDataToPlan = (apiPlan) => {
//     const planStyles = {
//       Standard: {
//         gradient: "from-purple-500 to-purple-700",
//         bgGradient: "from-purple-100 to-purple-50",
//         buttonColor: "bg-purple-500 hover:bg-purple-600",
//         popular: false,
//       },
//       Premium: {
//         gradient: "from-cyan-400 to-blue-500",
//         bgGradient: "from-cyan-50 to-blue-50",
//         buttonColor: "bg-cyan-500 hover:bg-cyan-600",
//         popular: true,
//       },
//       Enterprise: {
//         gradient: "from-pink-500 to-purple-600",
//         bgGradient: "from-pink-50 to-purple-50",
//         buttonColor: "bg-pink-500 hover:bg-pink-600",
//         popular: false,
//       },
//     };

//     const style = planStyles[apiPlan.package_name] || planStyles["Standard"];
//     const isEnterprise = apiPlan.package_name === "Enterprise";

//     const staticFeatures = [
//       { text: "Front-side card scan", included: true },
//       { text: "Back-side scan", included: true },
//       { text: "AI fraud detection", included: true },
//       { text: "CardNest protection", included: true },
//       { text: "ML data accuracy", included: true },
//       { text: "PCI/DSS security", included: true },
//       { text: "API integration", included: true },
//       { text: "24/7 fraud watch", included: true },
//     ];

//     const features = [...staticFeatures];
//     if (isEnterprise) {
//       features.push({ text: "Custom pricing/options", included: true });
//     } else {
//       features.push({
//         text: `$${apiPlan.overage_rate}/extra scan`,
//         included: true,
//       });
//     }

//     return {
//       id: apiPlan.id,
//       name: apiPlan.package_name.toUpperCase(),
//       subtitle: isEnterprise ? "CONTACT SUPPORT" : "FOR BUSINESS",
//       price: isEnterprise ? "SALES" : `$${apiPlan.package_price}`,
//       period: apiPlan.package_period.toUpperCase(),
//       apiScans: isEnterprise
//         ? "UNLIMITED*"
//         : `${apiPlan.monthly_limit} API SCANS`,
//       gradient: style.gradient,
//       bgGradient: style.bgGradient,
//       buttonColor: style.buttonColor,
//       popular: style.popular,
//       features: features,
//       originalData: apiPlan,
//     };
//   };

//   // Calculate pricing with 3% tax
//   const pricingCalculation = useMemo(() => {
//     if (!plan || plan.price === "SALES" || plan.price === "Free") {
//       return {
//         subtotal: 0,
//         tax: 0,
//         total: 0,
//         taxRate: 0,
//         taxName: "Tax",
//       };
//     }

//     const subtotal = parseFloat(plan.price.replace(/[$,]/g, ""));
//     const taxRate = 0.03;
//     const tax = subtotal * taxRate;
//     const total = subtotal + tax;

//     return {
//       subtotal,
//       tax,
//       total,
//       taxRate,
//       taxName: "Tax",
//     };
//   }, [plan?.price]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const userObj = userData?.user || userData;

//     if (!userObj?.merchant_id) {
//       setError("Merchant ID not found. Please log in again.");
//       return;
//     }

//     if (!plan) {
//       setError("Plan information not available.");
//       return;
//     }

//     if (plan.price !== "SALES" && plan.name.toLowerCase() !== "enterprise") {
//       if (!scanData) {
//         setError("Please complete the card scan process first.");
//         return;
//       }

//       if (!encryptedData) {
//         setError(
//           "Please complete the card scan process and ensure your card information is captured."
//         );
//         return;
//       }
//     }

//     setSubmitting(true);
//     setError(null);

//     try {
//       if (
//         plan.price === "SALES" ||
//         plan.name.toLowerCase().includes("enterprise")
//       ) {
//         console.log("Contact form submitted:", {
//           ...formData,
//           plan_id: plan.id,
//           merchant_id: userObj.merchant_id,
//         });

//         alert(
//           "Your message has been sent! Our sales team will contact you soon."
//         );
//         router.push("/dashboard");
//         return;
//       }

//       if (plan.id === 1 || plan.id === 2) {
//         const paymentData = {
//           merchant_id: userObj.merchant_id,
//           email: formData.email,
//           billing_address: formData.billingAddress,
//           city: formData.city,
//           zipcode: formData.zipCode,
//           country: formData.country,
//         };

//         console.log("Submitting payment details:", paymentData);

//         const paymentResponse = await fetch(
//           "https://cardsecuritysystem-8xdez.ondigitalocean.app/api/payment/storeDetails",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(paymentData),
//           }
//         );

//         const paymentResult = await paymentResponse.json();

//         if (!paymentResponse.ok) {
//           throw new Error(
//             paymentResult.message ||
//               `Payment API error! status: ${paymentResponse.status}`
//           );
//         }

//         console.log("Payment details stored successfully:", paymentResult);

//         if (!paymentResult.status && paymentResult.status !== undefined) {
//           throw new Error(
//             paymentResult.message || "Payment details storage failed"
//           );
//         }
//       }

//       const subscriptionData = {
//         merchant_id: userObj.merchant_id,
//         package_id: plan.id,
//         subscription_date: new Date().toISOString().split("T")[0],
//         scan_id: scanData?.scanID,
//       };

//       console.log("Submitting subscription:", subscriptionData);

//       const response = await fetch(
//         "https://cardsecuritysystem-8xdez.ondigitalocean.app/api/Subscriptions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(subscriptionData),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message || `HTTP error! status: ${response.status}`
//         );
//       }

//       if (result.status) {
//         console.log("Subscription created successfully:", result);

//         if (pollingRef.current) {
//           clearInterval(pollingRef.current);
//           pollingRef.current = null;
//         }

//         setNotification("Subscription created successfully!");
//         router.push("/dashboard");
//       } else {
//         throw new Error(result.message || "Subscription creation failed");
//       }
//     } catch (err) {
//       console.error("Payment/Subscription error:", err);
//       setError(
//         err.message ||
//           "An error occurred while processing your payment/subscription"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Effects
//   useEffect(() => {
//     if (encryptedData && authToken) {
//       decryptAndPopulateCardData();
//     }
//   }, [encryptedData, authToken]);

//   useEffect(() => {
//     return () => {
//       if (pollingRef.current) {
//         clearInterval(pollingRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const storedUser = localStorage.getItem("userData");
//         if (!storedUser) {
//           setError("User not logged in. Please log in first.");
//           return;
//         }

//         const parsedUser = JSON.parse(storedUser);
//         console.log("User data found in localStorage:", parsedUser);

//         const userObj = parsedUser.user || parsedUser;
//         setUserData(userObj);

//         console.log("User object:", userObj);
//         console.log("Merchant ID:", userObj.merchant_id);

//         if (userObj.email) {
//           setFormData((prev) => ({ ...prev, email: userObj.email }));
//         }

//         const response = await fetch(
//           "https://cardsecuritysystem-8xdez.ondigitalocean.app/api/Packages"
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         if (!data.status || !data.data) {
//           throw new Error("Invalid API response format");
//         }

//         const planId = parseInt(resolvedParams.plan);
//         const foundPlan = data.data.find((p) => p.id === planId);

//         if (!foundPlan) {
//           notFound();
//           return;
//         }

//         const mappedPlan = mapApiDataToPlan(foundPlan);
//         setPlan(mappedPlan);

//         if (
//           mappedPlan.price !== "SALES" &&
//           mappedPlan.name.toLowerCase() !== "enterprise"
//         ) {
//           await generateScanToken(userObj);
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [resolvedParams.plan]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading plan information...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="text-center max-w-md mx-auto p-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
//           <p className="text-red-600 mb-6">{error}</p>
//           <div className="space-x-4">
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
//             >
//               Retry
//             </button>
//             <Link
//               href="/"
//               className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg inline-block"
//             >
//               Go Home
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!plan) {
//     return notFound();
//   }

//   const isEnterprisePlan =
//     plan.price === "SALES" || plan.name.toLowerCase().includes("enterprise");

//   return (
//     <div className="min-h-screen text-black bg-white">
//       <PaymentHeader />

//       <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
//         <div className="grid lg:grid-cols-2 gap-12">
//           <PlanDetails plan={plan} userData={userData} />

//           <div className="lg:sticky lg:top-28 lg:h-fit">
//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               {error && (
//                 <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-red-600 text-sm">{error}</p>
//                 </div>
//               )}

//               {isEnterprisePlan ? (
//                 <ContactForm
//                   formData={formData}
//                   handleInputChange={handleInputChange}
//                   handleSubmit={handleSubmit}
//                   submitting={submitting}
//                 />
//               ) : (
//                 <PaymentForm
//                   plan={plan}
//                   formData={formData}
//                   handleInputChange={handleInputChange}
//                   handleSubmit={handleSubmit}
//                   submitting={submitting}
//                   notification={notification}
//                   scanData={scanData}
//                   scanLoading={scanLoading}
//                   scanError={scanError}
//                   encryptedData={encryptedData}
//                   decryptedCardData={decryptedCardData}
//                   pollingRef={pollingRef}
//                   pricingCalculation={pricingCalculation}
//                   generateScanToken={generateScanToken}
//                   userData={userData}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState, use, useMemo, useEffect, useRef } from "react";
import { notFound, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { decryptWithAES128 } from "@/app/lib/decrypt";
import ContactForm from "@/app/components/PaymentScreen/ContactForm";
import PaymentHeader from "@/app/components/PaymentScreen/PaymentHeader";
import PlanDetails from "@/app/components/PaymentScreen/PlanDetails";
import PaymentForm from "@/app/components/PaymentScreen/PaymentForm";
import Link from "next/link";
import { apiFetch } from "@/app/lib/api.js";

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
    
    // Handle custom pricing for enterprise plan
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

    // Determine price and display info
    let planPrice = isEnterprise ? "SALES" : `${apiPlan.package_price}`;
    let planSubtitle = isEnterprise ? "CONTACT SUPPORT" : "FOR BUSINESS";
    let apiScans = isEnterprise ? "UNLIMITED*" : `${apiPlan.monthly_limit} API SCANS`;

    // Override for custom pricing ONLY for plan 3
    if (customPricing && customPricing.isCustomPlan && apiPlan.id === 3) {
      planPrice = `${customPricing.totalPrice.toFixed(2)}`;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (plan.price !== "SALES" && plan.name.toLowerCase() !== "enterprise") {
      if (!scanData) {
        setError("Please complete the card scan process first.");
        return;
      }

      if (!encryptedData) {
        setError(
          "Please complete the card scan process and ensure your card information is captured."
        );
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      if (
        plan.price === "SALES" ||
        (plan.name.toLowerCase().includes("enterprise") && !plan.customPricing)
      ) {
        console.log("Contact form submitted:", {
          ...formData,
          plan_id: plan.id,
          merchant_id: userObj.merchant_id,
        });

        alert(
          "Your message has been sent! Our sales team will contact you soon."
        );
        router.push("/dashboard");
        return;
      }

      if (plan.id === 1 || plan.id === 2 || plan.customPricing) {
        const paymentData = {
          merchant_id: userObj.merchant_id,
          email: formData.email,
          billing_address: formData.billingAddress,
          city: formData.city,
          zipcode: formData.zipCode,
          country: formData.country,
          ...(plan.customPricing && {
            custom_api_count: plan.customPricing.apiCount,
            custom_price: plan.customPricing.totalPrice,
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

        const paymentResult = await paymentResponse.json();

        if (!paymentResponse.ok) {
          throw new Error(
            paymentResult.message ||
              `Payment API error! status: ${paymentResponse.status}`
          );
        }

        console.log("Payment details stored successfully:", paymentResult);

        if (!paymentResult.status && paymentResult.status !== undefined) {
          throw new Error(
            paymentResult.message || "Payment details storage failed"
          );
        }
      }

      const subscriptionData = {
        merchant_id: userObj.merchant_id,
        package_id: plan.id,
        subscription_date: new Date().toISOString().split("T")[0],
        scan_id: scanData?.scanID,
        ...(plan.customPricing && {
          custom_api_count: plan.customPricing.apiCount,
          custom_monthly_price: plan.customPricing.totalPrice,
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

        // Clean up custom pricing from localStorage
        localStorage.removeItem("customApiPricing");

        setNotification("Subscription created successfully!");
        router.push("/dashboard");
      } else {
        throw new Error(result.message || "Subscription creation failed");
      }
    } catch (err) {
      console.error("Payment/Subscription error:", err);
      setError(
        err.message ||
          "An error occurred while processing your payment/subscription"
      );
    } finally {
      setSubmitting(false);
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

        // Check for custom API pricing data
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
        console.log("User data found in localStorage:", parsedUser);

        const userObj = parsedUser.user || parsedUser;
        setUserData(userObj);

        console.log("User object:", userObj);
        console.log("Merchant ID:", userObj.merchant_id);

        if (userObj.email) {
          setFormData((prev) => ({ ...prev, email: userObj.email }));
        }

        const response = await apiFetch(
          "/Packages"
        );
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

        // Pass custom pricing to mapApiDataToPlan if available
        const customPricing = customPricingData ? JSON.parse(customPricingData) : null;
        const mappedPlan = mapApiDataToPlan(foundPlan, customPricing);
        setPlan(mappedPlan);

        // Only generate scan token for non-enterprise plans or custom plans that need payment
        if (
          mappedPlan.price !== "SALES" &&
          (mappedPlan.name.toLowerCase() !== "enterprise" || mappedPlan.customPricing)
        ) {
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

  const isEnterprisePlan =
    plan.price === "SALES" || 
    (plan.name.toLowerCase().includes("enterprise") && !plan.customPricing);

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

              {/* Show custom pricing info if available */}
              {/* {plan.customPricing && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Custom API Package</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div className="flex justify-between">
                      <span>API Count:</span>
                      <span className="font-medium">{plan.customPricing.apiCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per API:</span>
                      <span className="font-medium">${plan.customPricing.pricePerApi.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-1 border-t border-blue-300">
                      <span>Monthly Total:</span>
                      <span>${plan.customPricing.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )} */}

              {isEnterprisePlan ? (
                <ContactForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  submitting={submitting}
                />
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}