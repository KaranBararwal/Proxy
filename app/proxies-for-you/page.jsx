'use client'
import React, { useEffect, useState } from 'react'

export default function ProxiesForYouPage() {
  const [proxies, setProxies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProxies = async () => {
      try {
        const res = await fetch('/api/proxies/for-you')
        const data = await res.json()
        if (Array.isArray(data)) {
          setProxies(data)
        } else {
          setProxies([])
        }
      } catch (err) {
        console.error('Error fetching proxies:', err)
        setProxies([])
      } finally {
        setLoading(false)
      }
    }

    fetchProxies()
  }, [])

  const handleAction = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/proxies/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus }),
      })

      if (res.ok) {
        setProxies(prev =>
          prev.map(proxy =>
            proxy._id === id ? { ...proxy, status: newStatus } : proxy
          )
        )
      } else {
        const err = await res.json()
        alert(`Failed to update: ${err.error}`)
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Proxies Marked for You
        </h1>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        ) : proxies.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No pending proxy requests.</p>
        ) : (
          <div className="space-y-4">
            {proxies.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-lg text-gray-700 dark:text-gray-200">
                  📕 <span className="font-semibold">{item.subject}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">Marked by: {item.markedBy}</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">Date: {item.date}</p>
                <p className="text-sm mt-2">
                  Status: <span className="font-medium">{item.status}</span>
                </p>

                {item.status === 'pending' && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    <button
                      onClick={() => handleAction(item._id, 'accepted')}
                      className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(item._id, 'rejected')}
                      className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
