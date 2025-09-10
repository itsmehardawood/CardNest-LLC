'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

const InvoicePDFExport = ({ invoiceData, subscriptions, overLimits, totals, onExportStart, onExportComplete, onError }) => {
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const exportToPDF = async () => {
    if (!invoiceData) {
      console.error("Invoice data not found");
      onError?.("Invoice data not found");
      return;
    }

    setIsExporting(true);
    onExportStart?.(true);
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Create a well-structured HTML document for the PDF
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoiceData.merchantId}</title>
            <meta charset="utf-8">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: #111827;
                color: #fff;
                padding: 15px;
                line-height: 1.4;
                font-size: 14px;
              }
              
              .invoice {
                max-width: 800px;
                margin: 0 auto;
                background: #1f2937;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              
              .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #374151;
              }
              
              .company-info h1 {
                font-size: 22px;
                font-weight: 700;
                color: #3b82f6;
                margin-bottom: 3px;
              }
              
              .company-info p {
                font-size: 14px;
                color: #9ca3af;
              }
              
              .invoice-info {
                text-align: right;
              }
              
              .invoice-info h2 {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 8px;
              }
              
              .invoice-info p {
                font-size: 13px;
                margin-bottom: 2px;
              }
              
              .client-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 10px;
                margin-bottom: 15px;
              }
              
              .info-card {
                background: #374151;
                padding: 10px 12px;
                border-radius: 6px;
                border: 1px solid #4b5563;
              }
              
              .info-card h3 {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                font-weight: 500;
                color: #9ca3af;
                margin-bottom: 4px;
              }
              
              .info-card p {
                font-size: 14px;
                font-weight: 600;
                color: #fff;
              }
              
              .section {
                margin-bottom: 15px;
              }
              
              .section-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 10px;
                padding-bottom: 6px;
                border-bottom: 1px solid #374151;
              }
              
              .section-header h3 {
                font-size: 16px;
                font-weight: 600;
                color: #fff;
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 8px;
                background: #374151;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid #4b5563;
              }
              
              th, td {
                padding: 8px 12px;
                text-align: left;
                border-right: 1px solid #4b5563;
                vertical-align: middle;
              }
              
              th:last-child, td:last-child {
                border-right: none;
              }
              
              th {
                background: #4b5563;
                font-weight: 600;
                color: #fff;
                font-size: 13px;
                border-bottom: 1px solid #6b7280;
              }
              
              td {
                color: #e5e7eb;
                font-size: 13px;
                border-bottom: 1px solid #4b5563;
              }
              
              tbody tr:last-child td {
                border-bottom: none;
              }
              
              .total-row {
                background: #2d3748 !important;
                font-weight: 600;
              }
              
              .total-row td {
                font-weight: 600;
                font-size: 14px;
                color: #fff !important;
                border-top: 2px solid #4b5563;
              }
              
              .text-green { color: #10b981 !important; }
              .text-orange { color: #f97316 !important; }
              .text-yellow { color: #eab308 !important; }
              .text-purple { color: #8b5cf6 !important; }
              .text-blue { color: #3b82f6 !important; }
              
              .summary {
                background: #374151;
                padding: 15px;
                border-radius: 6px;
                border: 1px solid #4b5563;
                margin-bottom: 15px;
              }
              
              .summary-item {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                border-bottom: 1px solid #4b5563;
                font-size: 14px;
              }
              
              .summary-item:last-child {
                border-bottom: none;
              }
              
              .summary-total {
                font-size: 16px;
                font-weight: 700;
                padding-top: 12px;
                border-top: 2px solid #4b5563;
              }
              
              .footer {
                text-align: center;
                padding-top: 15px;
                border-top: 1px solid #374151;
                color: #9ca3af;
                font-size: 12px;
              }
              
              .footer p {
                margin-bottom: 4px;
              }
              
              @media print {
                body {
                  padding: 0;
                  background: #fff;
                  color: #000;
                  font-size: 12px;
                }
                
                .invoice {
                  box-shadow: none;
                  border: 1px solid #ccc;
                  margin: 0;
                  padding: 15px;
                  background: #fff;
                }
                
                .header {
                  border-bottom-color: #ccc;
                }
                
                .company-info h1 {
                  color: #2563eb;
                }
                
                .info-card {
                  background: #f9fafb;
                  border-color: #d1d5db;
                }
                
                .info-card h3 {
                  color: #6b7280;
                }
                
                .info-card p {
                  color: #111827;
                }
                
                .section-header {
                  border-bottom-color: #d1d5db;
                }
                
                .section-header h3 {
                  color: #111827;
                }
                
                table {
                  background: #fff;
                  border-color: #d1d5db;
                }
                
                th {
                  background: #f3f4f6;
                  color: #111827;
                  border-color: #d1d5db;
                }
                
                td {
                  color: #111827;
                  border-color: #e5e7eb;
                }
                
                .total-row {
                  background: #f9fafb !important;
                }
                
                .total-row td {
                  color: #111827 !important;
                  border-color: #d1d5db;
                }
                
                .summary {
                  background: #f9fafb;
                  border-color: #d1d5db;
                }
                
                .summary-item {
                  border-color: #e5e7eb;
                  color: #111827;
                }
                
                .summary-total {
                  border-color: #d1d5db;
                }
                
                .footer {
                  border-top-color: #d1d5db;
                  color: #6b7280;
                }
                
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice">
              <div class="header">
                <div class="company-info">
                  <h1>CardNest LLC.</h1>
                  <p>Invoice ${invoiceData.merchantId}</p>
                </div>
                <div class="invoice-info">
                  <h2>INVOICE</h2>
                  <p><strong>Date:</strong> ${formatDate(invoiceData.invoiceDate)}</p>
                  <p><strong>Due Date:</strong> ${formatDate('2025-09-18')}</p>
                </div>
              </div>
              
              <div class="client-info">
                <div class="info-card">
                  <h3>👤 Client Name</h3>
                  <p>${invoiceData.clientName}</p>
                </div>
                <div class="info-card">
                  <h3>🏢 Merchant ID</h3>
                  <p>${invoiceData.merchantId}</p>
                </div>
                <div class="info-card">
                  <h3>📅 Invoice Date</h3>
                  <p>${formatDate(invoiceData.invoiceDate)}</p>
                </div>
                <div class="info-card">
                  <h3>🏢 Business Name</h3>
                  <p>${invoiceData.businessName}</p>
                </div>
              </div>
              
              <div class="section">
                <div class="section-header">
                  <h3>Subscription Packages</h3>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Package Name</th>
                      <th>Number of API Scans</th>
                      <th>Price/Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${subscriptions.map(sub => `
                      <tr>
                        <td>${sub.packageName}</td>
                        <td>${sub.apiScans.toLocaleString()}</td>
                        <td class="text-green">$${sub.priceAmount.toFixed(2)}</td>
                      </tr>
                    `).join('')}
                    <tr class="total-row">
                      <td colspan="2" style="text-align: right;">Subscription Total:</td>
                      <td class="text-green">$${totals.subscriptionTotal.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="section">
                <div class="section-header">
                  <h3>Over-Limit Scans</h3>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Package Name</th>
                      <th>Over-Limit API Scans</th>
                      <th>Price/Amount</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${overLimits.map(over => `
                      <tr>
                        <td>${over.packageName}</td>
                        <td>${over.overLimitScans.toLocaleString()}</td>
                        <td>$${over.pricePerScan.toFixed(2)}</td>
                        <td class="text-orange">$${over.overLimitTotal.toFixed(2)}</td>
                      </tr>
                    `).join('')}
                    <tr class="total-row">
                      <td colspan="3" style="text-align: right;">Over-Limit Total:</td>
                      <td class="text-orange">$${totals.overLimitTotal.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="section">
                <div class="section-header">
                  <h3>Invoice Summary</h3>
                </div>
                <div class="summary">
                  <div class="summary-item">
                    <span>Standard Amount:</span>
                    <span class="text-green">$${totals.subscriptionTotal.toFixed(2)}</span>
                  </div>
                  <div class="summary-item">
                    <span>Over-Limit Amount:</span>
                    <span class="text-orange">$${totals.overLimitTotal.toFixed(2)}</span>
                  </div>
                  <div class="summary-item">
                    <span>Subtotal:</span>
                    <span>$${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div class="summary-item">
                    <span>Tax (3%):</span>
                    <span class="text-yellow">$${totals.taxAmount.toFixed(2)}</span>
                  </div>
                  <div class="summary-item summary-total">
                    <span>Total Bill + Tax:</span>
                    <span class="text-green">$${totals.finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div class="footer">
                <p>Thank you for your business!</p>
                <p>CardNest LLC. | support@cardnest.com | (555) 123-4567</p>
                <p style="margin-top: 12px; font-size: 11px;">Generated on ${new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 1000);
              }
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      onExportComplete?.(true);

    } catch (error) {
      console.error('PDF export error:', error);
      onError?.(error.message);
      // Fallback to simple print
      alert('Error generating PDF. Please try printing the page instead.');
      onExportComplete?.(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={exportToPDF}
      disabled={isExporting}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="h-4 w-4" />
      {isExporting ? 'Exporting...' : 'Export Invoice'}
    </button>
  );
};

export default InvoicePDFExport;