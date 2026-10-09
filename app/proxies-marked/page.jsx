'use client';
import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';


export default function ProxiesMarkedPage() {
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProxies = async () => {
    try {
      const res = await fetch('/api/proxies/by-you');

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to fetch proxies');
        return;
      }

      const data = await res.json();
      setProxies(data);

    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred while fetching proxies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try{
      const session = await getSession();

      if (!session) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      await fetchProxies();
    } catch(error){
      console.error('Session check failed:' , error);
      setError('Unable to verify your session.');
      setLoading(false);
    }
    };

    checkSession();
  }, []);


  const handleDelete = async (id) => {
  
    try {
      const res = await fetch(`/api/proxies/${id}`, {
        method: "DELETE",
      });
  
      const data = await res.json();

      if (!res.ok){
        throw new Error(data.error || "Failed to delete proxy");
      }
    
      // Optional: Refresh proxies after deletion
      setProxies((prev) => 
        prev.filter((proxy) => proxy._id !== id)
    );
    } catch (err) {
      console.error("Delete failed:", err.message);
      setError(err.message || "Failed to delete proxy");
    }
  };
  
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'

      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';

      case 'pending':
        default:
          return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
    }
  };

  const formatStatus = (status) => {
    if(!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };
  
return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6 pt-28">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Proxies You've Marked
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      ) : error ? (
        <p className="text-center text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : proxies.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No proxies marked yet.
        </p>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {proxies.map((proxy) => (
            <div
              key={proxy._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700 flex justify-between items-center flex-col sm:flex-row"
            >
              <div className="mb-2 sm:mb-0">
                <p className="text-lg text-gray-800 dark:text-white font-semibold">
                  {proxy.subject}
                </p>

                <p className="text-gray-600 dark:text-gray-400">
                  For: {proxy.markedFor}
                </p>

                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  Date: {proxy.date}
                </p>

                <div className="mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                    Status:
                  </span>

                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      proxy.status
                    )}`}
                  >
                    {formatStatus(proxy.status)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(proxy._id)}
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition mt-2 sm:mt-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}