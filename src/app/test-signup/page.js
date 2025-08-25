'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api.js';
export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  // Form state
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiFetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone_no: phoneNo,
          country_name: countryName,
          country_code: countryCode,
        }),
      });


            const expiryTime = new Date().getTime() + 3 * 60 * 60 * 1000; // 3 hours from now
      const data = await response.json();
      if (data.status === true) {
        
   const userData = {
  user: {
    id: data.user.id,
    merchant_id: data.user.merchant_id,
    email: data.user.email,
    phone: data.user.phone_no,
    country_code: data.user.country_code,
    country_name: data.user.country_name,
    otp_verified: true,
    business_verified: data.user.business_verified,
    verification_reason: data.user.verification_reason,
    role: data.user.role,
    created_at: data.user.created_at,
    updated_at: data.user.updated_at,

  },
  expiry: expiryTime,
  status: data.status
};

        localStorage.setItem('userData', JSON.stringify(userData));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-600">Card Security System</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500"
              placeholder="example@domain.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phoneNo}
              onChange={e => setPhoneNo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label>
            <input
              type="text"
              value={countryName}
              onChange={e => setCountryName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500"
              placeholder="Pakistan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
            <input
              type="text"
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500"
              placeholder="+92"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing up...
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

