'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAutoLogout = () => {
  const router = useRouter();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (!storedData) return;

    // Calculate remaining time until expiry
    const timeout = storedData.expiry - new Date().getTime();

    if (timeout <= 0) {
      // Session already expired
      localStorage.removeItem('userData');
      router.push('/login');
      return;
    }

    // Set timer to auto logout when expiry is reached
    const timer = setTimeout(() => {
      localStorage.removeItem('userData');
      router.push('/login');
    }, timeout);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [router]);
};

export default useAutoLogout;
