'use client';
import React, { useState, useEffect } from 'react';

const ProxyForm = () => {
  const [proxyName, setProxyName] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [subjectsList, setSubjectsList] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await fetch('/api/admin/subjects');
      const data = await res.json();
      if (res.ok) {
        setSubjectsList(data);
      } else {
        console.error('Failed to fetch subjects:', data.error);
      }
    };

    fetchSubjects();
  }, []);

  const handleAddProxy = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/proxies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student : proxyName,  // ✅ renamed to match backend
        subject,
        date,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Proxy added successfully');
      setProxyName('');
      setSubject('');
      setDate('');
    } else {
      alert(data.error || 'Failed to add proxy');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 mt-10 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Mark a Proxy</h2>
      <form onSubmit={handleAddProxy} className="space-y-4">
        <input
          type="text"
          placeholder="Name of the person"
          value={proxyName}
          onChange={(e) => setProxyName(e.target.value)}
          className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          required
        />

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          required
        >
          <option value="">Select subject</option>
          {subjectsList.map((subj) => (
            <option key={subj._id} value={subj.name}>{subj.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Submit Proxy
        </button>
      </form>
    </div>
  );
};

export default ProxyForm;