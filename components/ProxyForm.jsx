'use client';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProxyForm = () => {
  const [proxyName, setProxyName] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [subjectsList, setSubjectsList] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);

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

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await fetch('/api/admin/subjects');
      const data = await res.json();
      // console.log("Fetched subjects:", data);
      if (res.ok) {
        setSubjectsList(data);

        const courses = [...new Set(data.map((subj) => subj.course).filter(Boolean))];
        setAvailableCourses(courses);
      } else {
        console.error('Failed to fetch subjects:', data.error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const semesters = subjectsList
      .filter((subj) =>
        subj?.course?.trim?.().toLowerCase() === course.trim().toLowerCase()
      )
      .map((subj) => subj.semester)
      .filter(Boolean);

    const uniqueSemesters = [...new Set(semesters)];
    setAvailableSemesters(uniqueSemesters);
    setSemester('');
    setSubject('');
  }, [course, subjectsList]);

  useEffect(() => {
    const filtered = subjectsList.filter(
      (subj) =>
        subj?.course?.trim?.().toLowerCase() === course.trim().toLowerCase() &&
        subj?.semester?.trim?.().toLowerCase() === semester.trim().toLowerCase()
    );
    setFilteredSubjects(filtered);
    setSubject('');
  }, [course, semester, subjectsList]);

  const handleAddProxy = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/mark-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject,
        markedFor: proxyName,
        markedBy: userEmail,
        date,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('✅ Proxy marked successfully (pending approval)');
      setProxyName('');
      setSubject('');
      setDate('');
      setCourse('');
      setSemester('');
    } else {
      toast.error(data.message || '❌ Failed to mark proxy');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 mt-10 p-6 rounded-xl shadow-md">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

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
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          required
        >
          <option value="">Select course</option>
          {availableCourses.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          required
        >
          <option value="">Select semester</option>
          {availableSemesters.map((sem, idx) => (
            <option key={idx} value={sem}>{sem}</option>
          ))}
        </select>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          required
        >
          <option value="">Select subject</option>
          {filteredSubjects.map((subj) => (
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded cursor-pointer"
        >
          Submit Proxy
        </button>
      </form>
    </div>
  );
};

export default ProxyForm;