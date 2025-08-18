'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api.js';

export default function LoginPage() {
  const [countryCode, setCountryCode] = useState('+92');
  const [loginInput, setLoginInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

const handleLogin = async () => {
  setLoading(true);
  setError('');

  try {
    const response = await apiFetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        country_code: countryCode,
        login_input: loginInput,
      }),
    });

    const data = await response.json();

    if (data.status === true) {
      const userRole = data?.user?.role;
      const allowedRoles = ["BUSINESS_USER", "ENTERPRISE_USER"];

      if (allowedRoles.includes(userRole)) {
        // ✅ Add expiry for 30 minutes (testing)
        const expiryTime = new Date().getTime() + 30 * 60 * 60 * 1000; // 30 minutes in ms
        const userDataWithExpiry = { ...data, expiry: expiryTime };

        localStorage.setItem('userData', JSON.stringify(userDataWithExpiry));
        router.push('/dashboard');
      } else {
        setError("Invalid user. Only business and enterprise users are allowed to access this platform.");
      }
    } else {
      setError(data.message || 'Login failed');
    }
  } catch (err) {
    setError('Network error. Please try again.');
    console.error('Login error:', err);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Card Security System</p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country Code
            </label>
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              placeholder="e.g., 3001234567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          Enter your phone number to log in
        </div>
      </div>
    </div>
  );
}
