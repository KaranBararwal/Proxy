// app/admin/subjects/page.jsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminSubjectsPage = () => {
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!subject) {
      setError('Subject name is required');
      return;
    }

    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        body: JSON.stringify({ name: subject }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to add subject');
        return;
      }

      setSuccess('Subject added successfully');
      setSubject('');
    } catch (error) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-black/30 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Add Subject for Proxy</h2>

        <input
          type="text"
          name="subject"
          placeholder="Subject Name"
          onChange={(e) => setSubject(e.target.value)}
          value={subject}
          className="w-full p-3 mb-4 rounded bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-200"
        >
          Add Subject
        </button>

        {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}
        {success && <p className="mt-4 text-green-400 text-sm text-center">{success}</p>}
      </form>
    </div>
  );
};

export default AdminSubjectsPage;
