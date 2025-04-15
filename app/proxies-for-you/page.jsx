'use client'
import React from 'react'

const mockData = [
  { subject: 'Chemistry', student: 'Riya Kapoor', date: '2025-04-02' },
  { subject: 'Operating Systems', student: 'Sahil Verma', date: '2025-04-06' },
  { subject: 'Machine Learning', student: 'Aditi Mehta', date: '2025-04-08' }
]

export default function ProxiesForYouPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Proxies Marked for You</h1>
      <div className="space-y-4">
        {mockData.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-lg text-gray-700 dark:text-gray-200">
              📕 <span className="font-semibold">{item.subject}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">Marked by: {item.student}</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">Date: {item.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}