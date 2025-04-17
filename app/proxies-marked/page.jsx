'use client';
import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

export default function ProxiesMarkedPage() {
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProxies = async (sessionToken) => {
    
    if (!sessionToken) {
      setError('No session token found.');
      setLoading(false);
      return;
    }
    
    console.log('Session Token:', sessionToken);
    try {
      const res = await fetch('/api/proxies/by-you', {
        headers: {
          Authorization: `Bearer ${sessionToken}`, // Send the session token in Authorization header
        },
      });
  
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to fetch proxies');
        setLoading(false);
        return;
      }
  
      const data = await res.json();
      setProxies(data); // Assuming the response contains an array of proxies
      setLoading(false);
    } catch (error) {
      setError('An error occurred while fetching proxies');
      setLoading(false);
      console.error('Fetch error:', error);
    }
  };
  

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      console.log('Session:', session); // Log the full session object

      if (!session || !session.token) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      // Pass the token to the fetch function
      fetchProxies(session.token);
    };

    checkSession();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this proxy?');
    if (confirmed) {
      // Delete proxy via API
      const res = await fetch(`/api/proxies/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure you pass the token for authorization
        },
      });

      if (!res.ok) {
        setError('Failed to delete proxy');
        return;
      }

      // Update the UI by removing the deleted proxy
      setProxies(prev => prev.filter(proxy => proxy._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Proxies You’ve Marked
      </h1>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-300">{error}</p>
      ) : proxies.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No proxies marked yet.</p>
      ) : (
        <div className="space-y-4">
          {proxies.map((proxy) => (
            <div
              key={proxy._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700 flex justify-between items-center"
            >
              <div>
                <p className="text-lg text-gray-800 dark:text-white font-semibold">{proxy.subject}</p>
                <p className="text-gray-600 dark:text-gray-400">For: {proxy.student}</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">Date: {proxy.date}</p>
              </div>
              <button
                onClick={() => handleDelete(proxy._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
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