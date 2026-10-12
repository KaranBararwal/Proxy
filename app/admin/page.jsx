
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  FaBookOpen,
  FaPlus,
  FaSpinner,
  FaTrashAlt,
  FaExclamationCircle,
  FaGraduationCap,
} from 'react-icons/fa';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    name: '',
    course: '',
    semester: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (
      status === 'authenticated' &&
      session?.user?.role !== 'admin'
    ) {
      router.replace('/');
    }
  }, [status, session?.user?.role, router]);

  async function loadSubjects() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/subjects', {
        cache: 'no-store',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load subjects.');
      }

      setSubjects(data);
    } catch (err) {
      setError(err.message || 'Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      loadSubjects();
    }
  }, [status, session?.user?.role]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSaving(true);

      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add subject.');
      }

      setSuccess('Subject added successfully.');
      setForm({ name: '', course: '', semester: '' });
      await loadSubjects();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  if (
    status === 'loading' ||
    status === 'unauthenticated' ||
    session?.user?.role !== 'admin'
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d19] text-white">
        <FaSpinner className="animate-spin text-3xl text-violet-400" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-8 pt-16 text-white sm:px-6 sm:py-10 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            Administration
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Academic management
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Manage the courses, semesters, and subjects used by students
            when creating proxy requests.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.06] p-4 text-sm text-red-300">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4 text-sm text-emerald-300">
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="h-fit rounded-2xl border border-white/[0.08] bg-[#111a2c] p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <FaPlus />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Add a subject</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Add a subject to a course and semester.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                {
                  key: 'name',
                  label: 'Subject name',
                  placeholder: 'e.g. Data Structures',
                },
                {
                  key: 'course',
                  label: 'Course',
                  placeholder: 'e.g. B.Tech CSE',
                },
                {
                  key: 'semester',
                  label: 'Semester',
                  placeholder: 'e.g. Semester 3',
                },
              ].map((field) => (
                <div key={field.key}>
                  <label
                    htmlFor={field.key}
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.key}
                    value={form[field.key]}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/70"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPlus />
                )}
                {saving ? 'Adding subject...' : 'Add subject'}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-[#111a2c] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                  <FaBookOpen />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Subjects</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Existing academic subjects
                  </p>
                </div>
              </div>

              <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-sm text-slate-300">
                {subjects.length}
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <FaSpinner className="animate-spin text-xl text-violet-400" />
              </div>
            ) : subjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
                <FaGraduationCap className="mx-auto text-2xl text-slate-500" />
                <p className="mt-3 text-sm text-slate-300">
                  No subjects yet
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Add your first subject using the form.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="rounded-xl border border-white/[0.07] bg-[#080d19]/60 p-4"
                  >
                    <p className="font-medium text-slate-100">
                      {subject.name}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="rounded-md bg-white/[0.05] px-2 py-1">
                        {subject.course}
                      </span>
                      <span className="rounded-md bg-white/[0.05] px-2 py-1">
                        {subject.semester}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}