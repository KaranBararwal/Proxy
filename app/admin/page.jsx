'use client';
import { useState, useEffect } from 'react';
import { FaBookOpen } from 'react-icons/fa';


const AdminPage = () => {
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('/api/admin/subjects');
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setSubjects(data.sort((a, b) => a.name.localeCompare(b.name)));
        } else {
          throw new Error(data.error || 'Failed to fetch subjects');
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!subject.trim()) {
      setError('Subject name cannot be empty.');
      return;
    }

    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: subject.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Subject added successfully!');
        setSubjects(prev => [...prev, { name: subject.trim() }]);
        setSubject('');
      } else {
        throw new Error(data.error || 'Failed to add subject');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 px-4">
      {/* Centering content container */}
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6 text-white">Admin - Upload Subject</h1>

        <form onSubmit={handleAddSubject} className="mb-6">
          <input
            type="text"
            placeholder="Enter subject name"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-600"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
          >
            Add Subject
          </button>
        </form>

        {message && <p className="mt-4 text-green-400 text-sm">{message}</p>}
        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

                  <div className="mt-10">
            <h2 className="text-2xl font-semibold text-white mb-6">Existing Subjects</h2>
            {loading ? (
              <p className="text-white">Loading...</p>
            ) : subjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.map((s, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-300 dark:border-gray-700 flex items-center gap-3"
                  >
                    <FaBookOpen className="text-blue-600 text-xl" />
                    <p className="text-gray-800 dark:text-white font-medium text-lg">{s.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white">No subjects added yet.</p>
            )}
          </div>
      </div>
    </div>
  );
};

export default AdminPage;