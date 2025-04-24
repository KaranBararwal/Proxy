'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import ProxyCard from '@/components/ProxyCard';
import ProxyForm from '@/components/ProxyForm';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [proxyCounts, setProxyCounts] = useState({ proxiesGiven: 0, proxiesReceived: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCounts = useCallback(async (retries = 3, delay = 1000) => {
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/proxy-counts');
      const data = await res.json();

      if (res.ok) {
        setProxyCounts({
          proxiesGiven: data.markedByCount,
          proxiesReceived: data.markedForCount,
        });
      } else {
        throw new Error(data.error || 'Failed to fetch counts');
      }
    } catch (error) {
      console.error('Error fetching proxy counts:', error);
      if (retries > 0) {
        setTimeout(() => fetchCounts(retries - 1, delay * 2), delay);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      // 👇 Check if password is missing
      if (session?.user && session.user.hasPassword === false) {
        router.push('/set-password');
      } else {
        fetchCounts();
      }
    }
  }, [status, session, fetchCounts, router]);

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