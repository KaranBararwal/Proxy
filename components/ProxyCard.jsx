import React from 'react';
import { useRouter } from 'next/navigation';
const ProxyCard = ({ proxiesGiven, proxiesReceived, loading, error }) => {
  const router = useRouter();

  const LoadingSpinner = () => (
    <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  );

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 mt-10 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
        Proxy Summary
      </h2>

      {error && (
        <p className="text-center text-red-500 text-sm mb-2">
          Failed to load proxy counts. Please try again.
        </p>
      )}

      <div className="space-y-4">
        {/* You've Marked */}
        <div
          onClick={() => router.push('/proxies-marked')}
          className="group flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 transition"
        >
          <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            ✅ Proxies You've Marked
          </span>
          <div className="flex items-center gap-2">
            {loading ? <LoadingSpinner /> : <span className="text-blue-600 dark:text-blue-400 text-xl font-semibold">{proxiesGiven}</span>}
            <span className="text-blue-600 dark:text-blue-400 transform transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>

        {/* Marked for You */}
        <div
          onClick={() => router.push('/proxies-for-you')}
          className="group flex justify-between items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-800 transition"
        >
          <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            🧍 Proxies Marked for You
          </span>
          <div className="flex items-center gap-2">
            {loading ? <LoadingSpinner /> : <span className="text-green-600 dark:text-green-400 text-xl font-semibold">{proxiesReceived}</span>}
            <span className="text-green-600 dark:text-green-400 transform transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProxyCard;