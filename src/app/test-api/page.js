'use client';

import { useState } from 'react';

export default function TestApiPage() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApiRoute = async () => {
    console.log('🧪 Testing API route directly');
    setLoading(true);
    
    try {
      // Test with hardcoded merchant ID
      const merchantId = '5460858H5466594L';
      const url = `/api/card-scans?id=${merchantId}`;
      
      console.log('🌐 Testing URL:', url);
      
      const response = await fetch(url);
      console.log('📡 Response status:', response.status);
      
      const data = await response.text();
      console.log('📄 Raw response:', data);
      
      try {
        const parsed = JSON.parse(data);
        console.log('✅ Parsed JSON:', parsed);
        setResponse(parsed);
      } catch (e) {
        console.log('❌ Not JSON, setting as text');
        setResponse(data);
      }
      
    } catch (error) {
      console.error('💥 Error:', error);
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testDirectApi = async () => {
    console.log('🧪 Testing external API directly');
    setLoading(true);
    
    try {
      const url = 'https://admin.cardnest.io/api/merchant/getCardScans?id=5460858H5466594L';
      console.log('🌐 Testing external URL:', url);
      
      const response = await fetch(url);
      console.log('📡 External response status:', response.status);
      
      const data = await response.text();
      console.log('📄 External raw response:', data);
      
      try {
        const parsed = JSON.parse(data);
        console.log('✅ External parsed JSON:', parsed);
        setResponse(parsed);
      } catch (e) {
        console.log('❌ External not JSON, setting as text');
        setResponse(data);
      }
      
    } catch (error) {
      console.error('💥 External error:', error);
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testApiRoute}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Internal API Route'}
        </button>
        
        <button
          onClick={testDirectApi}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 ml-4"
        >
          {loading ? 'Testing...' : 'Test External API Direct'}
        </button>
      </div>
      
      {response && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Response:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}