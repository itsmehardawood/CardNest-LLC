'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAutoLogout = () => {
  const router = useRouter();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (!storedData) return;

    // Check if expiry property exists
    if (!storedData.expiry) {
      console.warn('userData missing expiry property, session will not auto-logout');
      return;
    }

    // Calculate remaining time until expiry
    const timeout = storedData.expiry - new Date().getTime();

    if (timeout <= 0) {
      // Session already expired
      console.log('Session expired, redirecting to login');
      localStorage.removeItem('userData');
      router.push('/login');
      return;
    }

    console.log(`Session will expire in ${Math.round(timeout / 1000 / 60)} minutes`);

    // Set timer to auto logout when expiry is reached
    const timer = setTimeout(() => {
      console.log('Session expired, auto-logging out');
      localStorage.removeItem('userData');
      router.push('/login');
    }, timeout);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [router]);
};

export default useAutoLogout;
