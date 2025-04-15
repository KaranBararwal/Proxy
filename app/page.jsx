'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProxyCard from '@/components/ProxyCard';

const HomePage = () => {
  const { data: session, status } = useSession(); // Get session data from NextAuth
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-white">Loading...</p>
      </div>
    ); // Show loading state while NextAuth is determining session status
  }

  if (status === 'unauthenticated') {
    router.push('/login'); // Redirect to login page if not authenticated
    return null; // Return nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      {/* Home page content goes here */}
      <ProxyCard proxiesGiven={5} proxiesReceived={3} />
    </div>
  );
};

export default HomePage;
