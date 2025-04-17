'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProxyCard from '@/components/ProxyCard';
import ProxyForm from '@/components/ProxyForm';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [proxyCounts, setProxyCounts] = useState({ proxiesGiven: 0, proxiesReceived: 0 });
  const [loading, setLoading] = useState(true); // 🔥 loading state

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/proxy-counts');
        const data = await res.json();
        if (res.ok) {
          setProxyCounts({
            proxiesGiven: data.markedByCount,
            proxiesReceived: data.markedForCount,
          });
        }
      } catch (error) {
        console.error('Error fetching proxy counts:', error);
      } finally {
        setLoading(false); // 🔥 stop loading
      }
    };

    if (status === 'authenticated') {
      fetchCounts();
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <ProxyCard
        proxiesGiven={proxyCounts.proxiesGiven}
        proxiesReceived={proxyCounts.proxiesReceived}
        loading={loading} // 🔥 pass loading to ProxyCard
      />
      <ProxyForm />
    </div>
  );
};

export default HomePage;