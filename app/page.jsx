'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import ProxyCard from '@/components/ProxyCard';
import ProxyForm from '@/components/ProxyForm';
import { set } from 'mongoose';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [proxyCounts, setProxyCounts] = useState({ proxiesGiven: 0, proxiesReceived: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCounts = useCallback(async (retries = 3, delay = 1000) => {
      setLoading(true);
      setError(false);

    try {

      const res = await fetch('/api/proxy-counts');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch counts');
      } 

      setProxyCounts({
          proxiesGiven: data.markedByCount,
          proxiesReceived: data.markedForCount,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching proxy counts:', error);

      if (retries > 0) {
        setTimeout(() => {
          fetchCounts(retries - 1, delay * 2)
         },  delay);
      } else {
        setError(true);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    } 
    if (status === 'authenticated') {
      // 👇 Check if password is missing
      if (session?.user?.hasPassword === false) {
        router.replace('/set-password');
        return;
      }
      fetchCounts();
    }
  }, [status, session, fetchCounts, router]);

  // Do not render the home page before authentication is resolved
  if(status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Checking your session...
        </p>
      </div>
    );
  }

  // avoid using the home page while redirecting to set password
  if(session?.user?.hasPassword === false){
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Redirecting...
        </p>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="flex justify-end max-w-md mx-auto">
        {error && (
          <button
            onClick={() => fetchCounts()}
            className="text-sm px-3 py-1 mb-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Retry Fetching Count 🔄
          </button>
        )}
      </div>

      <ProxyCard
        proxiesGiven={proxyCounts.proxiesGiven}
        proxiesReceived={proxyCounts.proxiesReceived}
        loading={loading}
        error={error}
      />

      <ProxyForm />
    </div>
  );
};

export default HomePage;