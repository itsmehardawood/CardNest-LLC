import React, { useState } from 'react';

function SupportScreen() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!selectedCategory || !message.trim()) {
      alert('Please select a category and enter a message');
      return;
    }
    // Send message logic here
    // console.log('Sending message:', { category: selectedCategory, message });
    setMessage('');
    setSelectedCategory('');
    alert('Message sent successfully!');
  };

  const handleViewDocs = () => {
    // View documentation logic here
    // console.log('View documentation clicked');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Support Center</h2>
      
      {/* Contact Support */}
      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-4">Contact Support</h3>


          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                <option value="account">Account Issues</option>
                <option value="billing">Billing & Payments</option>
                <option value="technical">Technical Support</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your issue or question..."
              />
            </div>
            <button 
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Send Message
            </button>
          </div>
        </div>

        {/* Documentation */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Documentation</h3>
          <p className="text-gray-600 text-sm mb-3">Browse our comprehensive guides and tutorials.</p>
          <button 
            onClick={handleViewDocs}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
          >
            View Docs
          </button>
        </div>

        {/* Quick Help */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-4">Quick Help</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs">?</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">How to complete my business profile?</h4>
                <p className="text-gray-600 text-xs">Navigate to Business Profile and fill in all required fields.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs">?</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">How to upload documents?</h4>
                <p className="text-gray-600 text-xs">Go to Documents section and click Upload New button.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs">?</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">How to add funds to my account?</h4>
                <p className="text-gray-600 text-xs">Visit the Balance section and click Add Funds.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Other Ways to Reach Us</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Email:</span> support@cardnest.io</p>
            {/* <p><span className="font-medium">Phone:</span> +1 (555) 123-4567</p> */}
            <p><span className="font-medium">Hours:</span> Monday - Friday, 9AM - 6PM EST</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportScreen;