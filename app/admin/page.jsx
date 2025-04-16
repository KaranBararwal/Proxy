'use client';
import { useState, useEffect } from 'react';

const AdminPage = () => {
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]); // state to hold all the subjects
  const [message, setMessage] = useState(''); // Optional: Use message to show success/error feedback

  // Fetch all the subjects when the component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await fetch('/api/admin/subjects');
      const data = await res.json();

      if (res.ok) {
        setSubjects(data); // Set fetched subjects to state
      } else {
        console.error('Failed to fetch subjects:', data.error);
      }
    };

    fetchSubjects();
  }, []); // Empty array means it runs once when the component mounts

  const handleAddSubject = async (e) => {
    e.preventDefault();

    console.log('Sending subject:', subject); // 👈 Log the subject to the console

    const res = await fetch('/api/admin/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: subject }), // Send the 'subject' state here
    });

    const data = await res.json();
    console.log('Response from API:', data);

    if (res.ok) {
      setMessage('Subject added successfully!');
      setSubject(''); // Reset the subject input field after successful submission
      setSubjects([...subjects, { name: subject }]); // Add the new subject to the list
    } else {
      setMessage(data.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin - Upload Subject</h1>

      {/* Add Subject Form */}
      <form onSubmit={handleAddSubject} className="max-w-md">
        <input
          type="text"
          placeholder="Enter subject name"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-600"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Add Subject
        </button>
      </form>

      {/* Display feedback message */}
      {message && <p className="mt-4 text-sm text-white">{message}</p>}

      {/* List of subjects */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Existing Subjects</h2>
        <ul className="text-white">
          {subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <li key={index} className="mb-2">{subject.name}</li>
            ))
          ) : (
            <p>No subjects added yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;