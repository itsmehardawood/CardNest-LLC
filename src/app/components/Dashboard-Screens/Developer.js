import { apiFetch } from '@/app/lib/api.js';
import React, { useState, useEffect } from 'react';

function DevelopersScreen() {
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base URL for API calls

  // Fetch documentation
  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFetch(`/superadmin/getDocumentation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        setDocuments(result.data || []);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch documents');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'An error occurred while fetching documents.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle file download
  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
<div className="bg-black rounded-lg shadow-sm border border-gray-800 p-4 md:p-6 min-h-screen">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Developers</h2>
      
      <div className="space-y-6 md:space-y-8">
          {/* Documentation Section */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg md:text-xl font-medium text-white mb-2 sm:mb-0">
              Documentation & Guides
            </h3>
            <button
              onClick={fetchDocuments}
              disabled={isLoading}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 text-sm transition-colors"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900 text-red-300 p-3 rounded-md border border-red-700 mb-4 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-300">Loading documentation...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium">No documentation available</p>
              <p className="text-sm mt-1">Documentation will appear here once uploaded by admin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Grid View */}
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-black rounded-lg shadow-sm border border-gray-800 p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-white text-base leading-tight">{doc.title}</h4>
                      <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs font-medium ml-2 shrink-0">
                        {doc.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-3">{doc.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">{formatDate(doc.created_at)}</span>
                      <button
                        onClick={() => handleDownload(doc.file_url, doc.title)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile List View */}
              <div className="md:hidden space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-black rounded-lg shadow-sm border border-gray-800 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm pr-2">{doc.title}</h4>
                      <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs shrink-0">
                        {doc.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{doc.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">{formatDate(doc.created_at)}</span>
                      <button
                        onClick={() => handleDownload(doc.file_url, doc.title)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
<div className="bg-blue-900 rounded-lg border border-blue-700 p-4">
  <h4 className="text-sm font-medium text-blue-300 mb-3">Resources</h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
    <p className="text-blue-200 transition-colors">• API Reference</p>
    <p className="text-blue-200 transition-colors">• Integration Guide</p>
    <p className="text-blue-200 transition-colors">• Code Examples</p>
    <p className="text-blue-200 transition-colors">• Support Forum</p>
  </div>
</div>

      </div>
    </div>
  );
}

export default DevelopersScreen;