"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";

const ACHPaymentForm = ({
  onPaymentSuccess,
  onPaymentError,
  formData,
  disabled,
  amount = "1.00",
  plan, // Add plan prop for pricing info
  apiFetch, // Add apiFetch prop (your API utility function)
}) => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [squareLoaded, setSquareLoaded] = useState(false);
  const [credentialsError, setCredentialsError] = useState(false);
  const [squareDetectionAttempts, setSquareDetectionAttempts] = useState(0);

  const achRef = useRef(null);
  const paymentsRef = useRef(null);
  const detectionTimeoutRef = useRef(null);

  // Sandbox
  // const appId = "sandbox-sq0idb-MBvG49FH6Nz_mhhrBrclhg";
  // const locationId = "L0A7SN9FH9EMR";

  // prod
   const appId = "sq0idp-nxaY-afaaeWBXySlmIAEaA";
    const locationId = "LNRMQ2T1MH3BA";

  const initializeACH = async (payments) => {
    const ach = await payments.ach();
    return ach;
  };

  const createPayment = async (token) => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("userData");
    const amountCents = Math.round(parseFloat(amount) * 100);


    if (!storedUser) {
      throw new Error("User data not found. Please log in again.");
    }

    let userData;
    try {
      userData = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      throw new Error(
        "Failed to retrieve user information. Please log in again."
      );
    }

    const userObj = userData.user || userData;

    if (!userObj?.merchant_id) {
      throw new Error("Merchant ID not found. Please log in again.");
    }

    // Create payment data structure similar to handleFinalSubscription
    const paymentData = {
      merchant_id: userObj.merchant_id,
      email: formData.email,
      billing_address: formData.billingAddress,
      city: formData.city,
      zipcode: formData.zipCode,
      country: formData.country,
      payment_method: "ach",

      // ACH-specific payment result data
      payment_result: {
        locationId,
        sourceId: token,
        idempotencyKey: window.crypto.randomUUID(),
        paymentType: "ach",
        amountMoney: {
          amount: amountCents,
          currency: "USD",
          autocomplete: true,
        },
      },

      // Add contact name for ACH
      contact_name: formData.contactName,

      // Include custom pricing if available
      ...(plan?.customPricing && {
        custom_api_count: plan.customPricing.apiCount,
        custom_price: plan.customPricing.customPrice,
      }),
    };

    console.log("Submitting ACH payment details:", paymentData);

    // const paymentResponse = await api("https:admin.cardnest.io/api/payment/storeDetails", {

    const paymentResponse = await apiFetch("/payment/storeDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (paymentResponse.ok) {
      const result = await paymentResponse.json();
      console.log("ACH payment stored successfully:", result);

      // Return the payment result in the expected format
      return {
        ...paymentData.payment_result,
        success: true,
        stored: true,
      };
    }

    const errorBody = await paymentResponse.text();
    throw new Error(errorBody);
  };

  const tokenize = async (paymentMethod, options = {}) => {
    return new Promise((resolve, reject) => {
      paymentMethod.addEventListener("ontokenization", async (event) => {
        const { tokenResult, error } = event.detail;

        if (error !== undefined) {
          reject(new Error(`Tokenization failed with error: ${error}`));
          return;
        }

        if (tokenResult.status === "OK") {
          try {
            const paymentResults = await createPayment(tokenResult.token);
            console.debug("ACH Payment Success", paymentResults);
            resolve(paymentResults);
          } catch (err) {
            reject(err);
          }
        } else {
          let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
          if (tokenResult.errors) {
            errorMessage += ` and errors: ${JSON.stringify(
              tokenResult.errors
            )}`;
          }
          reject(new Error(errorMessage));
        }
      });

      paymentMethod.tokenize(options);
    });
  };

  const getBillingContact = () => {
    // Extract first and last name from contactName field
    const fullName = formData.contactName || "";
    const nameParts = fullName.trim().split(" ");

    return {
      givenName: nameParts[0] || "",
      familyName: nameParts.slice(1).join(" ") || "",
    };
  };



  const getACHOptions = () => {
  const billingContact = getBillingContact();
  const accountHolderName =
    `${billingContact.givenName} ${billingContact.familyName}`.trim();

  // For the ACH popup, amount must be in **dollars** as string
  const amountInDollars = parseFloat(amount).toFixed(2); // "30.90"

  return {
    accountHolderName: accountHolderName || "Account Holder",
    intent: "CHARGE",
    amount: amountInDollars, // <-- dollars, not cents
    currency: "USD",
  };
};


  const handlePaymentSubmission = async (event) => {
    event.preventDefault();

    if (!formData.contactName) {
      onPaymentError(
        "Please provide a contact name for the bank account holder"
      );
      return;
    }

    if (
      !formData.email ||
      !formData.billingAddress ||
      !formData.city ||
      !formData.zipCode ||
      !formData.country
    ) {
      onPaymentError("Please fill in all required billing information");
      return;
    }

    if (!achRef.current) {
      console.error("ACH not initialized");
      onPaymentError("Bank payment system not ready. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      setPaymentStatus("");

      const achOptions = getACHOptions();
      const result = await tokenize(achRef.current, achOptions);
      setPaymentStatus("SUCCESS");
      onPaymentSuccess(result);
    } catch (error) {
      setPaymentStatus("FAILURE");
      console.error("ACH Payment Error:", error.message);
      onPaymentError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSquare = async () => {
    if (!window.Square) {
      throw new Error("Square.js failed to load properly");
    }

    let payments;
    try {
      payments = window.Square.payments(appId, locationId);
      paymentsRef.current = payments;
    } catch {
      setCredentialsError(true);
      return;
    }

    try {
      const ach = await initializeACH(payments);
      achRef.current = ach;
    } catch (e) {
      console.error("Initializing ACH failed", e);
    }
  };

  // Enhanced Square.js detection with fallback
  const detectSquareLoaded = () => {
    if (window.Square) {
      setSquareLoaded(true);
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }
      return true;
    }
    return false;
  };

  // Early detection effect - checks immediately when component mounts
  useEffect(() => {
    // Check if Square is already loaded (e.g., from previous page visit)
    if (detectSquareLoaded()) {
      return;
    }

    // Set up early detection timeout (1 second)
    const earlyDetectionTimeout = setTimeout(() => {
      if (detectSquareLoaded()) {
        setSquareDetectionAttempts(prev => prev + 1);
      }
    }, 1000);

    // Set up fallback detection timeout (3 seconds)
    detectionTimeoutRef.current = setTimeout(() => {
      if (!detectSquareLoaded()) {
        console.warn('Square.js detection timeout, attempting manual check...');
        setSquareDetectionAttempts(prev => prev + 1);
        // Force enable button after timeout if Square seems unavailable
        if (window.Square) {
          setSquareLoaded(true);
        }
      }
    }, 3000);

    return () => {
      clearTimeout(earlyDetectionTimeout);
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (squareLoaded) {
      initializeSquare();
    }
  }, [squareLoaded]);

  const getStatusClasses = () => {
    let classes =
      "flex items-center justify-center border border-black/5 rounded-full mx-auto h-12 transition-all duration-300 mt-4";

    if (credentialsError) {
      classes += " w-80 visible";
    } else if (paymentStatus) {
      classes += " w-56 visible";
    } else {
      classes += " w-56 invisible";
    }

    return classes;
  };

  const getStatusContent = () => {
    if (credentialsError) {
      return (
        <>
          <div
            className="w-4 h-4 mr-4 bg-red-600"
            style={{
              WebkitMask:
                "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A\")",
              mask: "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A\")",
            }}
          ></div>
          <span className="text-sm leading-4">
            Bank payment configuration error
          </span>
        </>
      );
    }

    if (paymentStatus === "SUCCESS") {
      return (
        <>
          <div
            className="w-4 h-4 mr-4 bg-green-600"
            style={{
              WebkitMask:
                "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0968 6.31744 12.0978 5.68597 11.7093 5.29509C11.3208 4.90422 10.6894 4.90128 10.2973 5.28852L11 6C10.2973 5.28852 10.2973 5.28853 10.2973 5.28856L10.2971 5.28866L10.2967 5.28908L10.2951 5.29071L10.2886 5.29714L10.2632 5.32224L10.166 5.41826L9.81199 5.76861C9.51475 6.06294 9.10795 6.46627 8.66977 6.90213C8.11075 7.4582 7.49643 8.07141 6.99329 8.57908L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E\")",
              mask: "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0968 6.31744 12.0978 5.68597 11.7093 5.29509C11.3208 4.90422 10.6894 4.90128 10.2973 5.28852L11 6C10.2973 5.28852 10.2973 5.28853 10.2973 5.28856L10.2971 5.28866L10.2967 5.28908L10.2951 5.29071L10.2886 5.29714L10.2632 5.32224L10.166 5.41826L9.81199 5.76861C9.51475 6.06294 9.10795 6.46627 8.66977 6.90213C8.11075 7.4582 7.49643 8.07141 6.99329 8.57908L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E\")",
            }}
          ></div>
          <span className="text-sm leading-4">Bank payment successful</span>
        </>
      );
    }

    if (paymentStatus === "FAILURE") {
      return (
        <>
          <div
            className="w-4 h-4 mr-4 bg-red-600"
            style={{
              WebkitMask:
                "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A\")",
              mask: "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A\")",
            }}
          ></div>
          <span className="text-sm leading-4">Bank payment failed</span>
        </>
      );
    }

    return null;
  };

  return (
    <>
      {/* old */}

      {/* <Script
        src="https://sandbox.web.squarecdn.com/v1/square.js"
        onLoad={() => setSquareLoaded(true)}
      /> */}

      
 <Script
  src="https://web.squarecdn.com/v1/square.js"
  onLoad={() => {
    console.log('Square.js script loaded');
    setSquareLoaded(true);
  }}
  onError={(e) => {
    console.error('Square.js script failed to load:', e);
    // Still try to detect if Square is available
    setTimeout(() => {
      if (window.Square) {
        setSquareLoaded(true);
      }
    }, 500);
  }}
/>  


      <div className="space-y-4">
        {/* Debug info - only show in development */}
       

        {/* {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-2 rounded text-xs text-gray-600">
            <div>Square Loaded: {squareLoaded ? '✅' : '❌'}</div>
            <div>Detection Attempts: {squareDetectionAttempts}</div>
            <div>Is Loading: {isLoading ? '✅' : '❌'}</div>
            <div>Disabled Prop: {disabled ? '✅' : '❌'}</div>
            <div>Window.Square Available: {typeof window !== 'undefined' && window.Square ? '✅' : '❌'}</div>
          </div>
        )} */}
        
        <button
          type="button"
          onClick={handlePaymentSubmission}
          disabled={disabled || isLoading || !squareLoaded} 
          className="w-full p-3 text-white bg-green-600 rounded-lg cursor-pointer border-none text-base font-medium leading-6 shadow hover:bg-green-700 active:bg-green-800 disabled:bg-black/5 disabled:text-black/30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing Bank Payment...
            </>
          ) : !squareLoaded ? (
            <>
              <div className="animate-pulse w-5 h-5 bg-current rounded opacity-50"></div>
              Loading Bank Payment System...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
                  fill="currentColor"
                />
              </svg>
              Pay with Bank Account
            </>
          )}
        </button>

        <div className={getStatusClasses()}>{getStatusContent()}</div>
      </div>
    </>
  );
};

export default ACHPaymentForm;
