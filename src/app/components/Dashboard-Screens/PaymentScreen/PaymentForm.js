// import { Check, Shield } from 'lucide-react';
// import QRCode from "react-qr-code";

// export default function PaymentForm({
//   plan,
//   formData,
//   handleInputChange,
//   handleSubmit,
//   submitting,
//   notification,
//   scanData,
//   scanLoading,
//   scanError,
//   encryptedData,
//   decryptedCardData,
//   pollingRef,
//   pricingCalculation,
//   generateScanToken,
//   userData
// }) {

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   return (
//     <>
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

//       {notification && (
//         <div className='bg-green-100 border border-green-400 text-green-800 rounded-md p-3 mb-5 flex items-center'>
//           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span className="font-medium">Success:</span>
//           <span className="ml-1">{notification}</span>
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Email Address
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="your@email.com"
//             required
//             disabled={submitting}
//           />
//         </div>

//         {/* Card Information Section - Conditional Rendering */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Card Information
//           </label>
          
//           {/* Show card form fields if encrypted data is available */}
//           {encryptedData ? (
//             <div className="space-y-4">
//               <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
//                 <p className="text-green-800 text-sm flex items-center">
//                   <Check className="w-4 h-4 mr-2" />
//                   Card scan completed successfully
//                 </p>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Card Number
//                 </label>
//                 <input
//                   type="text"
//                   name="cardNumber"
//                   value={formData.cardNumber}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="**** **** **** ****"
//                   required
//                   disabled={submitting || decryptedCardData}
//                   readOnly={decryptedCardData}
//                 />
//                 {decryptedCardData && (
//                   <p className="text-xs text-green-600 mt-1">✓ Auto-filled from secure scan</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Cardholder Name
//                 </label>
//                 <input
//                   type="text"
//                   name="cardholderName"
//                   value={formData.cardholderName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder=""
//                   required
//                   disabled={submitting || decryptedCardData}
//                   readOnly={decryptedCardData}
//                 />
//                 {decryptedCardData && (
//                   <p className="text-xs text-green-600 mt-1">✓ Auto-filled from secure scan</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Expiry Date
//                 </label>
//                 <input
//                   type="text"
//                   name="expiryDate"
//                   value={formData.expiryDate}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="MM/YY"
//                   required
//                   disabled={submitting || decryptedCardData}
//                   readOnly={decryptedCardData}
//                 />
//                 {decryptedCardData && (
//                   <p className="text-xs text-green-600 mt-1">✓ Auto-filled from secure scan</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   CVV
//                 </label>
//                 <input
//                   type="text"
//                   name="CVV"
//                   value={formData.CVV}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="123"
//                   required
//                 />
//               </div>
//             </div>
//           ) : (
//             // Show QR code or loading state if encrypted data is not available
//             <>
//               {scanLoading ? (
//                 <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-3"></div>
//                   <p className="text-gray-600">Generating secure scan link...</p>
//                 </div>
//               ) : scanError ? (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                   <p className="text-red-600 text-sm mb-3">{scanError}</p>
//                   <button
//                     type="button"
//                     onClick={() => generateScanToken(userData?.user || userData)}
//                     className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
//                   >
//                     Retry Scan Generation
//                   </button>
//                 </div>
//               ) : scanData ? (
//                 <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
//                   <h4 className="font-semibold text-gray-900 mb-3">Scan to Complete Payment</h4>
//                   <div className="flex justify-center mb-4">
//                     <QRCode 
//                       value={scanData.scanURL} 
//                       size={200}
//                       level="H"
//                     />
//                   </div>
//                   <p className="text-sm text-gray-600">Scan this code with your mobile device</p>
//                   {pollingRef.current && (
//                     <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
//                       <div className="animate-pulse h-2 w-2 bg-cyan-500 rounded-full mr-2"></div>
//                       Waiting for card scan...
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
//                   <p className="text-gray-600">Unable to generate scan link. Please refresh the page.</p>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Billing Address */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Billing Address
//           </label>
//           <div className="space-y-3">
//             <input
//               type="text"
//               name="billingAddress"
//               value={formData.billingAddress}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Street address"
//               required
//               disabled={submitting}
//             />
//             <div className="grid grid-cols-2 gap-3">
//               <input
//                 type="text"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleInputChange}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="City"
//                 required
//                 disabled={submitting}
//               />
//               <input
//                 type="text"
//                 name="zipCode"
//                 value={formData.zipCode}
//                 onChange={handleInputChange}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="ZIP Code"
//                 required
//                 disabled={submitting}
//               />
//             </div>
//             <input
//               type="text"
//               name="country"
//               value={formData.country}
//               onChange={handleInputChange}
//               placeholder="Enter your country"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               disabled={submitting}
//             />
//           </div>
//         </div>

//         {/* Order Summary with Tax Calculation */}
//         <div className="border-t pt-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Plan:</span>
//               <span className="font-medium">{plan.name}</span>
//             </div>
            
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Billing:</span>
//               <span className="font-medium">Monthly</span>
//             </div>

//             {/* Pricing Breakdown */}
//             {plan.price !== 'SALES' && plan.price !== 'Free' && (
//               <>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Subtotal:</span>
//                   <span className="font-medium">{formatCurrency(pricingCalculation.subtotal)}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">
//                     Tax (3%):
//                   </span>
//                   <span className="font-medium">{formatCurrency(pricingCalculation.tax)}</span>
//                 </div>
                
//                 <div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
//                   <span>Total:</span>
//                   <span>{formatCurrency(pricingCalculation.total)}</span>
//                 </div>
//               </>
//             )}

//             {/* For Free or Sales plans */}
//             {(plan.price === 'SALES' || plan.price === 'Free') && (
//               <div className="flex justify-between items-center text-lg font-bold">
//                 <span>Total:</span>
//                 <span>{plan.price === 'SALES' ? 'Contact Sales' : 'Free'}</span>
//               </div>
//             )}
//           </div>
          
//           {/* Scan Status Indicator */}
//           {scanData && !encryptedData && (
//             <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
//               <p className="text-sm text-amber-800 flex items-center">
//                 <Shield className="w-4 h-4 mr-2" />
//                 Please complete the card scan before proceeding
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className={`w-full ${plan.buttonColor} text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
//           disabled={submitting || (scanData && !encryptedData)}
//         >
//           {submitting ? (
//             <div className="flex items-center justify-center">
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//               Processing...
//             </div>
//           ) : (
//             plan.price === 'SALES' 
//               ? 'Contact Sales Team' 
//               : plan.price === 'Free'
//               ? 'Start Free Plan'
//               : `Pay ${formatCurrency(pricingCalculation.total)}`
//           )}
//         </button>

//         <p className="text-xs text-gray-500 text-center">
//           By subscribing, you agree to our Terms of Service and Privacy Policy. 
//           You can cancel anytime.
//         </p>
//       </form>
//     </>
//   );
// }



import { Check, Shield } from 'lucide-react';
import QRCode from "react-qr-code";

export default function PaymentForm({
  plan,
  formData,
  handleInputChange,
  handleSubmit,
  submitting,
  notification,
  scanData,
  scanLoading,
  scanError,
  encryptedData,
  decryptedCardData,
  pollingRef,
  pricingCalculation,
  generateScanToken,
  userData
}) {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

      {notification && (
        <div className='bg-green-100 border border-green-400 text-green-800 rounded-md p-3 mb-5 flex items-center'>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Success:</span>
          <span className="ml-1">{notification}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
            required
            disabled={submitting}
          />
        </div>

        {/* Card Information Section - Conditional Rendering */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          
          {/* Show card form fields if encrypted data is available */}
          {encryptedData ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 text-sm flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  Card scan completed successfully
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="**** **** **** ****"
                  required
                  disabled={submitting || decryptedCardData}
                  readOnly={decryptedCardData}
                />
                {decryptedCardData && (
                  <p className="text-xs text-green-600 mt-1">✓ Auto-filled from secure scan</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder=""
                  required
                  disabled={submitting || decryptedCardData}
                  readOnly={decryptedCardData}
                />
                {decryptedCardData && (
                  <p className="text-xs text-green-600 mt-1">✓ Auto-filled from secure scan</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="MM/YY"
                  required
                  disabled={submitting || decryptedCardData}
                  readOnly={decryptedCardData}
                />
                {decryptedCardData && (
                  <p className="text-xs text-green-600 mt-1">✓ Auto-filled from secure scan</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="CVV"
                  value={formData.CVV}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          ) : (
            // Show QR code or loading state if encrypted data is not available
            <>
              {scanLoading ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-3"></div>
                  <p className="text-gray-600">Generating secure scan link...</p>
                </div>
              ) : scanError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm mb-3">{scanError}</p>
                  <button
                    type="button"
                    onClick={() => generateScanToken(userData?.user || userData)}
                    className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    Retry Scan Generation
                  </button>
                </div>
              ) : scanData ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <h4 className="font-semibold text-gray-900 mb-3">Scan to Complete Payment</h4>
                  <div className="flex justify-center mb-4">
                 <QRCode 
  value={scanData?.scanURL || ""} 
  size={200}
  level="H"
/>

                  </div>
                  <p className="text-sm text-gray-600">Scan this code with your mobile device</p>
                  {pollingRef.current && (
                    <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
                      <div className="animate-pulse h-2 w-2 bg-cyan-500 rounded-full mr-2"></div>
                      Waiting for card scan...
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-600">Unable to generate scan link. Please refresh the page.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Billing Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Address
          </label>
          <div className="space-y-3">
            <input
              type="text"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Street address"
              required
              disabled={submitting}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City"
                required
                disabled={submitting}
              />
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ZIP Code"
                required
                disabled={submitting}
              />
            </div>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter your country"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Order Summary with Tax Calculation */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">{plan.name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Billing:</span>
              <span className="font-medium">Monthly</span>
            </div>

            {/* Custom API Count Display */}
            {/* {plan.customPricing && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">API Count:</span>
                <span className="font-medium">{plan.customPricing.apiCount.toLocaleString()}</span>
              </div>
            )} */}

            {/* Pricing Breakdown */}
            {plan.price !== 'SALES' && plan.price !== 'Free' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(pricingCalculation.subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Tax:
                  </span>
                  <span className="font-medium">{formatCurrency(pricingCalculation.tax)}</span>
                </div>
                
                <div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(pricingCalculation.total)}</span>
                </div>
              </>
            )}

            {/* For Free or Sales plans */}
            {(plan.price === 'SALES' || plan.price === 'Free') && (
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>{plan.price === 'SALES' ? 'Contact Sales' : 'Free'}</span>
              </div>
            )}
          </div>
          
          {/* Scan Status Indicator */}
          {scanData && !encryptedData && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Please complete the card scan before proceeding
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full ${plan.buttonColor} text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          disabled={submitting || (scanData && !encryptedData)}
        >
          {submitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            plan.price === 'SALES' 
              ? 'Contact Sales Team' 
              : plan.price === 'Free'
              ? 'Start Free Plan'
              : `Pay ${formatCurrency(pricingCalculation.total)}`
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          You can cancel anytime.
        </p>
      </form>
    </>
  );
}