
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();

        if (res.ok && data?.user?.email) {
          setUserEmail(data.user.email);
        }
      } catch (err) {
        console.error('Failed to fetch session:', err);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('/api/admin/subjects');
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setSubjectsList(data);

          const courses = [
            ...new Set(data.map((subj) => subj.course).filter(Boolean)),
          ];

          setAvailableCourses(courses);
        } else {
          console.error('Failed to fetch subjects:', data.error);
          toast.error('Could not load subjects.');
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        toast.error('Could not load subjects.');
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    const semesters = subjectsList
      .filter(
        (subj) =>
          subj?.course?.trim?.().toLowerCase() ===
          course.trim().toLowerCase()
      )
      .map((subj) => subj.semester)
      .filter(Boolean);

    setAvailableSemesters([...new Set(semesters)]);
    setSemester('');
    setSubject('');
  }, [course, subjectsList]);

  useEffect(() => {
    const filtered = subjectsList.filter(
      (subj) =>
        subj?.course?.trim?.().toLowerCase() ===
          course.trim().toLowerCase() &&
        subj?.semester?.trim?.().toLowerCase() ===
          semester.trim().toLowerCase()
    );

    setFilteredSubjects(filtered);
    setSubject('');
  }, [course, semester, subjectsList]);

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-[#0a1020]/80 px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-500 hover:border-white/20 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50';

  const labelClass =
    'mb-2 block text-sm font-medium text-slate-300';

  const handleAddProxy = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/mark-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          markedFor: proxyName.trim(),
          date,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Proxy marked successfully! Awaiting approval.');

        setProxyName('');
        setSubject('');
        setDate('');
        setCourse('');
        setSemester('');
      } else {
        toast.error(
          data.message || data.error || 'Failed to mark proxy.'
        );
      }
    } catch (err) {
      console.error('Error marking proxy:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] p-5 shadow-2xl shadow-black/20 sm:p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />

      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-violet-600/10 blur-3xl"
      />

      <div className="relative">
        <div className="mb-7 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-2xl text-violet-200">
            ✦
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              Quick submission
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Mark a Proxy
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Select the class details and send your request for approval.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddProxy} className="space-y-5">
          <div>
            <label htmlFor="proxyName" className={labelClass}>
              Student name
            </label>

            <input
              id="proxyName"
              type="text"
              placeholder="Enter the recipient's name"
              value={proxyName}
              onChange={(e) => setProxyName(e.target.value)}
              className={inputClass}
              autoComplete="off"
              maxLength={100}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="course" className={labelClass}>
                Course
              </label>

              <select
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className={inputClass}
                required
              >
                <option value="" className="bg-[#101729]">
                  Select course
                </option>

                {availableCourses.map((c) => (
                  <option key={c} value={c} className="bg-[#101729]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="semester" className={labelClass}>
                Semester
              </label>

              <select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className={inputClass}
                disabled={!course}
                required
              >
                <option value="" className="bg-[#101729]">
                  Select semester
                </option>

                {availableSemesters.map((sem) => (
                  <option
                    key={sem}
                    value={sem}
                    className="bg-[#101729]"
                  >
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="subject" className={labelClass}>
              Subject
            </label>

            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputClass}
              disabled={!semester || filteredSubjects.length === 0}
              required
            >
              <option value="" className="bg-[#101729]">
                {semester
                  ? 'Select subject'
                  : 'Choose a course and semester first'}
              </option>

              {filteredSubjects.map((subj) => (
                <option
                  key={subj._id}
                  value={subj.name}
                  className="bg-[#101729]"
                >
                  {subj.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className={labelClass}>
              Class date
            </label>

            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}
              required
            />
          </div>

          <div className="rounded-xl border border-violet-400/15 bg-violet-500/[0.06] p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg text-violet-300">ⓘ</span>

              <p className="text-xs leading-relaxed text-slate-400">
                Your request will remain pending until the recipient
                accepts or rejects it. Double-check the student, subject,
                and date before submitting.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-4 font-semibold text-white shadow-lg shadow-violet-900/20 transition duration-300 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1020] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>
              {submitting ? 'Submitting request...' : 'Submit Proxy'}
            </span>

            {!submitting && (
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProxyForm;