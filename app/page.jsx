'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProxyCard from '@/components/ProxyCard';
import ProxyForm from '@/components/ProxyForm';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Avoid rendering anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <ProxyCard proxiesGiven={5} proxiesReceived={3} />
      <ProxyForm />
    </div>
  );
};

export default HomePage;