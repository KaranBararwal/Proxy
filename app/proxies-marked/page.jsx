'use client'
import React, { useState } from 'react'

const initialProxies = [
  { id: 1, subject: 'Maths', student: 'Raj Sharma', date: '2025-04-03' },
  { id: 2, subject: 'Physics', student: 'Neha Joshi', date: '2025-04-05' },
  { id: 3, subject: 'DBMS', student: 'Aman Gupta', date: '2025-04-07' }
]

export default function ProxiesMarkedPage() {
  const [proxies, setProxies] = useState(initialProxies)

  const handleDelete = (id) => {
    const confirmed = confirm('Are you sure you want to delete this proxy?')
    if (confirmed) {
      setProxies(prev => prev.filter(proxy => proxy.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Proxies You’ve Marked
      </h1>

      {proxies.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No proxies marked yet.</p>
      ) : (
        <div className="space-y-4">
          {proxies.map((proxy) => (
            <div
              key={proxy.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700 flex justify-between items-center"
            >
              <div>
                <p className="text-lg text-gray-800 dark:text-white font-semibold">{proxy.subject}</p>
                <p className="text-gray-600 dark:text-gray-400">For: {proxy.student}</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">Date: {proxy.date}</p>
              </div>
              <button
                onClick={() => handleDelete(proxy.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}