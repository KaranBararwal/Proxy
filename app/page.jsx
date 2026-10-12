
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { FaSpinner, FaExclamationCircle, FaRedoAlt } from 'react-icons/fa';
import ProxyCard from '@/components/ProxyCard';
import ProxyForm from '@/components/ProxyForm';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [proxyCounts, setProxyCounts] = useState({
    proxiesGiven: 0,
    proxiesReceived: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCounts = useCallback(async (retries = 3, delay = 1000) => {
    setLoading(true);
    setError(false);

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch('/api/proxy-counts', {
          cache: 'no-store',
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch counts');
        }

        setProxyCounts({
          proxiesGiven: data.markedByCount ?? 0,
          proxiesReceived: data.markedForCount ?? 0,
        });
        setLoading(false);
        return;
      } catch (err) {
        console.error('Error fetching proxy counts:', err);

        if (attempt < retries) {
          await new Promise((resolve) =>
            setTimeout(resolve, delay * 2 ** attempt)
          );
        }
      }
    }

    setError(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (status === 'authenticated') {
      if (session?.user?.hasPassword === false) {
        router.replace('/set-password');
        return;
      }

      fetchCounts();
    }
  }, [status, session?.user?.hasPassword, fetchCounts, router]);

  if (
    status === 'loading' ||
    status === 'unauthenticated' ||
    (status === 'authenticated' && session?.user?.hasPassword === false)
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d19] text-white">
        <div className="text-center">
          <FaSpinner className="mx-auto animate-spin text-3xl text-violet-400" />
          <p className="mt-4 text-sm text-slate-400">
            {status === 'loading'
              ? 'Checking your session...'
              : 'Redirecting...'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080d19] px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-96 h-96 w-96 rounded-full bg-indigo-600/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl space-y-8">
        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <FaExclamationCircle className="shrink-0 text-red-400" />
              <p className="text-sm text-red-200">
                Couldn&apos;t load proxy counts. Please try again.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchCounts()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/20 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/10 disabled:opacity-50"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaRedoAlt />
              )}
              Retry
            </button>
          </div>
        )}

        <ProxyCard
          proxiesGiven={proxyCounts.proxiesGiven}
          proxiesReceived={proxyCounts.proxiesReceived}
          loading={loading}
          error={error}
        />

        <ProxyForm />
      </div>
    </main>
  );
};

export default HomePage;
