'use client';
import React, { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function ProxiesMarkedPage() {
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const router = useRouter();

  const fetchProxies = async (token) => {
    try {
      const res = await fetch('/api/proxies/by-you', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 401) {
          logoutUser();
        } else {
          setError(data.error || 'Failed to fetch proxies');
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      setProxies(data);
      setLoading(false);
    } catch (error) {
      setError('An error occurred while fetching proxies');
      setLoading(false);
      console.error('Fetch error:', error);
    }
  };

  const logoutUser = () => {
    signOut({ redirect: false });
    router.push('/login');
  };

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session || !session.token) {
        setError('User is not authenticated.');
        logoutUser();
        return;
      }

      setSessionToken(session.token); // store for delete use
      fetchProxies(session.token);
    };

    checkSession();
  }, []);

  const handleDelete = async (id) => {
    const token = sessionToken; // ✅ use the state value you set earlier
  
    if (!token) {
      console.error("❌ No token found in session");
      return;
    }
  
    try {
      const res = await fetch(`/api/proxies/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
  
      console.log("✅ Deleted:", data.message);
  
      // Optional: Refresh proxies after deletion
      setProxies((prev) => prev.filter((proxy) => proxy._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err.message);
    }
  };
  
  
  
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6 pt-28">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Proxies You've Marked
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 dark:text-red-300">{error}</p>
      ) : proxies.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">No proxies marked yet.</p>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {proxies.map((proxy) => {
          // console.log("🔎 proxy object:", proxy);
          return (
            
            <div
              key={proxy._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700 flex justify-between items-center flex-col sm:flex-row"
            >
              
              <div className="mb-2 sm:mb-0">
                <p className="text-lg text-gray-800 dark:text-white font-semibold">{proxy.subject}</p>
                <p className="text-gray-600 dark:text-gray-400">For: {proxy.markedFor}</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">Date: {proxy.date}</p>
              </div>
              <button
                onClick={() => handleDelete(proxy._id)}
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition mt-2 sm:mt-0"
              >
                Delete
              </button>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}