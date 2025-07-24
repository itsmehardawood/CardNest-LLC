// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// export default function SignupPage() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();
//   // Form state
//   const [email, setEmail] = useState('');
//   const [phoneNo, setPhoneNo] = useState('');
//   const [countryName, setCountryName] = useState('');
//   const [countryCode, setCountryCode] = useState('+92');
//   const handleSignup = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           phone_no: phoneNo,
//           country_name: countryName,
//           country_code: countryCode,
//         }),
//       });
//       const data = await response.json();
//       if (data.status === true) {
//         localStorage.setItem('userData', JSON.stringify(data));
//         router.push('/dashboard');
//       } else {
//         setError(data.message || 'Signup failed');
//       }
//     } catch (err) {
//       console.error('Signup error:', err);
//       setError('Network error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
//           <p className="text-gray-600">Card Security System</p>
//         </div>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500"
//               placeholder="example@domain.com"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//             <input
//               type="text"
//               value={phoneNo}
//               onChange={e => setPhoneNo(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500"
//               placeholder="Enter phone number"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label>
//             <input
//               type="text"
//               value={countryName}
//               onChange={e => setCountryName(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500"
//               placeholder="Pakistan"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
//             <input
//               type="text"
//               value={countryCode}
//               onChange={e => setCountryCode(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500"
//               placeholder="+92"
//             />
//           </div>
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//               {error}
//             </div>
//           )}
//           <button
//             onClick={handleSignup}
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <div className="flex items-center justify-center">
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                 Signing up...
//               </div>
//             ) : (
//               'Sign Up'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter()
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://cardsecuritysystem-8xdez.ondigitalocean.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country_code: '+92',
          login_input: 'test@hotmail.com'
        }),
      });
      const data = await response.json();
      if (data.status === true) {
        // In your actual Next.js project, use:
        localStorage.setItem('userData', JSON.stringify(data));
        // For demo purposes in this environment:
        // console.log('Login successful:', data);
        // alert('Login successful! Redirecting to dashboard...');
        // In your actual Next.js project, use:
        // window.location.href = '/dashboard';
        // or with Next.js router:
        router.push('/dashboard');
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
              value="3084352638"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
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









