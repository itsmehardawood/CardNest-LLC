
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api.js';
export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [Email, setEmail] = useState("")
  const router = useRouter()
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
          country_code: '+92',
          login_input: Email
        }),
      });
      const data = await response.json();
      if (data.status === true) {
        // In your actual Next.js project, use:
        localStorage.setItem('userData', JSON.stringify(data));
        // For demo purposes in this environment:
        console.log('Login successful:', data);
        // alert('Login successful! Redirecting to dashboard...');
        // In your actual Next.js project, use:
        // window.location.href = '/dashboard';
        // or with Next.js router:
        router.push('/admin');
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
              value="+92"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login Input
            </label>
            <input
              type="text"
              value={Email}
  onChange={(e) => setEmail(e.target.value)}
       
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-black"
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
          Demo login with static credentials
        </div>
      </div>
    </div>
  );
}









