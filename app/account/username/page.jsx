
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  FaUserEdit,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from 'react-icons/fa';

export default function ChangeUsernamePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [username, setUsername] = useState('');
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name);
    }
  }, [session?.user?.name]);

  const checkUsername = async (value) => {
    const trimmed = value.trim();

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(trimmed)) {
      setAvailability(null);
      return;
    }

    setChecking(true);
    setAvailability(null);
    setMessage('');

    try {
      const response = await fetch(
        `/api/account/username?username=${encodeURIComponent(trimmed)}`
      );
      const data = await response.json();

      if (!response.ok) {
        setAvailability(null);
        setMessage(data.message || 'Unable to check username.');
        setMessageType('error');
        return;
      }

      setAvailability(data.available);
      if (!data.available) {
        setMessage(data.message || 'This username is already taken.');
        setMessageType('error');
      }
    } catch {
      setAvailability(null);
      setMessage('Could not check username. Please try again.');
      setMessageType('error');
    } finally {
      setChecking(false);
    }
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    setAvailability(null);
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const trimmed = username.trim();

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(trimmed)) {
      setMessage(
        'Use 3-30 characters containing only letters, numbers, or underscores.'
      );
      setMessageType('error');
      return;
    }

    if (trimmed === session?.user?.name) {
      setMessage('This is already your current username.');
      setMessageType('error');
      return;
    }

    setSaving(true);

    try {
      // Recheck availability on the server before saving.
      const checkResponse = await fetch(
        `/api/account/username?username=${encodeURIComponent(trimmed)}`
      );
      const checkData = await checkResponse.json();

      if (!checkResponse.ok || !checkData.available) {
        setAvailability(false);
        setMessage(checkData.message || 'This username is already taken.');
        setMessageType('error');
        return;
      }

      const response = await fetch('/api/account/username', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Failed to update username.');
        setMessageType('error');
        return;
      }

        setRedirecting(true);

        try {
        await update({ name: data.username });
        } catch (error) {
        console.error('Session refresh failed:', error);
        } finally {
        window.location.replace('/');
        }
    } catch {
      setMessage('Something went wrong. Please try again.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || status === 'unauthenticated' || redirecting) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d19] px-4 pt-24">
        <FaSpinner className="animate-spin text-2xl text-violet-400" />
      </main>
    );
  }

  const isCurrentUsername = username.trim() === session?.user?.name;

  return (
    <main className="min-h-screen bg-[#080d19] px-4 pb-16 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <FaArrowLeft />
          Back to ProxyManager
        </Link>

        <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#10182a] shadow-2xl shadow-black/20">
          <div className="border-b border-white/[0.07] bg-gradient-to-r from-violet-500/[0.12] to-indigo-500/[0.06] px-6 py-7 sm:px-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <FaUserEdit className="text-xl text-violet-300" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              Change Username
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Choose a username that other students can recognize. Your email
              address and login method will remain unchanged.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-7 sm:px-8">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                New username
              </label>

              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    handleUsernameChange(event.target.value)
                  }
                  onBlur={() => checkUsername(username)}
                  autoComplete="username"
                  maxLength={30}
                  placeholder="Enter a username"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
                />

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  {checking && (
                    <FaSpinner className="animate-spin text-slate-400" />
                  )}
                  {!checking && availability === true && (
                    <FaCheckCircle className="text-emerald-400" />
                  )}
                  {!checking && availability === false && (
                    <FaTimesCircle className="text-red-400" />
                  )}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  3–30 characters: letters, numbers, and underscores.
                </p>
                <span className="shrink-0 text-xs text-slate-600">
                  {username.length}/30
                </span>
              </div>

              {checking && (
                <p className="mt-2 text-xs text-slate-400">
                  Checking availability...
                </p>
              )}

              {availability === true && !isCurrentUsername && (
                <p className="mt-2 text-xs text-emerald-400">
                  Username is available.
                </p>
              )}

              {availability === false && message && (
                <p className="mt-2 text-xs text-red-400">{message}</p>
              )}
            </div>

            {message && (
              <div
                role="status"
                className={`rounded-xl border px-4 py-3 text-sm ${
                  messageType === 'success'
                    ? 'border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300'
                    : 'border-red-400/20 bg-red-500/[0.07] text-red-300'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={
                saving ||
                checking ||
                !username.trim() ||
                isCurrentUsername
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Updating username...
                </>
              ) : (
                <>
                  <FaUserEdit />
                  Save Username
                </>
              )}
            </button>
          </form>
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Your username must be unique. You can continue signing in with your
          existing login method.
        </p>
      </div>
    </main>
  );
}