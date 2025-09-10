import React, { useRef, useState } from 'react';
import { FileText, Calendar, User, Building2, CreditCard, Package, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import InvoicePDFExport from './exportPdf';

const InvoiceScreen = () => {
  const [expanded, setExpanded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const invoiceRef = useRef(null);

  // Static data that would come from API
  const invoiceInfo = {
    clientName: 'Acme Corporation',
    merchantId: 'MCH-2025-001',
    invoiceDate: '2025-09-04',
    businessName: 'CardNest LLC.',
  };

  // Static subscription data from API
  const subscriptions = [
    { packageName: 'Standard', apiScans: 100, priceAmount: 30.00 },
  ];

  // Static over-limit data from API
  const overLimits = [
    { packageName: 'Standard', overLimitScans: 250, pricePerScan: 0.20, overLimitTotal: 50.00 },
    // { packageName: 'Premium', overLimitScans: 150, pricePerScan: 0.15, overLimitTotal: 22.50 }
  ];

  // Calculate totals using the calculation logic
  const subscriptionTotal = subscriptions.reduce((sum, item) => sum + item.priceAmount, 0);
  const overLimitTotal = overLimits.reduce((sum, item) => sum + item.overLimitTotal, 0);
  const subtotal = subscriptionTotal + overLimitTotal;
  const taxRate = 0.03;
  const taxAmount = subtotal * taxRate;
  const finalTotal = subtotal + taxAmount;

  // Create totals object for PDF export
  const totals = {
    subscriptionTotal,
    overLimitTotal,
    subtotal,
    taxAmount,
    finalTotal
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const handleExportStart = (exporting) => {
    setIsExporting(exporting);
    setExportError(null);
  };

  const handleExportComplete = (success) => {
    setIsExporting(false);
    if (!success) {
      setExportError('Failed to export PDF');
    }
  };

  const handleExportError = (error) => {
    setIsExporting(false);
    setExportError(error);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Single Invoice Card */}
        <div className="border border-gray-700 rounded-xl bg-gray-800 overflow-hidden hover:border-gray-600 transition-all duration-300 mb-6">
          {/* Card Header */}
          <div className="p-6 border-b border-gray-700 bg-gray-800/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-900/30 rounded-full p-2.5 border border-blue-500/30">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-md font-semibold text-white">
                    Invoice #{invoiceInfo.merchantId}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {formatDate(invoiceInfo.invoiceDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleExpansion}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  {expanded ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                 <div className="flex items-center gap-2 mb-2">
                   <User className="w-5 h-5 text-blue-400" />
                   <span className="text-xs font-medium text-gray-300">Client Name</span>
                 </div>
                 <p className="text-sm font-semibold text-white">{invoiceInfo.clientName}</p>
               </div>
              
               <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                 <div className="flex items-center gap-2 mb-2">
                   <Building2 className="w-5 h-5 text-green-400" />
                   <span className="text-xs font-medium text-gray-300">Merchant ID</span>
                 </div>
                 <p className="text-sm font-semibold text-white">{invoiceInfo.merchantId}</p>
               </div>
              
               <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                 <div className="flex items-center gap-2 mb-2">
                   <Calendar className="w-5 h-5 text-purple-400" />
                   <span className="text-xs font-medium text-gray-300">Invoice Date</span>
                 </div>
                 <p className="text-sm font-semibold text-white">{formatDate(invoiceInfo.invoiceDate)}</p>
               </div>
              
               <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                 <div className="flex items-center gap-2 mb-2">
                   <Package className="w-5 h-5 text-orange-400" />
                   <span className="text-xs font-medium text-gray-300">Business Name</span>
                 </div>
                 <p className="text-sm font-semibold text-white">{invoiceInfo.businessName}</p>
               </div>
            </div>
          </div>

            {/* Basic Info - Always Visible */}
            {/* <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 py-2">
                <User className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-amber-400 mb-1">Client Name</p>
                  <p className="text-sm text-white">{invoiceInfo.clientName}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 py-2">
                <Building2 className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-amber-400 mb-1">Business Name</p>
                  <p className="text-sm text-white">{invoiceInfo.businessName}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 py-2">
                <Building2 className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-amber-400 mb-1">Invoice Date:</p>
                  <p className="text-sm text-white">{invoiceInfo.invoiceDate}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 py-2">
                <Building2 className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-amber-400 mb-1">Merchant-ID:</p>
                  <p className="text-sm text-white">{invoiceInfo.merchantId}</p>
                </div>
              </div>
            </div>
          </div> */}
          
          {/* Expanded Content */}
          {expanded && (
            <div className="p-6" ref={invoiceRef}>
              {/* Subscriptions Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-5 h-5 text-blue-400" />
                  <h5 className="text-md font-semibold text-white">Subscription Packages</h5>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Package Name</th>
                        <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Number of API Scans</th>
                        <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Price/Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((sub, index) => (
                        <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                          <td className="border border-gray-600 px-4 py-2 text-white font-medium">{sub.packageName}</td>
                          <td className="border border-gray-600 px-4 py-2 text-gray-300">{sub.apiScans.toLocaleString()}</td>
                          <td className="border border-gray-600 px-4 py-2 text-green-400 font-semibold">${sub.priceAmount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-2 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">
                      Subscription Total: <span className="text-green-400">${subscriptionTotal.toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Over-Limit Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h5 className="text-md font-semibold text-white">Over-Limit Scans</h5>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Package Name</th>
                        <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Over-Limit API Scans</th>
                        <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Price/Amount</th>
                        <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overLimits.map((over, index) => (
                        <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                          <td className="border border-gray-600 px-4 py-2 text-white font-medium">{over.packageName}</td>
                          <td className="border border-gray-600 px-4 py-2 text-gray-300">{over.overLimitScans.toLocaleString()}</td>
                          <td className="border border-gray-600 px-4 py-2 text-gray-300">${over.pricePerScan.toFixed(2)}</td>
                          <td className="border border-gray-600 px-4 py-2 text-red-400 font-semibold">${over.overLimitTotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-2 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">
                      Over-Limit Total: <span className="text-red-400">${overLimitTotal.toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Invoice Total Section */}
              <div className="pt-6 border-t border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <h5 className="text-md font-semibold text-white">Invoice Total</h5>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-md border-b border-gray-600 pb-2">
                      <span className="text-gray-300 font-medium">Standard Amount:</span>
                      <span className="font-semibold text-green-400">${subscriptionTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-md border-b border-gray-600 pb-2">
                      <span className="text-gray-300 font-medium">Over-Limit Amount:</span>
                      <span className="font-semibold text-red-400">${overLimitTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-md border-b border-gray-500 pb-3">
                      <span className="text-gray-300 font-medium">Subtotal:</span>
                      <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-md border-b border-gray-500 pb-3">
                      <span className="text-gray-300 font-medium">Tax (3%):</span>
                      <span className="font-semibold text-yellow-400">${taxAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-md font-bold pt-4 border-t border-gray-500">
                      <span className="text-white">Total Bill + Tax:</span>
                      <span className="text-green-400">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end items-center gap-4">
                  {isExporting && <span className="text-gray-400">Generating PDF...</span>}
                  {exportError && <span className="text-red-400">{exportError}</span>}
                  
                  <InvoicePDFExport 
                    invoiceData={invoiceInfo}
                    subscriptions={subscriptions}
                    overLimits={overLimits}
                    totals={totals}
                    onExportStart={handleExportStart}
                    onExportComplete={handleExportComplete}
                    onError={handleExportError}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceScreen;

// import React, { useState, useRef } from 'react';
// import { FileText, Calendar, User, Building2, Package, AlertCircle, ChevronDown, ChevronUp, Download } from 'lucide-react';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';

// const InvoiceScreen = () => {
//   const [expanded, setExpanded] = useState(true);
//   const [isExporting, setIsExporting] = useState(false);
//   const invoiceRef = useRef(null);

//   // Static data that would come from API
//   const invoiceInfo = {
//     clientName: 'Acme Corporation',
//     merchantId: 'MCH-2025-001',
//     invoiceDate: '2025-09-04',
//     businessName: 'CardNest LLC.',
//     invoiceNumber: 'INV-2025-001',
//   };

//   // Static subscription data from API
//   const subscriptions = [
//     { packageName: 'Standard', apiScans: 100, priceAmount: 30.00 },
//   ];

//   // Static over-limit data from API
//   const overLimits = [
//     { packageName: 'Standard', overLimitScans: 250, pricePerScan: 0.20, overLimitTotal: 50.00 },
//   ];

//   // Calculate totals using the calculation logic
//   const subscriptionTotal = subscriptions.reduce((sum, item) => sum + item.priceAmount, 0);
//   const overLimitTotal = overLimits.reduce((sum, item) => sum + item.overLimitTotal, 0);
//   const subtotal = subscriptionTotal + overLimitTotal;
//   const taxRate = 0.03;
//   const taxAmount = subtotal * taxRate;
//   const finalTotal = subtotal + taxAmount;

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const toggleExpansion = () => {
//     setExpanded(!expanded);
//   };

//   return (
//     <div className="min-h-screen bg-black p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Single Invoice Card */}
//         <div ref={invoiceRef} className="invoice-container border border-gray-700 rounded-xl bg-gray-800 overflow-hidden hover:border-gray-600 transition-all duration-300 mb-6">
//           {/* Card Header */}
//           <div className="p-6 border-b border-gray-700 bg-gray-800/50">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <FileText className="w-8 h-8 text-blue-400" />
//                 <h1 className="text-xl font-bold text-white">Invoice Details</h1>
//               </div>
//               <button
//                 onClick={toggleExpansion}
//                 className="text-gray-400 hover:text-white transition-colors p-1"
//               >
//                 {expanded ? 
//                   <ChevronUp className="h-5 w-5" /> : 
//                   <ChevronDown className="h-5 w-5" />
//                 }
//               </button>
//             </div>
            
//             {/* Client Information Display */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
//                 <div className="flex items-center gap-2 mb-2">
//                   <User className="w-5 h-5 text-blue-400" />
//                   <span className="text-xs font-medium text-gray-300">Client Name</span>
//                 </div>
//                 <p className="text-sm font-semibold text-white">{invoiceInfo.clientName}</p>
//               </div>
              
//               <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Building2 className="w-5 h-5 text-green-400" />
//                   <span className="text-xs font-medium text-gray-300">Merchant ID</span>
//                 </div>
//                 <p className="text-sm font-semibold text-white">{invoiceInfo.merchantId}</p>
//               </div>
              
//               <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Calendar className="w-5 h-5 text-purple-400" />
//                   <span className="text-xs font-medium text-gray-300">Invoice Date</span>
//                 </div>
//                 <p className="text-sm font-semibold text-white">{formatDate(invoiceInfo.invoiceDate)}</p>
//               </div>
              
//               <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Package className="w-5 h-5 text-orange-400" />
//                   <span className="text-xs font-medium text-gray-300">Business Name</span>
//                 </div>
//                 <p className="text-sm font-semibold text-white">{invoiceInfo.businessName}</p>
//               </div>
//             </div>
//           </div>
          
//           {/* Expanded Content */}
//           {expanded && (
//             <div className="p-6">
//               {/* Invoice Header in expanded view */}
//               {/* <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">INVOICE</h2>
//                   <p className="text-gray-400">Number: {invoiceInfo.invoiceNumber}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-400">Date: {formatDate(invoiceInfo.invoiceDate)}</p>
//                   <p className="text-gray-400">Due Date: {formatDate('2025-09-18')}</p>
//                 </div>
//               </div> */}
              
//               {/* Subscriptions Section */}
//               <div className="mb-8">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Package className="w-5 h-5 text-blue-400" />
//                   <h5 className="text-md font-semibold text-white">Subscription Packages</h5>
//                 </div>
                
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="bg-gray-700">
//                         <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Package Name</th>
//                         <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Number of API Scans</th>
//                         <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Price/Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {subscriptions.map((sub, index) => (
//                         <tr key={index} className="hover:bg-gray-700/50 transition-colors">
//                           <td className="border border-gray-600 px-4 py-2 text-white font-medium">{sub.packageName}</td>
//                           <td className="border border-gray-600 px-4 py-2 text-gray-300">{sub.apiScans.toLocaleString()}</td>
//                           <td className="border border-gray-600 px-4 py-2 text-green-400 font-semibold">${sub.priceAmount.toFixed(2)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
                
//                 <div className="mt-4 pr-6 py-2 bg-gray-700 rounded-lg border border-gray-600">
//                   <div className="text-right">
//                     <span className="text-md font-bold text-white">
//                       Subscription Total: <span className="text-green-400">${subscriptionTotal.toFixed(2)}</span>
//                     </span>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Over-Limit Section */}
//               <div className="mb-8">
//                 <div className="flex items-center gap-3 mb-4">
//                   <AlertCircle className="w-5 h-5 text-orange-400" />
//                   <h5 className="text-md font-semibold text-white">Over-Limit Scans</h5>
//                 </div>
                
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="bg-gray-700">
//                         <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Package Name</th>
//                         <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Over-Limit API Scans</th>
//                         <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Price/Amount</th>
//                         <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-gray-200">Total Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {overLimits.map((over, index) => (
//                         <tr key={index} className="hover:bg-gray-700/50 transition-colors">
//                           <td className="border border-gray-600 px-4 py-2 text-white font-medium">{over.packageName}</td>
//                           <td className="border border-gray-600 px-4 py-2 text-gray-300">{over.overLimitScans.toLocaleString()}</td>
//                           <td className="border border-gray-600 px-4 py-2 text-gray-300">${over.pricePerScan.toFixed(2)}</td>
//                           <td className="border border-gray-600 px-4 py-2 text-orange-400 font-semibold">${over.overLimitTotal.toFixed(2)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
                
//                 <div className="mt-4 p-2 bg-gray-700 rounded-lg border border-gray-600">
//                   <div className="text-right">
//                     <span className="text-sm font-bold text-white">
//                       Over-Limit Total: <span className="text-orange-400">${overLimitTotal.toFixed(2)}</span>
//                     </span>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Invoice Total Section */}
//               <div className="pt-6 border-t border-gray-700">
//                 <div className="flex items-center gap-3 mb-6">
//                   <FileText className="w-5 h-5 text-purple-400" />
//                   <h5 className="text-md font-semibold text-white">Invoice Total</h5>
//                 </div>
                
//                 <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center text-md border-b border-gray-600 pb-2">
//                       <span className="text-gray-300 font-medium">Standard Amount:</span>
//                       <span className="font-semibold text-green-400">${subscriptionTotal.toFixed(2)}</span>
//                     </div>
                    
//                     <div className="flex justify-between items-center text-md border-b border-gray-600 pb-2">
//                       <span className="text-gray-300 font-medium">Over-Limit Amount:</span>
//                       <span className="font-semibold text-orange-400">${overLimitTotal.toFixed(2)}</span>
//                     </div>
                    
//                     <div className="flex justify-between items-center text-md border-b border-gray-500 pb-3">
//                       <span className="text-gray-300 font-medium">Subtotal:</span>
//                       <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
//                     </div>
                    
//                     <div className="flex justify-between items-center text-md border-b border-gray-500 pb-3">
//                       <span className="text-gray-300 font-medium">Tax (3%):</span>
//                       <span className="font-semibold text-yellow-400">${taxAmount.toFixed(2)}</span>
//                     </div>
                    
//                     <div className="flex justify-between items-center text-md font-bold pt-4 border-t border-gray-500">
//                       <span className="text-white">Total Bill + Tax:</span>
//                       <span className="text-green-400">${finalTotal.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="mt-6 flex justify-end items-center gap-4">
//                   {isExporting && <span className="text-gray-400">Generating PDF...</span>}
                  
//                   <button 
//                     onClick={exportToPDF}
//                     disabled={isExporting}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <Download className="h-4 w-4" />
//                     {isExporting ? 'Exporting...' : 'Export Invoice'}
//                   </button>
//                 </div>
                
//                 {/* Footer */}
//                 <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
//                   <p>Thank you for your business!</p>
//                   <p className="mt-2">CardNest LLC. | support@cardnest.com | (555) 123-4567</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceScreen;