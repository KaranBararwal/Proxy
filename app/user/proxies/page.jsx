// app/user/proxies/page.jsx
'use client'

import { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';

const UserProxiesPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [proxyMarked, setProxyMarked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get('token'); // Check if the user is authenticated
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    // Fetch the list of subjects available for proxy marking
    const fetchSubjects = async () => {
      const res = await fetch('/api/subjects');
      const data = await res.json();
      setSubjects(data.subjects);
    };

    fetchSubjects();
  }, []);

  const handleSubmit = async () => {
    // Mark proxy for the selected subject
    const res = await fetch('/api/user/proxy', {
      method: 'POST',
      body: JSON.stringify({ subject: selectedSubject }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (res.ok) {
      setProxyMarked(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Select Subject for Proxy</h2>

      <div className="flex justify-center mb-6">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="p-3 bg-gray-900 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Select a subject</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedSubject}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-200"
      >
        Mark Proxy
      </button>

      {proxyMarked && <p className="mt-4 text-green-400 text-center">Proxy marked successfully!</p>}
    </div>
  );
};

export default UserProxiesPage;