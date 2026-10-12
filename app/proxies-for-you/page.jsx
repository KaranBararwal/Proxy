
'use client';

import React, { useEffect, useState, useCallback } from 'react';

export default function ProxiesForYouPage() {
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState([]);

  const fetchProxies = useCallback(async () => {
    try {
      const res = await fetch('/api/proxies/for-you', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch proxies');
      }

      const data = await res.json();
      setProxies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching proxies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;
    let timeoutId;

    const pollProxies = async () => {
      try {
        const res = await fetch('/api/proxies/for-you', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch proxies');
        }

        const data = await res.json();

        if (isActive) {
          setProxies(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isActive) {
          console.error('Error fetching proxies:', err);
        }
      } finally {
        if (isActive) {
          setLoading(false);
          timeoutId = setTimeout(pollProxies, 5000);
        }
      }
    };

    pollProxies();

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const handleAction = async (id, newStatus) => {
    if (processingIds.includes(id)) return;

    setProcessingIds((prev) => [...prev, id]);

    try {
      const res = await fetch(`/api/proxies/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          `Failed to update: ${
            data.error || 'Please refresh and try again.'
          }`
        );

        await fetchProxies();
        return;
      }

      // Refresh the entire list because accepting one request
      // may reject competing requests for the same class.
      await fetchProxies();
    } catch (err) {
      console.error('Error updating proxy status:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setProcessingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Proxies Marked for You
        </h1>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">
            Loading proxy requests...
          </p>
        ) : proxies.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No proxy requests found.
          </p>
        ) : (
          <div className="space-y-4">
            {proxies.map((item) => {
              const isProcessing = processingIds.includes(item._id);

              return (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-lg text-gray-700 dark:text-gray-200">
                    📕 <span className="font-semibold">{item.subject}</span>
                  </p>

                  <p className="text-gray-600 dark:text-gray-400">
                    Marked by: {item.markedBy}
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Date: {item.date}
                  </p>

                  <p className="text-sm mt-3">
                    Status:{' '}
                    <span
                      className={`inline-block rounded-full px-3 py-1 font-medium capitalize ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </p>

                  {item.status === 'pending' && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      <button
                        onClick={() =>
                          handleAction(item._id, 'accepted')
                        }
                        disabled={isProcessing}
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : 'Accept'}
                      </button>

                      <button
                        onClick={() =>
                          handleAction(item._id, 'rejected')
                        }
                        disabled={isProcessing}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}