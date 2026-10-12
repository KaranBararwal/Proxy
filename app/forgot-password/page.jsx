
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FaLock,
  FaEnvelope,
  FaArrowLeft,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || loading) return;

    setStatus('');
    setStatusType('');
    setLoading(true);

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || data.error || 'Unable to process your request. Please try again.'
        );
      }

      setStatus(
        data.message ||
          'If an account exists for this email, you will receive password reset instructions shortly.'
      );
      setStatusType('success');
    } catch (error) {
      setStatus(
        error.message || 'Something went wrong. Please try again later.'
      );
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d19] px-4 py-28 text-white sm:px-6">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-violet-600/[0.12] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-blue-600/[0.08] blur-3xl"
      />

      <div className="relative w-full max-w-md">
        {/* Back link */}
        <Link
          href="/login"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-violet-300"
        >
          <FaArrowLeft className="text-xs" />
          Back to Login
        </Link>

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141d32] to-[#0e1526] shadow-2xl shadow-black/20">
          <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />

          <div className="p-6 sm:p-8">
            {/* Icon */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <FaLock className="text-2xl text-violet-300" />
            </div>

            <div className="mb-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                Account recovery
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                Forgot password?
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                No worries. Enter the email address associated with your
                account and we'll help you reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email address
              </label>

              <div className="relative">
                <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus('');
                    setStatusType('');
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#080d19]/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={!email.trim() || loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-400/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending request...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            {/* Feedback message */}
            {status && (
              <div
                role={statusType === 'error' ? 'alert' : 'status'}
                aria-live="polite"
                className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                  statusType === 'success'
                    ? 'border-emerald-400/20 bg-emerald-500/[0.08] text-emerald-300'
                    : 'border-red-400/20 bg-red-500/[0.08] text-red-300'
                }`}
              >
                {statusType === 'success' ? (
                  <FaCheckCircle className="mt-1 shrink-0" />
                ) : (
                  <FaExclamationCircle className="mt-1 shrink-0" />
                )}

                <p>{status}</p>
              </div>
            )}

            <div className="mt-7 border-t border-white/[0.08] pt-5 text-center">
              <p className="text-sm text-slate-500">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-violet-300 transition hover:text-violet-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-slate-600">
          ProxyManager · Account recovery
        </p>
      </div>
    </main>
  );
}