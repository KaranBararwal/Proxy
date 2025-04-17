'use client';
import React, { useState, useEffect } from 'react';

const ProxyForm = () => {
  const [proxyName, setProxyName] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [subjectsList, setSubjectsList] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  // Fetch session user
  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (res.ok && data?.user?.email) {
        setUserEmail(data.user.email);
      }
    };

    fetchSession();
  }, []);

  // Fetch subjects from admin API
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

  // Handle form submit
  const handleAddProxy = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/mark-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject,
        student: proxyName,
        date,
        markedBy: userEmail,
        markedFor: proxyName, // marking for this user
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Proxy marked successfully (pending approval)');
      setProxyName('');
      setSubject('');
      setDate('');
    } else {
      alert(data.message || 'Failed to mark proxy');
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