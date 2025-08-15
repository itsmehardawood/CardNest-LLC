// 'use client';

// import { useEffect, useState } from 'react';
// import { ShieldCheck } from 'lucide-react';
// import { apiFetch } from '@/app/lib/api.js';

// export default function GrantAccessForm() {
//   const [adminEmail, setAdminEmail] = useState('');
//   const [userEmail, setUserEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);

//   // ✅ Load admin email from   
//   useEffect(() => {
//     const storedUser = localStorage.getItem('userData');
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         if (parsedUser.user.email) {
//           setAdminEmail(parsedUser.user.email);
//         }
//       } catch (err) {
//         console.error('Invalid userData in localStorage', err);
//       }
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);
//     setError(null);

//     try {
//       const res = await apiFetch('/superadmin/grant-subadmin-access', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           admin_email: adminEmail,
//           user_email: userEmail,
//           role: 'SUPER_ADMIN',
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || 'Something went wrong.');
//       }

//       setMessage('Access granted successfully!');
//       setUserEmail(''); // Clear only user email
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="text-black max-w-md mx-auto bg-white shadow-md rounded-md p-6 mt-10 border">
//       <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
//         <ShieldCheck className="text-green-500" />
//         Grant Sub-Admin Access
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Admin Email</label>
//           <input
//             type="email"
//             value={adminEmail}
//             disabled
//             className="w-full border border-gray-300 bg-gray-100 text-gray-600 rounded px-3 py-2 focus:outline-none"
//             placeholder="admin@example.com"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">User Email</label>
//           <input
//             type="email"
//             value={userEmail}
//             onChange={(e) => setUserEmail(e.target.value)}
//             required
//             className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
//             placeholder="user@example.com"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {loading ? 'Granting Access...' : 'Grant Access'}
//         </button>

//         {message && <p className="text-green-600 text-sm">{message}</p>}
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//       </form>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { apiFetch } from '@/app/lib/api.js';

export default function GrantAccessForm() {
  const [adminEmail, setAdminEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Load admin email from   
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.user.email) {
          setAdminEmail(parsedUser.user.email);
        }
      } catch (err) {
        console.error('Invalid userData in localStorage', err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await apiFetch('/superadmin/grant-subadmin-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_email: adminEmail,
          user_email: userEmail,
          role: 'SUPER_ADMIN',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setMessage('Access granted successfully!');
      setUserEmail(''); // Clear only user email
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white max-w-md mx-auto bg-black shadow-md rounded-md p-6 mt-10 border border-gray-800">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <ShieldCheck className="text-green-400" />
        Grant Sub-Admin Access
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Admin Email</label>
          <input
            type="email"
            value={adminEmail}
            disabled
            className="w-full border border-gray-600 bg-gray-800 text-gray-400 rounded px-3 py-2 focus:outline-none"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">User Email</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            className="w-full border border-gray-600 bg-black text-white rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            placeholder="user@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Granting Access...' : 'Grant Access'}
        </button>

        {message && <p className="text-green-400 text-sm">{message}</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
    </div>
  );
}