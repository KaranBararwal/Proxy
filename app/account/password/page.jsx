
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  FaLock,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaCheckCircle,
} from 'react-icons/fa';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { status } = useSession();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [hasPassword, setHasPassword] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    let cancelled = false;

    async function checkPasswordStatus() {
      try {
        const response = await fetch('/api/account/password/status');
        const data = await response.json();

        if (!cancelled && response.ok) {
          setHasPassword(data.hasPassword);
        }
      } catch (error) {
        console.error('Unable to check password status:', error);
        if (!cancelled) setHasPassword(false);
      }
    }

    checkPasswordStatus();

    return () => {
      cancelled = true;
    };
  }, [status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (newPassword.length < 8 || newPassword.length > 128) {
      setMessage('Your new password must be between 8 and 128 characters.');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New password and confirmation do not match.');
      setMessageType('error');
      return;
    }

    if (hasPassword && !currentPassword) {
      setMessage('Please enter your current password.');
      setMessageType('error');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/account/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Unable to update password.');
        setMessageType('error');
        return;
      }

      setMessage(data.message || 'Password updated successfully.');
      setMessageType('success');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setMessage('Something went wrong. Please try again.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (
    status === 'loading' ||
    status === 'unauthenticated' ||
    hasPassword === null
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d19] px-4 pt-24">
        <FaSpinner className="animate-spin text-2xl text-violet-400" />
      </main>
    );
  }

  const passwordFields = [
    {
      id: 'newPassword',
      label: 'New password',
      value: newPassword,
      setter: setNewPassword,
      visible: showNew,
      toggle: () => setShowNew((value) => !value),
      placeholder: 'Enter your new password',
    },
    {
      id: 'confirmPassword',
      label: 'Confirm new password',
      value: confirmPassword,
      setter: setConfirmPassword,
      visible: showConfirm,
      toggle: () => setShowConfirm((value) => !value),
      placeholder: 'Re-enter your new password',
    },
  ];

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
              <FaLock className="text-xl text-violet-300" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              {hasPassword ? 'Change Password' : 'Set Password'}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {hasPassword
                ? 'Update your password to keep your account secure.'
                : 'Set a password so you can also sign in using your email and password.'}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 px-6 py-7 sm:px-8"
          >
            {hasPassword && (
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Current password
                </label>

                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrent ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
                    placeholder="Enter your current password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrent((value) => !value)}
                    aria-label={
                      showCurrent ? 'Hide current password' : 'Show current password'
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showCurrent ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            {passwordFields.map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  {field.label}
                </label>

                <div className="relative">
                  <input
                    id={field.id}
                    type={field.visible ? 'text' : 'password'}
                    autoComplete={
                      field.id === 'newPassword'
                        ? 'new-password'
                        : 'new-password'
                    }
                    value={field.value}
                    onChange={(event) => field.setter(event.target.value)}
                    required
                    minLength={8}
                    maxLength={128}
                    className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
                    placeholder={field.placeholder}
                  />

                  <button
                    type="button"
                    onClick={field.toggle}
                    aria-label={
                      field.visible
                        ? `Hide ${field.label.toLowerCase()}`
                        : `Show ${field.label.toLowerCase()}`
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {field.visible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            ))}

            <p className="text-xs text-slate-500">
              Use a password between 8 and 128 characters.
            </p>

            {message && (
              <div
                role="status"
                className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                  messageType === 'success'
                    ? 'border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300'
                    : 'border-red-400/20 bg-red-500/[0.07] text-red-300'
                }`}
              >
                {messageType === 'success' && (
                  <FaCheckCircle className="mt-0.5 shrink-0" />
                )}
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving password...
                </>
              ) : (
                <>
                  <FaLock />
                  {hasPassword ? 'Update Password' : 'Set Password'}
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}